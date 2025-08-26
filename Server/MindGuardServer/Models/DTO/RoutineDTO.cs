using System.ComponentModel.DataAnnotations;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Models.DTO
{
    public class RoutineCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive number")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Description")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Frequency is required")]
        [StringLength(50, ErrorMessage = "Frequency cannot be longer than 50 characters")]
        public string Frequency { get; set; }

        public TimeSpan? Reminder_Time { get; set; }
        public bool Synced_Calendar { get; set; } = false;
    }

    public class RoutineUpdateDto
    {

        public string? Description { get; set; }

        [StringLength(50, ErrorMessage = "Frequency cannot be longer than 50 characters")]
        public string? Frequency { get; set; }

        public TimeSpan? Reminder_Time { get; set; }
        public bool? Synced_Calendar { get; set; }
    }

    public class RoutineResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Description { get; set; }
        public string Frequency { get; set; }
        public TimeSpan? Reminder_Time { get; set; }
        public bool Synced_Calendar { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
