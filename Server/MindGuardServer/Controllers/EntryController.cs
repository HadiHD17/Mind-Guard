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
    public class EntryController : ControllerBase
    {
        private readonly EntryService _entryservice;
        private readonly IMapper _mapper;
        public EntryController(EntryService entryservice, IMapper mapper)
        {
            _entryservice = entryservice;
            _mapper = mapper;
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Create entry")]
        [SwaggerResponse(StatusCodes.Status200OK, "Entry created.", typeof(ApiResponse<JournalEntryResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid payload.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing/invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "User not found or creation failed.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> AddEntry([FromBody] JournalEntryCreateDto journal)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Error("Invalid payload."));

            var entity = _mapper.Map<Journal_Entry>(journal);
            await _entryservice.AddEntry(entity);

            if (entity == null)
                return NotFound(ApiResponse<object>.Error("User not found or creation failed."));

            var dto = _mapper.Map<JournalEntryResponseDto>(entity);
            return Ok(ApiResponse<JournalEntryResponseDto>.Success(dto));
        }

        [HttpGet("UserEntries/{userId}")]
        [SwaggerOperation(Summary = "List user entries")]
        [SwaggerResponse(StatusCodes.Status200OK, "Entries retrieved.", typeof(ApiResponse<IEnumerable<JournalEntryResponseDto>>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid user id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing/invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "No entries found for this user.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetEntryByUserId(int userId)
        {
            if (userId <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid userId."));

            var entries = await _entryservice.GetEntryByUserId(userId);
            if (entries == null || !entries.Any())
                return NotFound(ApiResponse<object>.Error("No entries found for this user."));

            var dto = _mapper.Map<IEnumerable<JournalEntryResponseDto>>(entries);
            return Ok(ApiResponse<IEnumerable<JournalEntryResponseDto>>.Success(dto));
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Get entry by id")]
        [SwaggerResponse(StatusCodes.Status200OK, "Entry retrieved.", typeof(ApiResponse<JournalEntryResponseDto>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Invalid entry id.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status401Unauthorized, "Missing/invalid JWT.", typeof(ApiResponse<object>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Entry not found.", typeof(ApiResponse<object>))]
        public async Task<IActionResult> GetEntryById(int id)
        {
            if (id <= 0)
                return BadRequest(ApiResponse<object>.Error("Invalid entry id."));

            var entry = await _entryservice.GetEntryById(id);
            if (entry == null)
                return NotFound(ApiResponse<object>.Error("Entry not found."));

            var dto = _mapper.Map<JournalEntryResponseDto>(entry);
            return Ok(ApiResponse<JournalEntryResponseDto>.Success(dto));
        }
    }
}
