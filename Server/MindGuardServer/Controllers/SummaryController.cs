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
    public class SummaryController : ControllerBase
    {
        private readonly SummaryService _summaryservice;
        private readonly IMapper _mapper;

        public SummaryController(SummaryService summaryService,IMapper mapper)
        {
            _summaryservice = summaryService;
            _mapper = mapper;
        }

        [HttpPost("generate/{userId}")]
        public async Task<IActionResult> GenerateSummary(int userId)
        {
            var summary = await _summaryservice.GenerateWeeklySummary(userId);

            if (summary == null)
                return BadRequest(ApiResponse<object>.Error("No logs found for this week."));

            // Map domain model(s) to DTO(s)
            var summaryDto = _mapper.Map<WeeklySummaryResponseDto>(summary);

            return Ok(ApiResponse<WeeklySummaryResponseDto>.Success(summaryDto));
        }


        [HttpGet("latest/{userid}")]
        public async Task<IActionResult> GetLatestSummary(int userid)
        {
            var summaries = await _summaryservice.GetSummaryByUserId(userid);

            if (summaries == null || !summaries.Any())
                return NotFound(ApiResponse<object>.Error("No weekly summaries found."));

            // Get the latest one by CreatedAt
            var latestSummary = summaries.OrderByDescending(s => s.CreatedAt).First();

            return Ok(ApiResponse<Weekly_Summary>.Success(latestSummary));
        }



    }
}
