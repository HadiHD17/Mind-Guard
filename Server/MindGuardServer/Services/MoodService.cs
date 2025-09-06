using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services
{
    public class MoodService
    {
        private readonly AppDbContext _context;
        public MoodService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Mood_Checkin> AddMood(Mood_Checkin mood)
        {
            await _context.Mood_Checkins.AddAsync(mood);
            await _context.SaveChangesAsync();
            return mood;
        }
        public async Task<Mood_Checkin> GetMoodByUserId(int userid)
        {
            var latestMood = await _context.Mood_Checkins
                .Where(m => m.UserId == userid)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();
            if (latestMood == null)
            {
                return null;
            }
            return latestMood;
        }



        public virtual async Task<List<MoodDto>> GetAllMoods(int userid)
        {
            var allMoods = await _context.Mood_Checkins
                .Where(c => c.UserId == userid)
                .Select(c => new MoodDto { Mood_Label = c.Mood_Label, Source = "Checkin", Date = c.CreatedAt })
                .Union(
                    _context.Journal_Entries
                    .Where(j => j.UserId == userid && j.DetectedEmotion != null)
                    .Select(j => new MoodDto { Mood_Label = j.DetectedEmotion, Source = "Journal", Date = j.CreatedAt })
                )
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            return allMoods;
        }

        public class MoodDto
        {
            public string Mood_Label { get; set; }
            public string Source { get; set; }
            public DateTime Date { get; set; }
        }

    }
}
