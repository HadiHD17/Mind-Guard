using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace MindGuardServer.Services
{
    public class GeminiAnalyzerService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;

        public GeminiAnalyzerService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini API key not configured");
        }

        // Match your DB: int score instead of double
        public record AiResult(string Mood, int SentimentScore);

        public async Task<AiResult?> AnalyzeAsync(string text, CancellationToken ct = default)
        {
            var prompt = $@"
You are an assistant that analyzes diary entries.
Return ONLY a JSON object (no explanations), shaped like this:

{{
  ""mood"": ""happy"" | ""sad"" | ""neutral"" | ""anxious"" | ""angry"" | ""stressed"" | ""calm"",
  ""sentiment_score"": -5 to 5
}}

Example:
{{ ""mood"": ""anxious"", ""sentiment_score"": -3 }}

Text:
{text}";

            var body = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[] { new { text = prompt } }
                    }
                },
                generationConfig = new
                {
                    temperature = 0,
                    response_mime_type = "application/json"
                }
            };
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}";
            var json = JsonSerializer.Serialize(body);

            using var req = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            using var resp = await _http.SendAsync(req, ct);
            resp.EnsureSuccessStatusCode();

            var respText = await resp.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(respText);

            // --- Safe checks for Gemini response ---
            if (!doc.RootElement.TryGetProperty("candidates", out var candidates) ||
                candidates.GetArrayLength() == 0)
            {
                return new AiResult("neutral", 0); // fallback
            }

            var textJson = candidates[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(textJson))
                return new AiResult("neutral", 0);

            using var resultDoc = JsonDocument.Parse(textJson);
            var r = resultDoc.RootElement;

            // mood (fallback "neutral")
            string mood = "neutral";
            if (r.TryGetProperty("mood", out var moodProp) && moodProp.ValueKind == JsonValueKind.String)
            {
                mood = moodProp.GetString() ?? "neutral";
            }

            // sentiment_score (fallback 0)
            int score = 0;
            if (r.TryGetProperty("sentiment_score", out var scoreProp) && scoreProp.TryGetInt32(out var parsedScore))
            {
                score = parsedScore;
            }

            return new AiResult(mood, score);
        }
    }
}
