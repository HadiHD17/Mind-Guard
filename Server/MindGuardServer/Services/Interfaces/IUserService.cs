using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;

namespace MindGuardServer.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> GetUserById(int id);
        Task<User?> UpdateUser(int id, UserUpdateDto dto);
        Task<bool> UpdatePassword(int id, UpdatePasswordDto dto);
    }
}
