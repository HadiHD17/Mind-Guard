using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            return Ok(_mapper.Map<UserResponseDto>(user));
        }

        [HttpPut("UpdateAccount/{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody]UserUpdateDto updateduser)
        {
            var user = _mapper.Map<User>(updateduser);
            await _userService.UpdateUser(id, user);
            return Ok("User updated successfully");
        }

        [HttpPut("UpdatePassword/{id}")]
        public async Task<IActionResult> UpdatePassword(int id,[FromBody]UpdatePasswordDto dto)
        {
             if (dto.NewPassword != dto.ConfirmNewPassword)
                  return BadRequest("New password and confirmation do not match.");

           var result = await _userService.UpdatePassword(id, dto);
               if (!result)
                    return BadRequest("Current password is incorrect.");

            return Ok("Password updated successfully.");

        }
    }
}
