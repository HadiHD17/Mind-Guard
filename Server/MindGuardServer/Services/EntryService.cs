using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services
{
    public class EntryService
    {
        private readonly AppDbContext _context;
        public EntryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Journal_Entry> AddEntry(Journal_Entry entry)
        {
            await _context.Journal_Entries.AddAsync(entry);
            await _context.SaveChangesAsync();
            return entry;
        }

        public async Task<IEnumerable<Journal_Entry>> GetEntryByUserId(int userid)
        {
            var entries = await _context.Journal_Entries.Where(e => e.UserId == userid).ToListAsync();
            return entries;
        }

        public async Task<Journal_Entry> GetEntryById(int id)
        {
            var entry = await _context.Journal_Entries.FindAsync(id);
            if (entry == null)
            {
                return null;
            }
            return entry;
        }
    }
}
