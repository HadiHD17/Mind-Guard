using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.Domain
{
    public class Weekly_Summary
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        [Required]
        public DateOnly Week_Start_Date { get; set; }
        [Required]
        public string Mood_Trend { get; set; }
        [Required]
        public int AVG_Sentiment { get; set; }
        [Required]
        public string Insights { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
