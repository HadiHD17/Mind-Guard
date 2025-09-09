using System.Text;
using System.Text.Json; // ⬅️ add this
using System.Net.Http.Headers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MindGuardServer.Data;
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
        private readonly IHttpClientFactory _httpFactory;
        private readonly IOptions<N8nOptions> _n8nOptions;
        private readonly UserService _userService;

        public RoutineController(
            RoutineService routineService,
            IMapper mapper,
            IHttpClientFactory httpFactory,
            IOptions<N8nOptions> n8nOptions,
            UserService userService)
        {
            _routineService = routineService;
            _mapper = mapper;
            _httpFactory = httpFactory;
            _n8nOptions = n8nOptions;
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> AddRoutine([FromBody] RoutineCreateDto routine)
        {
            var r = _mapper.Map<Routine>(routine);
            await _routineService.AddRoutine(r);

            var user = await _userService.GetUserById(r.UserId);
            if (user?.Calendar_sync_enabled == true)
            {
                await NotifyN8nRoutineAsync(user, r);
            }

            var responseDTO = _mapper.Map<RoutineResponseDto>(r);
            return Ok(ApiResponse<RoutineResponseDto>.Success(responseDTO));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoutine(int id)
        {
            var existing = await _routineService.GetRoutineById(id);
            if (existing == null)
                return NotFound(ApiResponse<object>.Error("Routine not found"));

            var user = await _userService.GetUserById(existing.UserId);
            var shouldNotify = user?.Calendar_sync_enabled == true;

            var deleted = await _routineService.RemoveRoutine(id);
            if (!deleted)
                return BadRequest(ApiResponse<object>.Error("Delete failed"));

            if (shouldNotify)
            {
                try { await NotifyN8nDeleteAsync(existing.UserId, id); } catch { /* log if needed */ }
            }

            return Ok(ApiResponse<object>.Success(true));
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

        [HttpGet("UpcomingRoutine/{userId}")]
        public async Task<IActionResult> GetUpcomingRoutine(int userId)
        {
            var routine = await _routineService.GetUpcomingRoutine(userId);
            if (routine == null)
                return NotFound(ApiResponse<object>.Error());

            var responseDTO = _mapper.Map<RoutineResponseDto>(routine);
            return Ok(ApiResponse<RoutineResponseDto>.Success(responseDTO));
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
                return BadRequest(ApiResponse<object>.Error(result.Message));

            var occurrenceDTO = _mapper.Map<RoutineOccurrenceResponseDto>(result.Occurrence);
            var routine = await _routineService.GetRoutineById(routineId);
            var routineDTO = _mapper.Map<RoutineResponseDto>(routine);

            return Ok(ApiResponse<object>.Success(new
            {
                Routine = routineDTO,
                Occurrence = occurrenceDTO
            }));
        }

        // ---------- n8n notify helpers (fixed) ----------

        private async Task NotifyN8nRoutineAsync(User user, Routine r)
        {
            var payload = new
            {
                action = "upsert",
                user_id = user.Id,
                calendar_sync_enabled = user.Calendar_sync_enabled,
                routine = new
                {
                    id = r.Id,
                    userId = r.UserId,
                    description = r.Description,
                    frequency = r.Frequency,
                    reminder_time = r.Reminder_Time.ToString(@"hh\:mm\:ss"),
                    timezone = "Asia/Beirut"
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var sig = HmacHelper.HmacSha256Hex(json, _n8nOptions.Value.Secret);

            var client = _httpFactory.CreateClient("n8n");
            using var req = new HttpRequestMessage(HttpMethod.Post, _n8nOptions.Value.WebhookUrl)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
            req.Headers.Add("x-signature", sig);

            _ = client.SendAsync(req); // for debugging, await and log the response
        }

        private async Task NotifyN8nDeleteAsync(int userId, int routineId)
        {
            var payload = new { action = "delete", user_id = userId, routine_id = routineId };

            var json = JsonSerializer.Serialize(payload);
            var sig = HmacHelper.HmacSha256Hex(json, _n8nOptions.Value.Secret);

            var client = _httpFactory.CreateClient("n8n");
            using var req = new HttpRequestMessage(HttpMethod.Post, _n8nOptions.Value.WebhookUrl)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
            req.Headers.Add("x-signature", sig);

            _ = client.SendAsync(req); // for debugging, await and log the response
        }
    }
}
