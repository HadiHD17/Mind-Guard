using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Get user by id", Description = "Returns a user’s profile by identifier.")]
        [SwaggerResponse(StatusCodes.Status200OK, "User retrieved.", typeof(ApiResponse<UserResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "User not found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetById(int id)
        {
            if (id <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));

            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound(ApiResponse<object>.Error("User not found."));

            var dto = _mapper.Map<UserResponseDto>(user);
            return Ok(ApiResponse<UserResponseDto>.Success(dto));
        }

        [HttpPut("UpdateAccount/{id}")]
        [Consumes("application/json")]
        [SwaggerOperation(Summary = "Update account", Description = "Updates basic account fields (name, email, phone, preferences).")]
        [SwaggerResponse(StatusCodes.Status200OK, "Account updated.", typeof(ApiResponse<UserResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid payload or user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "User not found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] UserUpdateDto updateduser)
        {
            if (id <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Error("Invalid payload."));

            var u = await _userService.UpdateUser(id, updateduser);
            if (u == null)
                return NotFound(ApiResponse<object>.Error("User not found."));

            var dto = _mapper.Map<UserResponseDto>(u);
            return Ok(ApiResponse<UserResponseDto>.Success(dto));
        }

        [HttpPut("UpdatePassword/{id}")]
        [Consumes("application/json")]
        [SwaggerOperation(Summary = "Update password", Description = "Updates the user’s password after validating confirmation matches and service rules.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Password updated.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id, passwords do not match, or password update failed.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "User not found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] UpdatePasswordDto dto)
        {
            if (id <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Error("Invalid payload."));
            if (dto.NewPassword != dto.ConfirmNewPassword)
                return BadRequest(ApiResponse<object>.Error("Passwords do not match."));


            var existing = await _userService.GetUserById(id);
            if (existing == null)
                return NotFound(ApiResponse<object>.Error("User not found."));

            var result = await _userService.UpdatePassword(id, dto);
            if (!result)
                return BadRequest(ApiResponse<object>.Error("Password update failed."));

            return Ok(ApiResponse<object>.Success(new { UserId = id }));
        }
    }
}
