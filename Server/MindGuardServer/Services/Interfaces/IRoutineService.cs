using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services.Interfaces
{
    public interface IRoutineService
    {
        DateTime GetLebanonTime(DateTime utcTime);
        Task<Routine> AddRoutine(Routine routine);
        Task<bool> RemoveRoutine(int id);
        Task<IEnumerable<Routine>> GetRoutinesByUserId(int userid);
        Task<Routine> GetRoutineById(int id);
        Task<Routine?> GetUpcomingRoutine(int userId);
        Task<(bool Success, string Message, Routine_Occurence Occurrence, int TotalCompletions)> MarkAsCompleteAsync(int routineId);
    }
}
