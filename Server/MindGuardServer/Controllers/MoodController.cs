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
            var responseDTO = _mapper.Map<MoodCheckinResponseDto>(m);
            var response = new ApiResponse<MoodCheckinResponseDto>(responseDTO);
            return Ok(response);
        }
        [HttpGet("{userid}")]
        public async Task<IActionResult> GetMoodByUserId(int userid)
        {
            var mood = await _moodService.GetMoodByUserId(userid);
            var responseDTO = _mapper.Map<MoodCheckinResponseDto>(mood);
            var response = new ApiResponse<MoodCheckinResponseDto>(responseDTO);
            return Ok(response);
        }
    }
}
