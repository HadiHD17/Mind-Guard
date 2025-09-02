using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services
{
    public class SummaryService
    {
        private readonly AppDbContext _context;
        private readonly MoodService _moodService;

        public SummaryService(AppDbContext context, MoodService moodService)
        {
            _context = context;
            _moodService = moodService;
        }

        public async Task<Weekly_Summary> AddSummary(Weekly_Summary summary)
        {
            await _context.Weekly_Summaries.AddAsync(summary);
            await _context.SaveChangesAsync();
            return summary;
        }

        public async Task<IEnumerable<Weekly_Summary>> GetSummaryByUserId(int userid)
        {
            var summaries = await _context.Weekly_Summaries
                .Where(summary => summary.UserId == userid)
                .OrderByDescending(s => s.Week_Start_Date)
                .ToListAsync();
            return summaries;
        }

        public async Task<Weekly_Summary> GenerateWeeklySummary(int userId)
        {
            var oneWeekAgo = DateTime.UtcNow.AddDays(-7);

            // Get all moods + journal emotions using existing MoodService
            var allMoods = await _moodService.GetAllMoods(userId);
            var lastWeekMoods = allMoods.Where(m => m.Date >= oneWeekAgo).ToList();

            if (!lastWeekMoods.Any())
                return null;

            // Calculate most frequent mood
            var mostFrequentMood = lastWeekMoods
                .GroupBy(m => m.Mood_Label)
                .OrderByDescending(g => g.Count())
                .First()
                .Key;

            // For simplicity, we use count as avg sentiment; replace with numeric mapping if needed
            var avgSentiment = lastWeekMoods.Count;

            // Create Weekly_Summary record
            var summary = new Weekly_Summary
            {
                UserId = userId,
                Week_Start_Date = DateOnly.FromDateTime(oneWeekAgo),
                Mood_Trend = mostFrequentMood,
                AVG_Sentiment = avgSentiment,
                Insights = $"Your most frequent mood this week was {mostFrequentMood}."
            };

            return await AddSummary(summary);
        }
    }
}
