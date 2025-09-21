using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using MindGuardServer.Services.Interfaces;

namespace MindGuardServer.Services
{
    public class EntryService : IEntryService
    {
        private readonly AppDbContext _context;
        private readonly IGeminiAnalyzerService? _ai;

        public EntryService(AppDbContext context, IGeminiAnalyzerService? ai = null)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _ai = ai;
        }

        public async Task<Journal_Entry?> AddEntry(Journal_Entry entry, CancellationToken ct = default)
        {
            if (entry is null) return null;

            var now = DateTime.UtcNow;
            entry.CreatedAt = now;
            entry.UpdatedAt = now;

            var analysis = await AnalyzeWithTimeoutAsync(entry.Content, ct);

            entry.DetectedEmotion = analysis?.Mood ?? "neutral";
            entry.SentimentScore = analysis?.SentimentScore ?? 1.0;

            _context.Journal_Entries.Add(entry);
            await _context.SaveChangesAsync(ct);
            return entry;
        }

        private async Task<GeminiAnalyzerService.AiResult?> AnalyzeWithTimeoutAsync(string content, CancellationToken ct = default)
        {
            if (_ai is null || !_ai.IsConfigured) return null;

            try
            {
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(TimeSpan.FromSeconds(60));
                return await _ai.AnalyzeAsync(content, cts.Token);
            }
            catch (TaskCanceledException)
            {
                return null;
            }
            catch
            {
                return null;
            }
        }

        public Task<List<Journal_Entry>> GetEntryByUserId(int userid) =>
            _context.Journal_Entries.Where(e => e.UserId == userid).OrderByDescending(e=>e.CreatedAt).ToListAsync();

        public Task<Journal_Entry?> GetEntryById(int id) =>
            _context.Journal_Entries.FindAsync(id).AsTask();
    }
}
