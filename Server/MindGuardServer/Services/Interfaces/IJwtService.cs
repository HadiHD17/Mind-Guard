using MindGuardServer.Models.DTO;

namespace MindGuardServer.Services.Interfaces
{
    public interface IJwtService
    {
        Task<UserResponseDto?> Authenticate(UserLoginDto user);
        Task<UserResponseDto?> Register(UserCreateDto user);
    }
}
