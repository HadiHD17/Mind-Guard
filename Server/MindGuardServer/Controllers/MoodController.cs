using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using static MindGuardServer.Services.MoodService;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class MoodController : ControllerBase
    {
        private readonly IMoodService _moodService;
        private readonly IMapper _mapper;

        public MoodController(IMoodService moodService, IMapper mapper)
        {
            _moodService = moodService;
            _mapper = mapper;
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Add mood check-in", Description = "Creates a new mood check-in for the authenticated user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Mood check-in created successfully.", typeof(ApiResponse<MoodCheckinResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid payload.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Failed to create mood entry.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> AddMood([FromBody] MoodCheckinCreateDto mood)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Error("Invalid payload."));

            var m = _mapper.Map<Mood_Checkin>(mood);
            await _moodService.AddMood(m);

            if (m == null)
                return NotFound(ApiResponse<object>.Error("Failed to create mood entry."));

            var responseDTO = _mapper.Map<MoodCheckinResponseDto>(m);
            return Ok(ApiResponse<MoodCheckinResponseDto>.Success(responseDTO));
        }

        [HttpGet("{userid}")]
        [SwaggerOperation(Summary = "Get latest mood check-in", Description = "Returns the most recent mood check-in for the specified user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Mood check-in retrieved.", typeof(ApiResponse<MoodCheckinResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "No mood check-in found for this user.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetMoodByUserId(int userid)
        {
            if (userid <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));

            var mood = await _moodService.GetMoodByUserId(userid);
            if (mood == null)
                return NotFound(ApiResponse<object>.Error("No mood check-in found for this user."));

            var responseDTO = _mapper.Map<MoodCheckinResponseDto>(mood);
            return Ok(ApiResponse<MoodCheckinResponseDto>.Success(responseDTO));
        }

        [HttpGet("All/{userid}")]
        [SwaggerOperation(Summary = "Get all mood check-ins", Description = "Returns the complete list of mood check-ins for the specified user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Mood check-ins retrieved.", typeof(ApiResponse<List<MoodDto>>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "No mood check-ins found for this user.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetAllMoods(int userid)
        {
            if (userid <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));

            var allmoods = await _moodService.GetAllMoods(userid);
            if (allmoods == null || !allmoods.Any())
                return NotFound(ApiResponse<object>.Error("No mood check-ins found for this user."));

            return Ok(ApiResponse<List<MoodDto>>.Success(allmoods));
        }
    }
}
