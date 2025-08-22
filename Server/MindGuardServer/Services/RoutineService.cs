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
    }
}
