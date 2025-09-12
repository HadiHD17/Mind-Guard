using Microsoft.EntityFrameworkCore;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Data
{
    public class AppDbContext: DbContext
    {
       public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Journal_Entry> Journal_Entries { get; set; }
        public DbSet<Mood_Checkin> Mood_Checkins { get; set; }
        public DbSet<Routine> Routines { get; set; }
        public DbSet<Routine_Occurence> Routine_Occurunces { get; set; }
        public DbSet<AI_Prediction> AI_Predictions { get; set; }
        public DbSet<Weekly_Summary> Weekly_Summaries { get; set; }
        public DbSet<Outcome> Outcomes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User() { 
                    Id = -1,
                    FullName="Hadi Haidar",
                    Email="hadi@gmail.com",
                    Password=PasswordHashHandler.HashPassword("hadi"),
                    PhoneNumber="81918422",
                    IsDark=true,
                    Calendar_sync_enabled=true,
                    CreatedAt=DateTime.UtcNow,
                    UpdatedAt=DateTime.UtcNow,
                
                });
        }
    }
}
