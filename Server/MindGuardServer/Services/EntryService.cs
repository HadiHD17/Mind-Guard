using System.Globalization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services
{
    public class EntryService
    {
        private readonly AppDbContext _context;
        private readonly GeminiAnalyzerService _ai;

        public EntryService(AppDbContext context, GeminiAnalyzerService ai)
        {
            _context = context;
            _ai = ai;
        }

        public async Task<Journal_Entry> AddEntry(Journal_Entry entry, CancellationToken ct = default)
        {
            var analysis = await _ai.AnalyzeAsync(entry.Content, ct);

            // Fallbacks to keep DB constraints happy
            entry.DetectedEmotion = analysis?.Mood ?? "neutral";
            // If Sentiment_Score is string in your model, save normalized string:
            entry.SentimentScore = (analysis?.SentimentScore ?? 1).ToString(CultureInfo.InvariantCulture);

            _context.Journal_Entries.Add(entry);
            await _context.SaveChangesAsync(ct);
            return entry;
        }

        public async Task<IEnumerable<Journal_Entry>> GetEntryByUserId(int userid)
        {
            var entries = await _context.Journal_Entries.Where(e => e.UserId == userid).ToListAsync();
            return entries;
        }

        public async Task<Journal_Entry> GetEntryById(int id)
        {
            var entry = await _context.Journal_Entries.FindAsync(id);
            if (entry == null)
            {
                return null;
            }
            return entry;
        }
    }
}
