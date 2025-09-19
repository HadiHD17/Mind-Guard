using System.ComponentModel.DataAnnotations;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Models.DTO
{
    public class MoodCheckinCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive number")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Mood label is required")]
        [StringLength(50, ErrorMessage = "Mood label cannot be longer than 50 characters")]
        public string Mood_Label { get; set; }

    }

    public class MoodCheckinResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Mood_Label { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
