using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.Domain
{
    public class Journal_Entry
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Content { get; set; }
        public string? Detected_Emotion { get; set; }
        public string? Sentiment_Score { get; set; }
        
        public int UserId { get; set; }          
        public virtual User User { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
