using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IMapper _mapper;
        public UserController(UserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<UserResponseDto>(user);
            return Ok(ApiResponse<UserResponseDto>.Success(responseDTO));
        }

        [HttpPut("UpdateAccount/{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] UserUpdateDto updateduser)
        {
            var u = await _userService.UpdateUser(id, updateduser);
            if (u == null) return NotFound(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<UserResponseDto>(u);
            return Ok(ApiResponse<UserResponseDto>.Success(responseDTO));
        }


        [HttpPut("UpdatePassword/{id}")]
        public async Task<IActionResult> UpdatePassword(int id,[FromBody]UpdatePasswordDto dto)
        {
            if (dto.NewPassword != dto.ConfirmNewPassword)
                return BadRequest(ApiResponse<object>.Error());

            var result = await _userService.UpdatePassword(id, dto);
            if (!result)
                return BadRequest(ApiResponse<object>.Error());

            return Ok(ApiResponse<object>.Success(new { UserId = id }));

        }
    }
}
