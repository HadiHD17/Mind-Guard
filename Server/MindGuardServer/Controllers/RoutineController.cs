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
            var responseDTO = _mapper.Map<RoutineResponseDto>(r);
            var response = new ApiResponse<RoutineResponseDto>(responseDTO);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoutine(int id)
        {
            var deleted = await _routineService.RemoveRoutine(id);
            if(deleted == false)
            {
                return BadRequest("routine not deleted");
            }
            return Ok("routine deleted");
        }

        [HttpGet("UserRoutine/{userId}")]
        public async Task<IActionResult> GetRoutinesByUserId(int userId)
        {
            var routines = await _routineService.GetRoutinesByUserId(userId);
            var responseDTO = _mapper.Map<IEnumerable<RoutineResponseDto>>(routines);
            var response = new ApiResponse<IEnumerable<RoutineResponseDto>>(responseDTO);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoutineById(int id)
        {
            var routine = await _routineService.GetRoutineById(id);
            var responseDTO = _mapper.Map<RoutineResponseDto>(routine);
            var response = new ApiResponse<RoutineResponseDto>(responseDTO);
            return Ok(response);
        }

        [HttpPost("{routineId}")]
        public async Task<IActionResult> MarkRoutineAsComplete(int routineId)
        {
            var result = await _routineService.MarkAsCompleteAsync(routineId);

            if (!result.Success)
            {
                return BadRequest(new { status = "error", message = result.Message });
            }

            var responseDTO = _mapper.Map<RoutineOccurrenceResponseDto>(result.Occurrence);
            var response = new ApiResponse<RoutineOccurrenceResponseDto>(responseDTO);
            return Ok(response);
        }
    }
}
