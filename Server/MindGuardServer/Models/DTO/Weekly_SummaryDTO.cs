using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.DTO
{
    public class WeeklySummaryCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive number")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Week start date is required")]
        public DateOnly Week_Start_Date { get; set; }

        [StringLength(50, ErrorMessage = "Mood trend cannot be longer than 50 characters")]
        public string? Mood_Trend { get; set; }

        [Range(0, 100, ErrorMessage = "Average sentiment must be between 0 and 100")]
        public int Avg_Sentiment { get; set; }

        public string? Insights { get; set; }
    }

    public class WeeklySummaryResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateOnly Week_Start_Date { get; set; }
        public string? Mood_Trend { get; set; }
        public int Avg_Sentiment { get; set; }
        public string? Insights { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
