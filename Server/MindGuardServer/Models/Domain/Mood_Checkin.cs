using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.Domain
{
    public class Mood_Checkin
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        [Required]
        public string Mood_Label { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
