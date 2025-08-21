using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.DTO
{
    public class WeeklySummaryCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive number")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Week start date is required")]
        public DateTime WeekStartDate { get; set; }

        [StringLength(50, ErrorMessage = "Mood trend cannot be longer than 50 characters")]
        public string? MoodTrend { get; set; }

        [Range(0, 100, ErrorMessage = "Average sentiment must be between 0 and 100")]
        public decimal? AvgSentiment { get; set; }

        public string? Insights { get; set; }
    }

    public class WeeklySummaryResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime WeekStartDate { get; set; }
        public string? MoodTrend { get; set; }
        public decimal? AvgSentiment { get; set; }
        public string? Insights { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
