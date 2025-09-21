namespace MindGuardServer.Services.Interfaces
{
    public interface IGeminiAnalyzerService
    {
        bool IsConfigured { get; }
        Task<GeminiAnalyzerService.AiResult?> AnalyzeAsync(string text, CancellationToken ct = default);
    }
}
