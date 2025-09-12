using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.Domain
{
    public class Outcome
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public virtual User? User { get; set; }

        public int? EntryId { get; set; }
         public virtual Journal_Entry Entry { get; set; } 


        [Required]
        public bool IsCrisis { get; set; }

        public string? Notes { get; set; }


        [Required]
        public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
