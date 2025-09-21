using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services.Interfaces
{
    public interface ISummaryService
    {
        Task<Weekly_Summary> AddSummary(Weekly_Summary summary);
        Task<IEnumerable<Weekly_Summary>> GetSummaryByUserId(int userid);
        Task<Weekly_Summary> GenerateWeeklySummary(int userId);
    }
}
