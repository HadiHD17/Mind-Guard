using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;
using static MindGuardServer.Services.MoodService;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MoodController : ControllerBase
    {
        private readonly MoodService _moodService;
        private readonly IMapper _mapper;

        public MoodController(MoodService moodService,IMapper mapper)
        {
            _moodService = moodService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> AddMood(MoodCheckinCreateDto mood)
        {
            var m = _mapper.Map<Mood_Checkin>(mood);
            await _moodService.AddMood(m);
            if (m == null)
                return NotFound(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<MoodCheckinResponseDto>(m);
            return Ok(ApiResponse<MoodCheckinResponseDto>.Success(responseDTO));
        }
        [HttpGet("{userid}")]
        public async Task<IActionResult> GetMoodByUserId(int userid)
        {
            var mood = await _moodService.GetMoodByUserId(userid);
            if (mood == null)
                return NotFound(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<MoodCheckinResponseDto>(mood);
            return Ok(ApiResponse<MoodCheckinResponseDto>.Success(responseDTO));
        }

        [HttpGet("All/{userid}")]
        public async Task<IActionResult> GetAllMoods(int userid)
        {
            var allmoods = await _moodService.GetAllMoods(userid);
            if (allmoods == null)
                return NotFound(ApiResponse<object>.Error());

            return Ok(ApiResponse<List<MoodDto>>.Success(allmoods));

        }
    }
}
