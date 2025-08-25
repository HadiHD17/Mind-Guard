using System.ComponentModel.DataAnnotations;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Models.DTO
{
    public class AIPredictionCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be a positive number")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Predicted date is required")]
        public DateTime Predicted_Date { get; set; }

        [StringLength(50, ErrorMessage = "Risk level cannot be longer than 50 characters")]
        public string? Risk_Level { get; set; }
       

        public string? Tips { get; set; }
        public bool Is_Acknowledged { get; set; } = false;
    }

    public class AIPredictionUpdateDto
    {
        [StringLength(50, ErrorMessage = "Risk level cannot be longer than 50 characters")]
        public string? Risk_Level { get; set; }

        public string? Tips { get; set; }
        public bool? Is_Acknowledged { get; set; }
    }

    public class AIPredictionResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime Predicted_Date { get; set; }
        public string? Risk_Level { get; set; }
        public string? Tips { get; set; }
        public bool Is_Acknowledged { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
