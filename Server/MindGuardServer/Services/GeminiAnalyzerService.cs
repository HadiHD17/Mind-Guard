using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace MindGuardServer.Services
{

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
            _model = config["AI:Ollama:Model"] ?? "qwen2.5:7b-instruct";
            _temperature = double.TryParse(config["AI:Ollama:Temperature"], out var t) ? t : 0.0;
        }

        public record AiResult(string Mood, int SentimentScore);


        public virtual async Task<AiResult?> AnalyzeAsync(string text, CancellationToken ct = default)
        {
            var system = @"You are a wellbeing DIARY AGENT.
Return STRICT JSON in exactly ONE of these forms:

1) FINAL:
{ ""type"": ""final"", ""mood"": ""happy|sad|neutral|anxious|angry|stressed|calm"", ""sentiment_score"": -5..5 }

OR, if you need to analyze first:

2) TOOL REQUEST:
{ ""type"": ""tool"", ""name"": ""analyzeJournal"", ""args"": { ""text"": ""..."" } }

Rules:
- If you are not 100% certain about the mood/sentiment, call analyzeJournal FIRST.
- After a tool result is provided, ALWAYS respond with a FINAL object (type=final).
- Output must be pure JSON only (no extra text, no code fences).";

            var messages = new List<object>
            {
                new { role = "system", content = system },
                new { role = "user",   content = $"Analyze this diary text:\n{text}" }
            };

            for (int step = 0; step < 6; step++)
            {
                var payload = new
                {
                    model = _model,
                    stream = false,
                    options = new { temperature = _temperature },
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
                        var toolJson = await RunAnalyzeToolAsync(text, ct);
                        var (moodTool, scoreTool) = ParseToolJson(toolJson);
                        return new AiResult(NormalizeMood(moodTool), ClampScore(scoreTool));
                    }
                }

                if (agent.Type == "final")
                {
                    var mood = NormalizeMood(agent.Mood ?? "neutral");
                    var score = ClampScore(agent.SentimentScore ?? 0);
                    return new AiResult(mood, score);
                }

                if (agent.Type == "tool" && agent.Name == "analyzeJournal")
                {
                    var toolText = agent.Args is not null && agent.Args.TryGetValue("text", out var tObj)
                        ? tObj?.ToString() ?? text
                        : text;

                    var toolResultJson = await RunAnalyzeToolAsync(toolText, ct);
                    messages.Add(new { role = "assistant", content = content });        
                    messages.Add(new { role = "tool", content = toolResultJson }); 
                    continue;
                }

                var fallbackJson = await RunAnalyzeToolAsync(text, ct);
                var (moodFb, scoreFb) = ParseToolJson(fallbackJson);
                return new AiResult(NormalizeMood(moodFb), ClampScore(scoreFb));
            }

            return new AiResult("neutral", 0);
        }



        private async Task<string> RunAnalyzeToolAsync(string text, CancellationToken ct)
        {
            var sys = @"You are a DIARY SENTIMENT TOOL.
You MUST respond with STRICT JSON ONLY, no prose, no extra keys, no code fences.

Schema:
{
  ""mood"": ""happy|sad|neutral|anxious|angry|stressed|calm"",
  ""sentiment_score"": integer between -5 and 5
}

Guidance:
- Choose the single BEST-FIT mood for the whole entry:
  * happy: positive feelings, gratitude, joy, optimism.
  * sad: loss, grief, loneliness, crying, feeling down/hopeless/empty/depressed.
  * anxious: worry, fear, panic, spiraling, intrusive thoughts, catastrophizing.
  * angry: irritation, resentment, rage, injustice, fights, blame, swearing.
  * stressed: pressure, overwhelmed, burnout, exams, deadlines, money stress, conflict load.
  * calm: relaxed, peaceful, grounded, content, stable.
  * neutral: factual or mixed without strong emotional valence.
- sentiment_score scale:
  * -5 = extremely negative (despair, severe crisis)
  * -4 = very negative (intense sadness, panic, rage)
  * -3 = negative (definite low mood/anxiety/anger)
  * -2 = mildly negative
  * -1 = slightly negative
  *  0 = mixed/unclear/neutral
  * +1..+5 = increasing positivity/relief/joy.
- If text mentions fights, losing money, spiraling, panic, etc., it's likely negative (sad/anxious/angry/stressed).
- If unsure, use ""neutral"" and 0.

Examples (OUTPUT ONLY):
{""mood"":""sad"",""sentiment_score"":-4}
{""mood"":""anxious"",""sentiment_score"":-3}
{""mood"":""stressed"",""sentiment_score"":-2}
{""mood"":""angry"",""sentiment_score"":-3}
{""mood"":""happy"",""sentiment_score"":4}
{""mood"":""calm"",""sentiment_score"":1}";

            var user = $"Text:\n{text}";

            for (int attempt = 0; attempt < 3; attempt++)
            {
                var payload = new
                {
                    model = _model,
                    stream = false,
                    options = new { temperature = _temperature },
                    messages = new[]
                    {
                        new { role = "system", content = sys },
                        new { role = "user",   content = user }
                    }
                };

                using var resp = await _http.PostAsJsonAsync($"{_baseUrl}/api/chat", payload, ct);
                resp.EnsureSuccessStatusCode();

                var raw = await resp.Content.ReadAsStringAsync(ct);
                using var doc = JsonDocument.Parse(raw);
                var content = doc.RootElement.GetProperty("message").GetProperty("content").GetString() ?? "";

                var json = ExtractFirstJsonObject(content) ?? content;
                if (LooksLikeJson(json))
                    return json;

                user = $"STRICT JSON ONLY. Re-evaluate and output ONLY the JSON object.\nText:\n{text}";
            }

            return @"{""mood"":""neutral"",""sentiment_score"":0}";
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
            catch
            {
                return false;
            }
        }

        private static (string mood, int score) ParseToolJson(string json)
        {
            try
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
            catch
            {
                return ("neutral", 0);
            }
        }

        private static string NormalizeMood(string mood)
        {
            mood = (mood ?? "neutral").Trim().ToLowerInvariant();

 
            static string Heuristic(string m)
            {
                return m switch
                {
                    _ when m.Contains("depress") || m.Contains("empty") || m.Contains("hopeless") || m.Contains("cry") || m.Contains("grief") => "sad",
                    _ when m.Contains("spiral") || m.Contains("panic") || m.Contains("fear") || m.Contains("worry") || m.Contains("anxiety") || m.Contains("nervous") => "anxious",
                    _ when m.Contains("fight") || m.Contains("rage") || m.Contains("angry") || m.Contains("mad") || m.Contains("furious") || m.Contains("pissed") => "angry",
                    _ when m.Contains("stress") || m.Contains("overwhelm") || m.Contains("burnout") || m.Contains("deadline") || m.Contains("exam") || m.Contains("money") => "stressed",
                    _ when m.Contains("peace") || m.Contains("relax") || m.Contains("calm") || m.Contains("grounded") || m.Contains("content") => "calm",
                    _ when m.Contains("joy") || m.Contains("grateful") || m.Contains("excited") || m.Contains("happy") || m.Contains("love") => "happy",
                    _ => "neutral"
                };
            }

            var normalized = mood switch
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

            return normalized;
        }

        private static int ClampScore(int n) => Math.Max(-5, Math.Min(5, n));

        private static bool LooksLikeJson(string s) =>
            !string.IsNullOrWhiteSpace(s) && s.TrimStart().StartsWith("{") && s.TrimEnd().EndsWith("}");

        private static string? ExtractFirstJsonObject(string text)
        {
            var m = Regex.Match(text ?? "", "{[\\s\\S]*?}");
            return m.Success ? m.Value : null;
        }
    }
}
