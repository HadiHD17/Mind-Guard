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
    public class PredictionController : ControllerBase
    {
        private readonly PredictionService _predictionService;
        private readonly IMapper _mapper;

        public PredictionController(PredictionService predictionService, IMapper mapper)
        {
            _mapper = mapper;
            _predictionService = predictionService;
        }

        [HttpPost]
        public async Task<IActionResult> AddPrediction(AIPredictionCreateDto prediction)
        {
            var p = _mapper.Map<AI_Prediction>(prediction);
            await _predictionService.AddPrediction(p);
            var responseDTO = _mapper.Map<AIPredictionResponseDto>(p);
            var response = new ApiResponse<AIPredictionResponseDto>(responseDTO);
            return Ok(response);
        }

        [HttpGet("{userid}")]
        public async Task<IActionResult> GetPreditionByUserId(int userid)
        {
            var prediction = await _predictionService.GetPrediction(userid);
            var responseDTO = _mapper.Map<AIPredictionResponseDto>(prediction);
            var response = new ApiResponse<AIPredictionResponseDto>(responseDTO);
            return Ok(response);
        }
    }
}
