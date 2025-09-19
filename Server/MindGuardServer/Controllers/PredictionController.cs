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
        [Consumes("application/json")]
        [SwaggerOperation(Summary = "Add prediction", Description = "Creates a new AI risk prediction for the specified user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Prediction created successfully.", typeof(ApiResponse<AIPredictionResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid payload.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Failed to create prediction (user not found or invalid state).", typeof(ApiResponse<object>))]
        public async Task<IActionResult> AddPrediction([FromBody] AIPredictionCreateDto prediction)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Error("Invalid payload."));

            var entity = _mapper.Map<AI_Prediction>(prediction);
            await _predictionService.AddPrediction(entity);

            if (entity == null)
                return NotFound(ApiResponse<object>.Error("Failed to create prediction."));

            var dto = _mapper.Map<AIPredictionResponseDto>(entity);
            return Ok(ApiResponse<AIPredictionResponseDto>.Success(dto));
        }

        [HttpGet("{userid}")]
        [SwaggerOperation(Summary = "Get latest prediction", Description = "Returns the most recent AI prediction for the given user id.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Prediction retrieved.", typeof(ApiResponse<AIPredictionResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "No prediction found for this user.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetPreditionByUserId(int userid)
        {
            if (userid <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));

            var prediction = await _predictionService.GetPrediction(userid);
            if (prediction == null)
                return NotFound(ApiResponse<object>.Error("No prediction found for this user."));

            var dto = _mapper.Map<AIPredictionResponseDto>(prediction);
            return Ok(ApiResponse<AIPredictionResponseDto>.Success(dto));
        }
    }
}
