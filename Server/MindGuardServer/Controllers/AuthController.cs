using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;

        public AuthController(JwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserResponseDto>> Login(UserLoginDto user)
        {
            var result = await _jwtService.Authenticate(user);
            if(result is null)
            {
                return Unauthorized();
            }
            return result;
        }

        [HttpPost("Register")]
        public async Task<ActionResult<UserResponseDto>> Register(UserCreateDto user)
        {
            var result = await _jwtService.Register(user);
            if (result is null)
                return BadRequest("Email already in use or invalid data.");

            return result; 
        }

    }
}
