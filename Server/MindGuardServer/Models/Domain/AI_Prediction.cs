using System.ComponentModel.DataAnnotations;
namespace MindGuardServer.Models.Domain
{
    public class AI_Prediction
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        [Required]
        public DateTime Predicted_Date { get; set; }
        [Required]
        public string Risk_Level { get; set; }
        [Required]
        public string Tips { get; set; }
        [Required]
        public bool Is_Acknowledged { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
