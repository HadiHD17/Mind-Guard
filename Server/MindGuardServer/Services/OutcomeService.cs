using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services
{
    public class OutcomeService
    {
        private readonly AppDbContext _context;
        public OutcomeService(AppDbContext context) => _context = context;

        public async Task<Outcome> AddOutcome(Outcome outcome)
        {
            await _context.Outcomes.AddAsync(outcome);
            await _context.SaveChangesAsync();
            return outcome;
        }

        public async Task<List<Outcome>> GetByUser(int userId, int take = 50)
        {
            return await _context.Outcomes
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OccurredAt)
                .Take(take)
                .ToListAsync();
        }

        public async Task<Outcome?> GetLatest(int userId)
        {
            return await _context.Outcomes
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OccurredAt)
                .FirstOrDefaultAsync();
        }
    }
}
