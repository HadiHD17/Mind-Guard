using System.ComponentModel.DataAnnotations;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Models.DTO
{

    public class JournalEntryCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive number")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Content is required")]
        [MinLength(1, ErrorMessage = "Content cannot be empty")]
        public string Content { get; set; }
    }

    public class JournalEntryUpdateDto
    {
        [MinLength(1, ErrorMessage = "Content cannot be empty")]
        public string? Content { get; set; }
    }

    public class JournalEntryResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
        public string? DetectedEmotion { get; set; }
        public double SentimentScore { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
