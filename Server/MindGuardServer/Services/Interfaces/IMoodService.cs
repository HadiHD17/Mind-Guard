using MindGuardServer.Models.Domain;
using static MindGuardServer.Services.MoodService;

namespace MindGuardServer.Services.Interfaces
{
    public interface IMoodService
    {
        Task<Mood_Checkin> AddMood(Mood_Checkin mood);
        Task<Mood_Checkin> GetMoodByUserId(int userid);
        Task<List<MoodDto>> GetAllMoods(int userid);
    }
}
