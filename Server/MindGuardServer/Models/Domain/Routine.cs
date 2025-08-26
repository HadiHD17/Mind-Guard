using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.Domain
{
    public class Routine
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Frequency { get; set; }
        [Required]
        public TimeSpan Reminder_Time { get; set; }
        [Required]
        public bool Synced_Calendar { get; set; }
        public virtual ICollection<Routine_Occurence> Occurence { get; set; }=new List<Routine_Occurence>();
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}
