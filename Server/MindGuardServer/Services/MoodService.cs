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
    }
}
