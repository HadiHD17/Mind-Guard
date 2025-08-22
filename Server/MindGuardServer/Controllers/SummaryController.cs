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

        [HttpPost]
        public async Task<IActionResult> AddSummary([FromBody]WeeklySummaryCreateDto summary)
        {
            var s = _mapper.Map<Weekly_Summary>(summary);
            await _summaryservice.AddSummary(s);
            var responseDTO = _mapper.Map<WeeklySummaryResponseDto>(s);
            var response = new ApiResponse<WeeklySummaryResponseDto>(responseDTO);
            return Ok(response);
        }

        [HttpGet("{userid}")]
        public async Task<IActionResult> GetSummaryByUserId(int userid)
        {
            var summaries = await _summaryservice.GetSummaryByUserId(userid);
            var responseDTO = _mapper.Map<IEnumerable<WeeklySummaryResponseDto>>(summaries);
            var response = new ApiResponse<IEnumerable<WeeklySummaryResponseDto>>(responseDTO);
            return Ok(response);
        }

    }
}
