namespace MindGuardServer.Models.DTO
{
    public class DailyRecordDTO
    {
        public DateTime Date { get; set; }
        public int? MoodScore { get; set; }         // 1..5 (null if none that day)
        public double? SentimentScore { get; set; } // -1..1 (null if none that day)
        public bool WroteJournal { get; set; }      // true if any entry that day
        public int DayOfWeek { get; set; }          // 0..6 (Mon=0)

    }
}
