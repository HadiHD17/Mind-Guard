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
    public class EntryController : ControllerBase
    {
        private readonly EntryService _entryservice;
        private readonly IMapper _mapper;
        public EntryController(EntryService entryservice,IMapper mapper)
        {
            _entryservice = entryservice;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<IActionResult> AddEntry([FromBody]JournalEntryCreateDto journal)
        {
            var J = _mapper.Map<Journal_Entry>(journal);
            await _entryservice.AddEntry(J);
            return Ok(_mapper.Map<JournalEntryResponseDto>(J));
        }

        [HttpGet("UserEntries/{userId}")]
        public async Task<IActionResult> GetEntryByUserId(int userId)
        {
            var entries = await _entryservice.GetEntryByUserId(userId);
            return Ok(_mapper.Map<IEnumerable<JournalEntryResponseDto>>(entries));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEntryById(int id)
        {
            var entry = await _entryservice.GetEntryById(id);
            return Ok(_mapper.Map<JournalEntryResponseDto>(entry));
        }

    }
}
