using System.Globalization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using System;

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
            var now = DateTime.UtcNow;
            entry.CreatedAt = now;
            entry.UpdatedAt = now;

            var analysis = await AnalyzeWithTimeoutAsync(entry.Content, ct);

            entry.DetectedEmotion = analysis?.Mood ?? "neutral";
            entry.SentimentScore = (analysis?.SentimentScore ?? 1.0);

            _context.Journal_Entries.Add(entry);
            await _context.SaveChangesAsync(ct);
            return entry;
        }

        private async Task<GeminiAnalyzerService.AiResult?> AnalyzeWithTimeoutAsync(string content, CancellationToken ct = default)
        {
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
            catch (Exception)
            {
                return null;
            }
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
