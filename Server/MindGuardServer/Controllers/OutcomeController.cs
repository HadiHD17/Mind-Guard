using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
    public class OutcomeController : ControllerBase
    {
        private readonly OutcomeService _service;
        private readonly IMapper _mapper;

        public OutcomeController(OutcomeService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> AddOutcome([FromBody] OutcomeCreateDto dto)
        {
            try
            {
                var entity = _mapper.Map<Outcome>(dto);
                entity.UserId = dto.UserId;
                entity.OccurredAt = dto.OccurredAt ?? DateTime.UtcNow;
                entity.CreatedAt = DateTime.UtcNow;
                entity.UpdatedAt = DateTime.UtcNow;

                await _service.AddOutcome(entity);
                var resp = _mapper.Map<OutcomeResponseDto>(entity);
                return Ok(ApiResponse<OutcomeResponseDto>.Success(resp));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.Error(ex.Message));
            }
        }

        // Optional: list recent outcomes for the authenticated user
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var list = await _service.GetByUser(userId);
            var resp = list.Select(_mapper.Map<OutcomeResponseDto>).ToList();
            return Ok(ApiResponse<List<OutcomeResponseDto>>.Success(resp));
        }
    }
}
