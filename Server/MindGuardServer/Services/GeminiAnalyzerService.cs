using System.Collections.Concurrent;
using System.Net.Http;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace MindGuardServer.Services
{
    /// <summary>
    /// Agent-style diary analyzer using one tool (analyzeJournal) with robustness features:
    /// - Multilingual / mixed-language tolerant (model may translate internally; output labels fixed in English)
    /// - Strict JSON schema + auto-correction loop if model slips
    /// - Heuristic ensemble: combines LLM output with keyword sentiment for robustness
    /// - Anti-neutral bias correction (don't collapse obvious negative text to neutral)
    /// - Confidence scoring and clamping
    /// - Small in-memory cache for duplicates (content hash)
    ///
    /// Public API unchanged:
    ///   record AiResult(string Mood, int SentimentScore);
    ///   Task<AiResult?> AnalyzeAsync(string text, CancellationToken ct = default)
    ///
    /// Configuration (appsettings.json):
    /// {
    ///   "AI": {
    ///     "Ollama": { "BaseUrl": "http://localhost:11434", "Model": "qwen2.5:7b-instruct", "Temperature": 0.0 }
    ///   }
    /// }
    /// </summary>
    public class GeminiAnalyzerService
    {
        private readonly HttpClient _http;
        private readonly string _baseUrl;
        private readonly string _model;
        private readonly double _temperature;

        public GeminiAnalyzerService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _baseUrl = config["AI:Ollama:BaseUrl"] ?? "http://localhost:11434";
            _model = config["AI:Ollama:Model"] ?? "phi3.5:3.8b-mini-instruct-q4_K_M";
            _temperature = double.TryParse(config["AI:Ollama:Temperature"], out var t) ? t : 0.0;
        }

        public record AiResult(string Mood, int SentimentScore);

        private static readonly ConcurrentDictionary<string, AiResult> Cache = new();

        private static readonly string[] AllowedMoods = { "happy", "sad", "neutral", "anxious", "angry", "stressed", "calm" };

        public virtual async Task<AiResult?> AnalyzeAsync(string text, CancellationToken ct = default)
        {
            text ??= string.Empty;
            text = text?.Trim() ?? "";
            if (text.Length > 600) text = text[..600];
            // ↓ tokens → faster

            var key = Hash(text);
            if (Cache.TryGetValue(key, out var cached)) return cached;

            var system = @"You are a wellbeing DIARY AGENT.
Return JSON ONLY as either:
1) {""type"":""final"",""mood"":""happy|sad|neutral|anxious|angry|stressed|calm"",""sentiment_score"":-5..5}
OR
2) {""type"":""tool"",""name"":""analyzeJournal"",""args"":{""text"":""...""}}
If unsure, call the tool first. After any tool result, ALWAYS return a FINAL object. No prose.";


            var messages = new List<object>
            {
                new { role = "system", content = system },
                new { role = "user",   content = $"Analyze this diary text (any language):\n{text}" }
            };

            for (int step = 0; step < 2; step++)
            {
                var payload = new
                {
                    model = _model,
                    stream = false,
                    format = "json",
                    keep_alive = "3h",
                    options = new
                    {
                        temperature = _temperature,      // 0.0
                        num_predict = 32,   // was 48
                        num_ctx = 384,  // was 512
                        top_k = 8,    // was 10
                        top_p = 0.82, // was 0.85
                        repeat_penalty = 1.05,
                        num_thread = Environment.ProcessorCount,
                        stop = new[] { "}\r\n", "}\n", "}\r", "}\n\n", "}\r\n\r\n" }
                    },

                    messages
                };



                using var resp = await _http.PostAsJsonAsync($"{_baseUrl}/api/chat", payload, ct);
                resp.EnsureSuccessStatusCode();

                var raw = await resp.Content.ReadAsStringAsync(ct);
                using var doc = JsonDocument.Parse(raw);
                var content = doc.RootElement.GetProperty("message").GetProperty("content").GetString() ?? "";

                if (!TryParseAgentJson(content, out var agent))
                {
                    var recovered = ExtractFirstJsonObject(content);
                    if (recovered is null || !TryParseAgentJson(recovered, out agent))
                    {
                        var robust = await RobustAnalyzeToolAsync(text, ct);
                        Cache[key] = robust;
                        return robust;
                    }
                }

                if (agent.Type == "final")
                {
                    var mood = NormalizeMood(agent.Mood ?? "neutral");
                    var score = ClampScore(agent.SentimentScore ?? 0);
                    var final = PostProcess(text, new AiResult(mood, score));
                    Cache[key] = final;
                    return final;
                }

                if (agent.Type == "tool" && agent.Name == "analyzeJournal")
                {
                    var toolText = agent.Args is not null && agent.Args.TryGetValue("text", out var tObj)
                        ? tObj?.ToString() ?? text
                        : text;

                    var toolResult = await RobustAnalyzeToolAsync(toolText, ct);
                    messages.Add(new { role = "assistant", content = content });          
                    messages.Add(new
                    {
                        role = "tool",
                        content = JsonSerializer.Serialize(new
                        {
                            mood = toolResult.Mood,
                            sentiment_score = toolResult.SentimentScore
                        })
                    });
                    continue;
                }

                var fallback = await RobustAnalyzeToolAsync(text, ct);
                Cache[key] = fallback;
                return fallback;
            }

            var safe = new AiResult("neutral", 0);
            Cache[key] = safe;
            return safe;
        }


        private async Task<AiResult> RobustAnalyzeToolAsync(string text, CancellationToken ct)
        {
            var llm = await RunAnalyzeToolAsync(text, ct);              
            var (mood, score, conf) = ValidateAndScore(llm.mood, llm.score, text); 
            var combined = EnsembleWithHeuristic(text, new AiResult(mood, score), conf);
            return PostProcess(text, combined);
        }

        private async Task<(string mood, int score)> RunAnalyzeToolAsync(string text, CancellationToken ct)
        {
            text = text?.Trim() ?? "";
            if (text.Length > 600) text = text[..600];
            // ↓ tokens → faster

            var sys = @"You are a DIARY SENTIMENT TOOL.
Return JSON ONLY: {""mood"":""happy|sad|neutral|anxious|angry|stressed|calm"",""sentiment_score"":-5..5}.
Any language allowed; OUTPUT labels must be in the set above.
Mood hints: happy(joy/gratitude), sad(loss/hopeless/cry), anxious(worry/panic/spiral),
angry(rage/fight/blame), stressed(overwhelmed/money/job/exam/deadline), calm(peace/relaxed),
neutral(factual/mixed). Score: -5 worst .. +5 best. If unsure: neutral, 0.";

            var user = $"Text:\n{text}";

            for (int attempt = 0; attempt < 2; attempt++)
            {
                var payload = new
                {
                    model = _model,
                    stream = false,
                    format = "json",
                    keep_alive = "3h",
                    options = new
                    {
                        temperature = _temperature,      // 0.0
                        num_predict = 32,   // was 48
                        num_ctx = 384,  // was 512
                        top_k = 8,    // was 10
                        top_p = 0.82, // was 0.85
                        repeat_penalty = 1.05,
                        num_thread = Environment.ProcessorCount,
                        stop = new[] { "}\r\n", "}\n", "}\r", "}\n\n", "}\r\n\r\n" }
                    },

                    messages = new[]
                   {
        new { role = "system", content = sys },
        new { role = "user",   content = user }
    }
                };

                // 🔹 Timing start
                var sw = System.Diagnostics.Stopwatch.StartNew();

                using var resp = await _http.PostAsJsonAsync($"{_baseUrl}/api/chat", payload, ct);
                var tSend = sw.ElapsedMilliseconds;

                resp.EnsureSuccessStatusCode();

                var raw = await resp.Content.ReadAsStringAsync(ct);
                var tRead = sw.ElapsedMilliseconds - tSend;

                using var doc = JsonDocument.Parse(raw);
                var tParse = sw.ElapsedMilliseconds - tSend - tRead;

                Console.WriteLine($"[Ollama timings] send={tSend}ms, read={tRead}ms, parse={tParse}ms, total={sw.ElapsedMilliseconds}ms");
                // 🔹 Timin


                var content = doc.RootElement.GetProperty("message").GetProperty("content").GetString() ?? "";

                var json = ExtractFirstJsonObject(content) ?? content;
                if (LooksLikeJson(json))
                {
                    var (mood, score) = ParseToolJsonStrict(json);
                    if (IsAllowedMood(mood)) return (NormalizeMood(mood), ClampScore(score));
                }

                user = $"STRICT JSON ONLY (single object). OUTPUT must use allowed English labels. Re-evaluate.\nText:\n{text}";
            }

            return ("neutral", 0);
        }


        private static (string mood, int score, double conf) ValidateAndScore(string mood, int score, string text)
        {
            var m = NormalizeMood(mood);
            var s = ClampScore(score);

            var negHits = CountHits(text.ToLowerInvariant(), NegWords);
            var posHits = CountHits(text.ToLowerInvariant(), PosWords);
            var intensity = Math.Min(1.0, Math.Abs(s) / 5.0 + (negHits + posHits) * 0.1);
            var conf = 0.5 + 0.5 * intensity; 
            return (m, s, conf);
        }

        private static AiResult EnsembleWithHeuristic(string text, AiResult llm, double llmConf)
        {
            var heur = HeuristicAnalyze(text);
            if (llm.Mood == "neutral" && llm.SentimentScore == 0 && Math.Abs(heur.SentimentScore) >= 2)
                return heur;

            if (Math.Sign(heur.SentimentScore) != Math.Sign(llm.SentimentScore) && Math.Abs(heur.SentimentScore) >= 3 && Math.Abs(llm.SentimentScore) <= 1)
                return new AiResult(heur.Mood, heur.SentimentScore);

            var t = text.ToLowerInvariant();
            var neg = CountHits(t, NegWords);
            var pos = CountHits(t, PosWords);
            var result = llm;

            if (result.SentimentScore == 0)
            {
                if (neg >= 2 && pos == 0) result = new AiResult(result.Mood == "neutral" ? "sad" : result.Mood, -2);
                else if (pos >= 2 && neg == 0) result = new AiResult(result.Mood == "neutral" ? "happy" : result.Mood, 2);
            }
            return result;
        }

        private static AiResult PostProcess(string text, AiResult r)
        {
            var mood = IsAllowedMood(r.Mood) ? r.Mood : NormalizeMood(r.Mood);
            var score = ClampScore(r.SentimentScore);

            var t = text.ToLowerInvariant();
            if (mood == "neutral" && score == 0)
            {
                if (CountHits(t, VeryNegWords) >= 1) { mood = "sad"; score = Math.Min(score, -3); }
                else if (CountHits(t, NegWords) >= 2) { mood = "stressed"; score = Math.Min(score, -2); }
            }
            return new AiResult(mood, score);
        }

        private sealed class AgentEnvelope
        {
            public string? Type { get; set; }           
            public string? Name { get; set; }           
            public Dictionary<string, object>? Args { get; set; }
            public string? Mood { get; set; }           
            public int? SentimentScore { get; set; }    
        }

        private static bool TryParseAgentJson(string content, out AgentEnvelope agent)
        {
            agent = new AgentEnvelope();
            try
            {
                var json = ExtractFirstJsonObject(content) ?? content;
                using var doc = JsonDocument.Parse(json);
                var r = doc.RootElement;

                agent.Type = r.TryGetProperty("type", out var t) ? t.GetString() : null;
                agent.Name = r.TryGetProperty("name", out var n) ? n.GetString() : null;

                if (r.TryGetProperty("args", out var a) && a.ValueKind == JsonValueKind.Object)
                    agent.Args = JsonSerializer.Deserialize<Dictionary<string, object>>(a.GetRawText());

                if (r.TryGetProperty("mood", out var m) && m.ValueKind == JsonValueKind.String)
                    agent.Mood = m.GetString();

                if (r.TryGetProperty("sentiment_score", out var s))
                {
                    if (s.ValueKind == JsonValueKind.Number && s.TryGetInt32(out var i)) agent.SentimentScore = i;
                    else if (s.ValueKind == JsonValueKind.String && int.TryParse(s.GetString(), out var si)) agent.SentimentScore = si;
                }

                return !string.IsNullOrWhiteSpace(agent.Type);
            }
            catch { return false; }
        }

        private static (string mood, int score) ParseToolJsonStrict(string json)
        {
            using var doc = JsonDocument.Parse(json);
            var r = doc.RootElement;

            var mood = r.TryGetProperty("mood", out var m) && m.ValueKind == JsonValueKind.String
                ? m.GetString() ?? "neutral"
                : "neutral";

            var score = 0;
            if (r.TryGetProperty("sentiment_score", out var s))
            {
                if (s.ValueKind == JsonValueKind.Number && s.TryGetInt32(out var i)) score = i;
                else if (s.ValueKind == JsonValueKind.String && int.TryParse(s.GetString(), out var si)) score = si;
            }
            return (mood, score);
        }

        private static (string mood, int score) ParseToolJson(string json)
        {
            try { return ParseToolJsonStrict(json); }
            catch { return ("neutral", 0); }
        }

        private static bool IsAllowedMood(string mood)
        {
            mood = (mood ?? "").Trim().ToLowerInvariant();
            return AllowedMoods.Contains(mood);
        }

        private static string NormalizeMood(string mood)
        {
            mood = (mood ?? "neutral").Trim().ToLowerInvariant();
            static string Heuristic(string m) => m switch
            {
                _ when m.Contains("depress") || m.Contains("empty") || m.Contains("hopeless") || m.Contains("cry") || m.Contains("grief") => "sad",
                _ when m.Contains("spiral") || m.Contains("panic") || m.Contains("fear") || m.Contains("worry") || m.Contains("anxiety") || m.Contains("nervous") => "anxious",
                _ when m.Contains("fight") || m.Contains("rage") || m.Contains("angry") || m.Contains("mad") || m.Contains("furious") || m.Contains("pissed") => "angry",
                _ when m.Contains("stress") || m.Contains("overwhelm") || m.Contains("burnout") || m.Contains("deadline") || m.Contains("exam") || m.Contains("money") => "stressed",
                _ when m.Contains("peace") || m.Contains("relax") || m.Contains("calm") || m.Contains("grounded") || m.Contains("content") => "calm",
                _ when m.Contains("joy") || m.Contains("grateful") || m.Contains("excited") || m.Contains("happy") || m.Contains("love") => "happy",
                _ => "neutral"
            };

            return mood switch
            {
                "joy" or "joyful" or "pleased" or "content" or "excited" or "grateful" or "glad" or "delighted" => "happy",
                "sad" or "down" or "blue" or "unhappy" or "depressed" or "devastated" or "heartbroken" => "sad",
                "anxious" or "anxiety" or "worried" or "afraid" or "fearful" or "panicked" or "panicky" or "spiraling" => "anxious",
                "angry" or "mad" or "furious" or "irritated" or "resentful" or "rage" => "angry",
                "stressed" or "overwhelmed" or "burnt out" or "burned out" or "overloaded" or "pressured" => "stressed",
                "calm" or "relaxed" or "peaceful" or "serene" or "grounded" => "calm",
                "neutral" or "mixed" => "neutral",
                _ => Heuristic(mood)
            };
        }

        private static int ClampScore(int n) => Math.Max(-5, Math.Min(5, n));

        private static readonly string[] PosWords = { "joy", "grateful", "gratitude", "excited", "love", "great", "good", "happy", "proud", "hopeful", "relaxed", "calm", "peace", "content", "win", "success" };
        private static readonly string[] NegWords = { "fight", "lost money", "broke", "debt", "stress", "stressed", "panic", "anxious", "anxiety", "worry", "afraid", "angry", "rage", "furious", "sad", "cry", "empty", "hopeless", "depressed", "failure", "shame", "guilty", "overwhelmed", "burnout", "deadline", "exam", "lost", "loss" };
        private static readonly string[] VeryNegWords = { "suicid", "end it", "kill myself", "self harm", "hurt myself", "no reason to live", "despair" };

        private static AiResult HeuristicAnalyze(string text)
        {
            var t = text.ToLowerInvariant();
            int pos = CountHits(t, PosWords);
            int neg = CountHits(t, NegWords);
            int veryNeg = CountHits(t, VeryNegWords);

            if (veryNeg > 0) return new AiResult("sad", -4);

            int score = 0;
            string mood = "neutral";
            if (neg > pos)
            {
                score = Math.Clamp(-(1 + (neg / 2)), -5, -1);
                mood = (t.Contains("fight") || t.Contains("rage") || t.Contains("angry")) ? "angry"
                     : (t.Contains("anxious") || t.Contains("panic") || t.Contains("worry") || t.Contains("spiral")) ? "anxious"
                     : (t.Contains("stress") || t.Contains("overwhelm") || t.Contains("deadline") || t.Contains("exam") || t.Contains("money")) ? "stressed"
                     : "sad";
            }
            else if (pos > neg)
            {
                score = Math.Clamp(1 + (pos / 2), 1, 5);
                mood = (t.Contains("calm") || t.Contains("relaxed") || t.Contains("peace")) ? "calm" : "happy";
            }
            return new AiResult(mood, score);
        }

        private static int CountHits(string text, string[] words)
        {
            int hits = 0;
            foreach (var w in words)
            {
                if (text.Contains(w)) hits++;
            }
            return hits;
        }

        private static bool LooksLikeJson(string s) =>
            !string.IsNullOrWhiteSpace(s) && s.TrimStart().StartsWith("{") && s.TrimEnd().EndsWith("}");

        private static string? ExtractFirstJsonObject(string text)
        {
            var m = Regex.Match(text ?? "", "{[\\s\\S]*?}");
            return m.Success ? m.Value : null;
        }

        private static string Hash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input ?? ""));
            return Convert.ToHexString(bytes);
        }
    }
}
