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
    public class RoutineController : ControllerBase
    {
        private readonly RoutineService _routineService;
        private readonly IMapper _mapper;

        public RoutineController(RoutineService routineService,IMapper mapper)
        {
            _routineService = routineService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> AddRoutine([FromBody] RoutineCreateDto routine)
        {
            var r = _mapper.Map<Routine>(routine);
            await _routineService.AddRoutine(r);
            if (r == null)
                return NotFound(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<RoutineResponseDto>(r);
            return Ok(ApiResponse<RoutineResponseDto>.Success(responseDTO));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoutine(int id)
        {
            var deleted = await _routineService.RemoveRoutine(id);
            if (deleted == false)
                return BadRequest(ApiResponse<object>.Error());
            return Ok(ApiResponse<object>.Success(deleted));
        }

        [HttpGet("UserRoutine/{userId}")]
        public async Task<IActionResult> GetRoutinesByUserId(int userId)
        {
            var routines = await _routineService.GetRoutinesByUserId(userId);
            if (routines == null)
                return NotFound(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<IEnumerable<RoutineResponseDto>>(routines);
            return Ok(ApiResponse<IEnumerable<RoutineResponseDto>>.Success(responseDTO));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoutineById(int id)
        {
            var routine = await _routineService.GetRoutineById(id);
            if (routine == null)
                return NotFound(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<RoutineResponseDto>(routine);
            return Ok(ApiResponse<RoutineResponseDto>.Success(responseDTO));
        }

        [HttpPost("{routineId}")]
        public async Task<IActionResult> MarkRoutineAsComplete(int routineId)
        {
            var result = await _routineService.MarkAsCompleteAsync(routineId);

            if (!result.Success)
                return BadRequest(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<RoutineOccurrenceResponseDto>(result.Occurrence);
            return Ok(ApiResponse<RoutineOccurrenceResponseDto>.Success(responseDTO));
        }
    }
}
