using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services.Interfaces
{
    public interface IEntryService
    {
        Task<Journal_Entry?> AddEntry(Journal_Entry entry, CancellationToken ct = default);
        Task<List<Journal_Entry>> GetEntryByUserId(int userid);
        Task<Journal_Entry?> GetEntryById(int id);
    }
}
