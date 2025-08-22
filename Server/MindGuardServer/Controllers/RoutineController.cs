using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            return Ok(_mapper.Map<RoutineResponseDto>(r));
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
            return Ok(_mapper.Map<IEnumerable<RoutineResponseDto>>(routines));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoutineById(int id)
        {
            var routine = await _routineService.GetRoutineById(id);
            return Ok(_mapper.Map<RoutineResponseDto>(routine));
        }
    }
}
