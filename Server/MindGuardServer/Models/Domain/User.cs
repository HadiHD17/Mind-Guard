using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace MindGuardServer.Models.Domain
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Full name is required")]
        [StringLength(100, ErrorMessage = "Full name cannot be longer than 100 characters")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(150, ErrorMessage = "Email cannot be longer than 150 characters")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(150, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 150 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(50, ErrorMessage = "Phone number cannot be longer than 50 characters")]
        public string PhoneNumber { get; set; }

        [Required]
        public bool IsDark { get; set; } = false;

        [Required]
        public bool Calendar_sync_enabled { get; set; } = true;

        public virtual ICollection<Journal_Entry> Journal { get; set; } = new List<Journal_Entry>();
        public virtual ICollection<Mood_Checkin> Mood { get; set; } = new List<Mood_Checkin>();
        public virtual ICollection<Routine> Routine { get; set; } = new List<Routine>();
        public virtual ICollection<AI_Prediction> Prediction { get; set; } = new List<AI_Prediction>();
        public virtual ICollection<Weekly_Summary> Summary { get; set; } = new List<Weekly_Summary>();

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
