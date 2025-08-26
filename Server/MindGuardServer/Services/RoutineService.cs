using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services
{
    public class RoutineService
    {
        private readonly AppDbContext _context;
        public RoutineService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Routine> AddRoutine(Routine routine)
        {
            await _context.Routines.AddAsync(routine);
            await _context.SaveChangesAsync();
            return routine;
        }

        public async Task<bool> RemoveRoutine(int id)
        {
            var routine = await _context.Routines.FindAsync(id);
            if (routine == null)
            {
                return false;
            }
            _context.Routines.Remove(routine);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Routine>> GetRoutinesByUserId(int userid)
        {
            var routines = await _context.Routines.Where(r => r.UserId == userid).ToListAsync();
            return routines;
        }

        public async Task<Routine> GetRoutineById(int id)
        {
            var routine = await _context.Routines.FindAsync(id);
            return routine;
        }

        public async Task<(bool Success, string Message, Routine_Occurence Occurrence, int TotalCompletions)> 
            MarkAsCompleteAsync(int routineId)
        {
            var routine = await _context.Routines.FindAsync(routineId);
            if (routine == null)
            {
                return (false, "Routine not found", null, 0);
            }

            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var occurrence = await _context.Routine_Occurunces
                .FirstOrDefaultAsync(o => o.RoutineID == routineId && o.Date == today);

            if (occurrence != null)
            {
                if (occurrence.IsCompleted)
                {
                    return (false, "Already completed today", occurrence, 0);
                }

                occurrence.IsCompleted = true;
                occurrence.CompletedAt = DateTime.UtcNow;
                _context.Routine_Occurunces.Update(occurrence);
            }
            else
            {
                occurrence = new Routine_Occurence
                {
                    RoutineID = routineId,
                    Date = today,
                    IsCompleted = true,
                    CompletedAt = DateTime.UtcNow
                };
                await _context.Routine_Occurunces.AddAsync(occurrence);
            }

            routine.UpdatedAt = DateTime.UtcNow;
            _context.Routines.Update(routine);

            await _context.SaveChangesAsync();

            var totalCompletions = await _context.Routine_Occurunces
                .CountAsync(o => o.RoutineID == routineId && o.IsCompleted);

            return (true, "Marked as complete", occurrence, totalCompletions);
        }
    }
}
