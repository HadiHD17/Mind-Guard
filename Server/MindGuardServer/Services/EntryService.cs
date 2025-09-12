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
        private static readonly TimeZoneInfo LebanonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Beirut");

        public EntryService(AppDbContext context, GeminiAnalyzerService ai)
        {
            _context = context;
            _ai = ai;
        }

        private DateTime ConvertToLebanonTime(DateTime utcTime)
        {
            // Store as UTC in database, convert to Lebanon time when needed
            return utcTime; // Keep as UTC for PostgreSQL compatibility
        }

        public DateTime GetLebanonTime(DateTime utcTime)
        {
            // Convert UTC to Lebanon time for display purposes
            return TimeZoneInfo.ConvertTimeFromUtc(utcTime, LebanonTimeZone);
        }

        public async Task<Journal_Entry> AddEntry(Journal_Entry entry, CancellationToken ct = default)
        {
            // Set dates as UTC for database compatibility
            var now = DateTime.UtcNow;
            entry.CreatedAt = now;
            entry.UpdatedAt = now;

            // Try to analyze the entry with AI, but don't fail if it times out
            var analysis = await AnalyzeWithTimeoutAsync(entry.Content, ct);

            // Fallbacks to keep DB constraints happy
            entry.DetectedEmotion = analysis?.Mood ?? "neutral";
            // If Sentiment_Score is string in your model, save normalized string:
            entry.SentimentScore = (analysis?.SentimentScore ?? 1.0);

            _context.Journal_Entries.Add(entry);
            await _context.SaveChangesAsync(ct);
            return entry;
        }

        private async Task<GeminiAnalyzerService.AiResult?> AnalyzeWithTimeoutAsync(string content, CancellationToken ct = default)
        {
            try
            {
                // Create a linked cancellation token that will cancel after 60 seconds
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(TimeSpan.FromSeconds(60)); // 60 second timeout for AI analysis

                return await _ai.AnalyzeAsync(content, cts.Token);
            }
            catch (TaskCanceledException)
            {
                // AI analysis timed out, return null to use fallback values
                return null;
            }
            catch (Exception)
            {
                // Any other error with AI analysis, return null to use fallback values
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
