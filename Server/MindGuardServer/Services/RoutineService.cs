using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using System.Globalization;
using MindGuardServer.Services.Interfaces;

namespace MindGuardServer.Services
{
        public class RoutineService : IRoutineService
        {
        private readonly AppDbContext _context;
        private static readonly TimeZoneInfo LebanonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Beirut");

        public RoutineService(AppDbContext context)
        {
            _context = context;
        }



        public DateTime GetLebanonTime(DateTime utcTime)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(utcTime, LebanonTimeZone);
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
            var routines = await _context.Routines
                .Include(r => r.Occurence)
                .Where(r => r.UserId == userid)
                .ToListAsync();
            return routines;
        }


        public async Task<Routine> GetRoutineById(int id)
        {
            var routine = await _context.Routines
                .Include(r => r.Occurence)
                .FirstOrDefaultAsync(r => r.Id == id);
            return routine;
        }
        public async Task<Routine?> GetUpcomingRoutine(int userId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var now = DateTime.Now.TimeOfDay;



            var allRoutines = await _context.Routines
                .Include(r => r.Occurence)
                .Where(r => r.UserId == userId)
                .ToListAsync();


            if (allRoutines.Count == 0)
            {
                return null;
            }


            var todayRoutine = allRoutines
                .Where(r => !r.Occurence.Any(o => o.Date == today && o.IsCompleted))
                .Where(r => r.Reminder_Time > now)
                .OrderBy(r => r.Reminder_Time)
                .FirstOrDefault();


            if (todayRoutine != null)
                return todayRoutine;

            var tomorrow = today.AddDays(1);
            var tomorrowRoutine = allRoutines
                .Where(r => !r.Occurence.Any(o => o.Date == tomorrow && o.IsCompleted))
                .OrderBy(r => r.Reminder_Time)
                .FirstOrDefault();


            return tomorrowRoutine;
        }

        public async Task<(bool Success, string Message, Routine_Occurence Occurrence, int TotalCompletions)>
            MarkAsCompleteAsync(int routineId)
        {


            var routine = await _context.Routines.FindAsync(routineId);
            if (routine == null)
            {
                return (false, "Routine not found", null, 0);
            }

            var today = DateOnly.FromDateTime(DateTime.Now);

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

            routine.LastCompletedDate = today;
            routine.UpdatedAt = DateTime.UtcNow;
            _context.Routines.Update(routine);

            await _context.SaveChangesAsync();

            return (true, "Marked as complete", occurrence, 0);
        }
    }
}
