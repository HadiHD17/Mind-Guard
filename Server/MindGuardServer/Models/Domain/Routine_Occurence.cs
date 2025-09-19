using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.Domain
{
    public class Routine_Occurence
    {
        [Key]
        public int Id { get; set; }
        public int RoutineID {  get; set; }
        [Required]
        public DateOnly Date { get; set; }
        [Required]
        public bool IsCompleted { get; set; } = false;
        [Required]
        public DateTime CompletedAt { get; set; }
    }
}
