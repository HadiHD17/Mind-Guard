using System.ComponentModel.DataAnnotations;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Models.DTO
{
    public class RoutineOccurrenceCreateDto
    {
        [Required(ErrorMessage = "Routine ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Routine ID must be a positive number")]
        public int RoutineId { get; set; }

        [Required(ErrorMessage = "Date is required")]
        public DateOnly Date { get; set; }

        public bool IsCompleted { get; set; } = false;
        public DateTime? CompletedAt { get; set; }
    }

    public class RoutineOccurrenceUpdateDto
    {
        public bool? IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class RoutineOccurrenceResponseDto
    {
        public int Id { get; set; }
        public int RoutineId { get; set; }
        public DateOnly Date { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }


}
