using Microsoft.EntityFrameworkCore;
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
    }
}
