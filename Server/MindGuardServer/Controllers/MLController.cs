using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Helpers;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MLController : ControllerBase
    {
        private readonly MLService _mlService;

        public MLController(MLService mlService)
        {
            _mlService = mlService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetDaily(int userId, [FromQuery] int days = 90)
        {
            var data = await _mlService.GetDailyData(userId, days);
            return Ok(ApiResponse<IEnumerable<DailyRecordDTO>>.Success(data));
        }
    }
}

