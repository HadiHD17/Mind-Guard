using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace MindGuardServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class RoutineController : ControllerBase
    {
        private readonly IRoutineService _routineService;
        private readonly IMapper _mapper;

        public RoutineController(IRoutineService routineService, IMapper mapper)
        {
            _routineService = routineService;
            _mapper = mapper;
        }

        [HttpPost]
        [Consumes("application/json")]
        [SwaggerOperation(Summary = "Add routine", Description = "Creates a new routine for a user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Routine created successfully.", typeof(ApiResponse<RoutineResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid payload.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "User not found or creation failed.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> AddRoutine([FromBody] RoutineCreateDto routine)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Error("Invalid payload."));

            var r = _mapper.Map<Routine>(routine);
            await _routineService.AddRoutine(r);
            if (r == null)
                return NotFound(ApiResponse<object>.Error("User not found or creation failed."));

            var dto = _mapper.Map<RoutineResponseDto>(r);
            return Ok(ApiResponse<RoutineResponseDto>.Success(dto));
        }

        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Delete routine", Description = "Deletes a routine by its id.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Routine deleted.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid id or delete failed.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Routine not found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> DeleteRoutine(int id)
        {
            if (id <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid id."));

            var existing = await _routineService.GetRoutineById(id);
            if (existing == null)
                return NotFound(ApiResponse<object>.Error("Routine not found."));

            var deleted = await _routineService.RemoveRoutine(id);
            if (!deleted)
                return BadRequest(ApiResponse<object>.Error("Delete failed."));

            return Ok(ApiResponse<object>.Success(deleted));
        }

        [HttpGet("UserRoutine/{userId}")]
        [SwaggerOperation(Summary = "List user routines", Description = "Returns all routines for the specified user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Routines retrieved.", typeof(ApiResponse<IEnumerable<RoutineResponseDto>>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "No routines found for this user.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetRoutinesByUserId(int userId)
        {
            if (userId <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));

            var routines = await _routineService.GetRoutinesByUserId(userId);
            if (routines == null || !routines.Any())
                return NotFound(ApiResponse<object>.Error("No routines found for this user."));

            var dto = _mapper.Map<IEnumerable<RoutineResponseDto>>(routines);
            return Ok(ApiResponse<IEnumerable<RoutineResponseDto>>.Success(dto));
        }

        [HttpGet("UpcomingRoutine/{userId}")]
        [SwaggerOperation(Summary = "Get upcoming routine", Description = "Returns the next due routine for the specified user.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Upcoming routine retrieved.", typeof(ApiResponse<RoutineResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "No upcoming routines found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetUpcomingRoutine(int userId)
        {
            if (userId <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid user id."));

            var routine = await _routineService.GetUpcomingRoutine(userId);
            if (routine == null)
                return NotFound(ApiResponse<object>.Error("No upcoming routines found."));

            var dto = _mapper.Map<RoutineResponseDto>(routine);
            return Ok(ApiResponse<RoutineResponseDto>.Success(dto));
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Get routine by id", Description = "Returns a routine by its identifier.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Routine retrieved.", typeof(ApiResponse<RoutineResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid routine id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Routine not found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetRoutineById(int id)
        {
            if (id <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid routine id."));

            var routine = await _routineService.GetRoutineById(id);
            if (routine == null)
                return NotFound(ApiResponse<object>.Error("Routine not found."));

            var dto = _mapper.Map<RoutineResponseDto>(routine);
            return Ok(ApiResponse<RoutineResponseDto>.Success(dto));
        }

        [HttpPost("{routineId}")]
        [SwaggerOperation(Summary = "Complete routine", Description = "Marks a routine occurrence as complete.")]
        [SwaggerResponse(StatusCodes.Status200OK, "Routine marked as complete.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid id or already completed.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing or invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Routine not found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> MarkRoutineAsComplete(int routineId)
        {
            if (routineId <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid routine id."));

            var existing = await _routineService.GetRoutineById(routineId);
            if (existing == null)
                return NotFound(ApiResponse<object>.Error("Routine not found."));

            var result = await _routineService.MarkAsCompleteAsync(routineId);

            if (!result.Success)
                return BadRequest(ApiResponse<object>.Error(result.Message ?? "Already completed or invalid state."));

            var occurrenceDTO = _mapper.Map<RoutineOccurrenceResponseDto>(result.Occurrence);
            var routine = await _routineService.GetRoutineById(routineId);
            var routineDTO = _mapper.Map<RoutineResponseDto>(routine);

            return Ok(ApiResponse<object>.Success(new
            {
                Routine = routineDTO,
                Occurrence = occurrenceDTO
            }));
        }
    }
}
