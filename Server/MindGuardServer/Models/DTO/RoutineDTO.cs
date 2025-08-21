using System.ComponentModel.DataAnnotations;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Models.DTO
{
    public class RoutineCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive number")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string Title { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "Frequency is required")]
        [StringLength(50, ErrorMessage = "Frequency cannot be longer than 50 characters")]
        public string Frequency { get; set; }

        public TimeSpan? ReminderTime { get; set; }
        public bool SyncedCalendar { get; set; } = false;
    }

    public class RoutineUpdateDto
    {
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string? Title { get; set; }

        public string? Description { get; set; }

        [StringLength(50, ErrorMessage = "Frequency cannot be longer than 50 characters")]
        public string? Frequency { get; set; }

        public TimeSpan? ReminderTime { get; set; }
        public bool? SyncedCalendar { get; set; }
    }

    public class RoutineResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string Frequency { get; set; }
        public TimeSpan? ReminderTime { get; set; }
        public bool SyncedCalendar { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
