using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using System.Globalization;

namespace MindGuardServer.Services
{
        public class RoutineService
        {
        private readonly AppDbContext _context;
        private static readonly TimeZoneInfo LebanonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Beirut");

        public RoutineService(AppDbContext context)
        {
            _context = context;
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
            // ✅ Include occurrences when fetching the routine
            var routine = await _context.Routines
                .Include(r => r.Occurence)
                .FirstOrDefaultAsync(r => r.Id == id);
            return routine;
        }
        public async Task<Routine?> GetUpcomingRoutine(int userId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var now = DateTime.Now.TimeOfDay;

            Console.WriteLine($"=== DEBUG: GetUpcomingRoutine for user {userId} ===");
            Console.WriteLine($"Today: {today}, Current time: {now}");

            var allRoutines = await _context.Routines
                .Include(r => r.Occurence)
                .Where(r => r.UserId == userId)
                .ToListAsync();

            Console.WriteLine($"Total routines found: {allRoutines.Count}");

            if (allRoutines.Count == 0)
            {
                Console.WriteLine("No routines found for this user");
                return null;
            }

            // Debug each routine
            foreach (var routine in allRoutines)
            {
                var completedToday = routine.Occurence.Any(o => o.Date == today && o.IsCompleted);
                var isFutureTime = routine.Reminder_Time > now;

                Console.WriteLine($"\nRoutine: {routine.Description}");
                Console.WriteLine($"- Reminder Time: {routine.Reminder_Time}");
                Console.WriteLine($"- Is future time: {isFutureTime}");
                Console.WriteLine($"- Completed today: {completedToday}");
                Console.WriteLine($"- Occurrences: {routine.Occurence.Count}");

                foreach (var occ in routine.Occurence)
                {
                    Console.WriteLine($"  - Date: {occ.Date}, Completed: {occ.IsCompleted}");
                }
            }

            // Now try the actual query
            var todayRoutine = allRoutines
                .Where(r => !r.Occurence.Any(o => o.Date == today && o.IsCompleted))
                .Where(r => r.Reminder_Time > now)
                .OrderBy(r => r.Reminder_Time)
                .FirstOrDefault();

            Console.WriteLine($"\nToday's routine result: {(todayRoutine != null ? todayRoutine.Description : "NULL")}");

            if (todayRoutine != null)
                return todayRoutine;

            // Check for tomorrow
            var tomorrow = today.AddDays(1);
            var tomorrowRoutine = allRoutines
                .Where(r => !r.Occurence.Any(o => o.Date == tomorrow && o.IsCompleted))
                .OrderBy(r => r.Reminder_Time)
                .FirstOrDefault();

            Console.WriteLine($"Tomorrow's routine result: {(tomorrowRoutine != null ? tomorrowRoutine.Description : "NULL")}");

            return tomorrowRoutine;
        }

        public async Task<(bool Success, string Message, Routine_Occurence Occurrence, int TotalCompletions)>
            MarkAsCompleteAsync(int routineId)
        {
            Console.WriteLine($"=== MarkAsCompleteAsync called for routine {routineId} ===");
            Console.WriteLine($"Today's date: {DateOnly.FromDateTime(DateTime.Now)}");

            var routine = await _context.Routines.FindAsync(routineId);
            if (routine == null)
            {
                Console.WriteLine("Routine not found");
                return (false, "Routine not found", null, 0);
            }

            var today = DateOnly.FromDateTime(DateTime.Now);
            Console.WriteLine($"Looking for occurrence with date: {today}");

            var occurrence = await _context.Routine_Occurunces
                .FirstOrDefaultAsync(o => o.RoutineID == routineId && o.Date == today);

            if (occurrence != null)
            {
                Console.WriteLine($"Found existing occurrence: Date={occurrence.Date}, Completed={occurrence.IsCompleted}");
                if (occurrence.IsCompleted)
                {
                    Console.WriteLine("Already completed today");
                    return (false, "Already completed today", occurrence, 0);
                }

                occurrence.IsCompleted = true;
                occurrence.CompletedAt = DateTime.UtcNow;
                _context.Routine_Occurunces.Update(occurrence);
                Console.WriteLine($"Updated existing occurrence - CompletedAt: {occurrence.CompletedAt} (UTC)");
            }
            else
            {
                Console.WriteLine("No occurrence found for today, creating new one");
                occurrence = new Routine_Occurence
                {
                    RoutineID = routineId,
                    Date = today,
                    IsCompleted = true,
                    CompletedAt = DateTime.UtcNow
                };
                await _context.Routine_Occurunces.AddAsync(occurrence);
                Console.WriteLine($"Created new occurrence - CompletedAt: {occurrence.CompletedAt} (UTC)");
            }

            routine.LastCompletedDate = today;
            routine.UpdatedAt = DateTime.UtcNow;
            _context.Routines.Update(routine);
            Console.WriteLine($"Set LastCompletedDate to: {today}, UpdatedAt: {routine.UpdatedAt} (UTC)");

            await _context.SaveChangesAsync();
            Console.WriteLine("Changes saved successfully");

            return (true, "Marked as complete", occurrence, 0);
        }
    }
}
