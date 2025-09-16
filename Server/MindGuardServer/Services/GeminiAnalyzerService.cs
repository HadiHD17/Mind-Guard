using System.Collections.Concurrent;
using System.Net.Http;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text;

namespace MindGuardServer.Services
{

    public class GeminiAnalyzerService
    {
        private readonly HttpClient _http;
        private readonly string _model;            
        private readonly string _geminiApiKey;
        private readonly double _temperature;

        public GeminiAnalyzerService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _http.Timeout = TimeSpan.FromSeconds(15);

            _model = config["AI:Gemini:Model"] ?? "gemini-1.5-flash";
            _geminiApiKey = config["AI:Gemini:ApiKey"] ?? "";
            _temperature = double.TryParse(config["AI:Gemini:Temperature"], out var t) ? t : 0.0;

        }

        public record AiResult(string Mood, int SentimentScore);

        private static readonly ConcurrentDictionary<string, AiResult> Cache = new();

        private static readonly string[] AllowedMoods = { "happy", "sad", "neutral", "anxious", "angry", "stressed", "calm" };

        public virtual async Task<AiResult?> AnalyzeAsync(string text, CancellationToken ct = default)
        {
            text ??= string.Empty;
            text = text.Trim();
            if (text.Length > 600) text = text[..600];

            var key = Hash(text);
            if (Cache.TryGetValue(key, out var cached)) return cached;

            try
            {
                var robust = await RobustAnalyzeToolAsync(text, ct);
                var final = PostProcess(text, robust);
                Cache[key] = final;
                return final;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AI] Exception during analysis: {ex.Message}");
                Console.WriteLine($"[AI] Stack: {ex.StackTrace}");
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
            text = (text ?? "").Trim();
            if (text.Length > 600) text = text[..600];

            var sys = @"You are a DIARY SENTIMENT TOOL.
Return JSON ONLY with keys: mood (happy|sad|neutral|anxious|angry|stressed|calm) and sentiment_score (-5..5).
Any language input; output labels must be English.";

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_geminiApiKey}";

            var body = new
            {
                contents = new[]
                {
                    new {
                        role = "user",
                        parts = new[] {
                            new { text = $"{sys}\n\nText:\n{text}" }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = _temperature,
                    topK = 20,
                    topP = 0.9,
                    maxOutputTokens = 128,
                    responseMimeType = "application/json",
                    responseSchema = new
                    {
                        type = "object",
                        properties = new
                        {
                            mood = new { type = "string", @enum = AllowedMoods },
                            sentiment_score = new { type = "integer", minimum = -5, maximum = 5 }
                        },
                        required = new[] { "mood", "sentiment_score" }
                    }
                }
            };

            try
            {
                using var resp = await _http.PostAsJsonAsync(url, body, ct);
                resp.EnsureSuccessStatusCode();
                var raw = await resp.Content.ReadAsStringAsync(ct);

                using var doc = JsonDocument.Parse(raw);
                var parts = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts");

                var jsonStr = parts[0].GetProperty("text").GetString() ?? "{}";

                var (mood, score) = ParseToolJsonStrict(jsonStr);
                if (IsAllowedMood(mood)) return (NormalizeMood(mood), ClampScore(score));
            }
            catch (HttpRequestException hre)
            {
                Console.WriteLine($"[Gemini] HTTP error: {hre.Message}");
            }
            catch (TaskCanceledException tce)
            {
                Console.WriteLine($"[Gemini] Timeout/canceled: {tce.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Gemini] Unexpected: {ex.Message}");
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

            if (Math.Sign(heur.SentimentScore) != Math.Sign(llm.SentimentScore) &&
                Math.Abs(heur.SentimentScore) >= 3 &&
                Math.Abs(llm.SentimentScore) <= 1)
            {
                return new AiResult(heur.Mood, heur.SentimentScore);
            }

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

        private static readonly string[] PosWords = {
            "joy","grateful","gratitude","excited","love","great","good","happy","proud","hopeful","relaxed","calm","peace","content","win","success"
        };
        private static readonly string[] NegWords = {
            "fight","lost money","broke","debt","stress","stressed","panic","anxious","anxiety","worry","afraid","angry","rage","furious","sad","cry","empty","hopeless","depressed","failure","shame","guilty","overwhelmed","burnout","deadline","exam","lost","loss"
        };
        private static readonly string[] VeryNegWords = {
            "suicid","end it","kill myself","self harm","hurt myself","no reason to live","despair"
        };

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

        private static string Hash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input ?? ""));
            return Convert.ToHexString(bytes);
        }
    }
}
