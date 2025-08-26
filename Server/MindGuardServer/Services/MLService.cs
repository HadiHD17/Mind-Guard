using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Helpers;
using MindGuardServer.Models.DTO;

namespace MindGuardServer.Services
{
    public class MLService
    {
        private readonly AppDbContext _context;

        public MLService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DailyRecordDTO>> GetDailyData(int userId, int days = 90)
        {
            var startDate = DateTime.UtcNow.AddDays(-days).Date;

            // Journals grouped by date
            var journalData = await _context.Journal_Entries
                .Where(j => j.UserId == userId && j.CreatedAt >= startDate)
                .GroupBy(j => j.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    SentimentScore = g.Average(j =>
                        j.SentimentScore ?? 0 
                    ),
                    DetectedEmotion = g.OrderByDescending(j => j.CreatedAt).First().DetectedEmotion,
                    WroteJournal = g.Any()
                })
                .ToListAsync();

            // Moods grouped by date
            var moodData = await _context.Mood_Checkins
                .Where(m => m.UserId == userId && m.CreatedAt >= startDate)
                .GroupBy(m => m.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    MoodLabel = g.OrderByDescending(m => m.CreatedAt).First().Mood_Label
                })
                .ToListAsync();

            // Build final records
            var allDates = Enumerable.Range(0, days)
                .Select(i => DateTime.UtcNow.Date.AddDays(-i))
                .ToList();

            var result = allDates.Select(d =>
            {
                var j = journalData.FirstOrDefault(x => x.Date == d);
                var m = moodData.FirstOrDefault(x => x.Date == d);

                var moodScore = MoodMapper.MapMood(m?.MoodLabel, j?.DetectedEmotion);

                return new DailyRecordDTO
                {
                    Date = d,
                    MoodScore = moodScore,
                    SentimentScore = j?.SentimentScore,
                    WroteJournal = j?.WroteJournal ?? false,
                    DayOfWeek = (int)d.DayOfWeek
                };
            }).OrderBy(r => r.Date).ToList();

            return result;
        }
    }
}

