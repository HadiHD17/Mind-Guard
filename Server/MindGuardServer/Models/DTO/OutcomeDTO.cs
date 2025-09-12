namespace MindGuardServer.Models.DTO
{
    public class OutcomeCreateDto
    {
        public int UserId { get; set; }
        public int? EntryId { get; set; }      // optional
        public bool IsCrisis { get; set; }     // required on the client
        public string? Notes { get; set; }     // optional
        public DateTime? OccurredAt { get; set; } // optional; defaults to now
    }

    public class OutcomeResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? EntryId { get; set; }
        public bool IsCrisis { get; set; }
        public string? Notes { get; set; }
        public DateTime OccurredAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
