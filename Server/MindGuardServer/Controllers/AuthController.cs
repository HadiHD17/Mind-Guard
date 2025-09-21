using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IJwtService _jwtService;

        public AuthController(IJwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("Login")]
        [SwaggerOperation(Summary = "User login", Description = "Authenticate and return JWT.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Login successful.", typeof(UserResponseDto))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid request payload.")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Invalid credentials.")]

        public async Task<ActionResult<UserResponseDto>> Login([FromBody] UserLoginDto user)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request payload.");

            var result = await _jwtService.Authenticate(user);
            if (result is null)
                return Unauthorized("Invalid credentials.");

            return Ok(result);
        }

        [HttpPost("Register")]
        [SwaggerOperation(Summary = "User registration", Description = "Register a new user and return JWT.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Registration successful.", typeof(UserResponseDto))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Email already in use or invalid data.")]

        public async Task<ActionResult<UserResponseDto>> Register([FromBody] UserCreateDto user)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request payload.");

            var result = await _jwtService.Register(user);
            if (result is null)
                return BadRequest("Email already in use or invalid data.");

            return Ok(result);
        }
    }
}
