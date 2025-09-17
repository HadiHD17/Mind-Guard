using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;
using Swashbuckle.AspNetCore.Annotations;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class SummaryController : ControllerBase
    {
        private readonly SummaryService _summaryservice;
        private readonly IMapper _mapper;

        public SummaryController(SummaryService summaryService, IMapper mapper)
        {
            _summaryservice = summaryService;
            _mapper = mapper;
        }

        [HttpPost("generate/{userId}")]
        [SwaggerOperation(Summary = "Generate weekly summary", Description = "Generates a weekly summary from this week’s logs for the specified user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Weekly summary generated.", typeof(ApiResponse<WeeklySummaryResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id or no logs found for this week.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "User not found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GenerateSummary(int userId)
        {
            if (userId <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));

            var summary = await _summaryservice.GenerateWeeklySummary(userId);
            if (summary == null)
                return BadRequest(ApiResponse<object>.Error("No logs found for this week."));

            var dto = _mapper.Map<WeeklySummaryResponseDto>(summary);
            return Ok(ApiResponse<WeeklySummaryResponseDto>.Success(dto));
        }

        [HttpGet("latest/{userid}")]
        [SwaggerOperation(Summary = "Get latest weekly summary", Description = "Returns the most recent weekly summary for the specified user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Latest weekly summary retrieved.", typeof(ApiResponse<WeeklySummaryResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "No weekly summaries found for this user.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetLatestSummary(int userid)
        {
            if (userid <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));

            var summaries = await _summaryservice.GetSummaryByUserId(userid);
            if (summaries == null || !summaries.Any())
                return NotFound(ApiResponse<object>.Error("No weekly summaries found."));

            var latest = summaries.OrderByDescending(s => s.CreatedAt).First();
            var dto = _mapper.Map<WeeklySummaryResponseDto>(latest);
            return Ok(ApiResponse<WeeklySummaryResponseDto>.Success(dto));
        }
    }
}
