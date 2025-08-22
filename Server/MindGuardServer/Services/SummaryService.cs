using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services
{
    public class SummaryService
    {
        private readonly AppDbContext _context;
        public SummaryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Weekly_Summary> AddSummary(Weekly_Summary summary)
        {
            await _context.Weekly_Summaries.AddAsync(summary);
            await _context.SaveChangesAsync();
            return summary;
        }
        public async Task<IEnumerable<Weekly_Summary>> GetSummaryByUserId(int userid)
        {
            var summaries = await _context.Weekly_Summaries.Where(summary => summary.UserId == userid).ToListAsync();
            return summaries;
        }
    }
}
