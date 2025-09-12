using Bogus;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace MindGuardServer.Data;

public class SeedJournalEntries
{
    // tune these
    private const int USERS_TO_SEED = 8;         // number of users to seed (only for users that already exist)
    private const int DAYS_BACK = 60;            // generate entries over last N days
    private const int ENTRIES_PER_DAY = 1;       // avg entries per user per day

    // Our mood universe (must match your ML MOODS order/labels)
    private static readonly string[] AllMoods = new[]
    {
        "anxiety","sadness","anger","fear","stress","shame","lonely",
        "calm","happy","excited","confused"
    };

    // Negatives—used in exporter proxy labeling
    private static readonly HashSet<string> NegativeMoods = new(new[]
    {
        "anxiety","sadness","anger","fear","stress","shame","lonely","confused"
    });

    public static async Task RunAsync(AppDbContext db, CancellationToken ct = default)
    {
        // Only seed if the table is still small (avoid duplicates)
        var existing = await db.Set<Journal_Entry>().CountAsync(ct);
        if (existing > 100) return; // already have data, skip

        // Get some existing users to attach entries to.
        // If you don't have users yet: create a few dummy users here instead.
        var users = await db.Users
            .OrderBy(u => u.Id)
            .Take(USERS_TO_SEED)
            .ToListAsync(ct);

        if (users.Count == 0)
            return; // no users to seed

        var rnd = new Random(42);

        // Build a Bogus faker for content text
        var textFaker = new Faker();

        var entries = new List<Journal_Entry>();
        var startDate = DateTime.UtcNow.Date.AddDays(-DAYS_BACK);

        foreach (var user in users)
        {
            // Create "streaks": some periods are ok/happy, some are stressed/anxious
            var day = startDate;
            while (day <= DateTime.UtcNow.Date)
            {
                // chance to create an entry this day
                if (rnd.NextDouble() < 0.85) // 85% chance there is a journal that day
                {
                    // choose mood regime by week chunks to form trends
                    double regime = Math.Sin(day.Subtract(startDate).TotalDays / 7.0 * Math.PI); // oscillate weekly
                    string mood;
                    double sentiment;

                    if (regime > 0.4)
                    {
                        // Positive regime
                        mood = Pick(rnd, new[] { "happy", "calm", "excited" });
                        sentiment = Clamp(Normal(rnd, mean: 0.35, std: 0.15), -1, 1);
                    }
                    else if (regime < -0.3)
                    {
                        // Negative regime
                        mood = Pick(rnd, new[] { "anxiety", "sadness", "stress", "confused" });
                        sentiment = Clamp(Normal(rnd, mean: -0.35, std: 0.2), -1, 1);
                    }
                    else
                    {
                        // Mixed/neutral regime
                        mood = Pick(rnd, AllMoods);
                        var baseMean = NegativeMoods.Contains(mood) ? -0.1 : 0.1;
                        sentiment = Clamp(Normal(rnd, mean: baseMean, std: 0.2), -1, 1);
                    }

                    // Time within the day
                    var createdAt = day.AddHours(rnd.Next(8, 23)).AddMinutes(rnd.Next(0, 60));

                    // Simple content based on mood (helps make data realistic)
                    var content = mood switch
                    {
                        "anxiety" => "Feeling tense and my thoughts are racing a bit.",
                        "sadness" => "Low energy today, kind of heavy mood.",
                        "anger" => "I snapped at a friend—wish I handled it better.",
                        "fear" => "Worried about the next few days, hard to relax.",
                        "stress" => "Too many tasks, mind is cluttered.",
                        "shame" => "I regret how I acted, embarrassed.",
                        "lonely" => "Haven't connected with anyone lately.",
                        "calm" => "Breathing slow, a peaceful day.",
                        "happy" => "Great conversation and good coffee today!",
                        "excited" => "Looking forward to the weekend plans!",
                        "confused" => "Can't focus; thoughts feel scattered.",
                        _ => textFaker.Lorem.Sentence()
                    };

                    entries.Add(new Journal_Entry
                    {
                        UserId = user.Id,
                        Content = content,
                        DetectedEmotion = mood,
                        SentimentScore = sentiment,
                        CreatedAt = createdAt,
                        UpdatedAt = createdAt
                    });

                    // occasionally add a second entry same day to create higher-frequency signals
                    if (rnd.NextDouble() < 0.15)
                    {
                        var mood2 = Pick(rnd, AllMoods);
                        var sentiment2 = Clamp(Normal(rnd,
                            mean: NegativeMoods.Contains(mood2) ? -0.05 : 0.2,
                            std: 0.25), -1, 1);

                        entries.Add(new Journal_Entry
                        {
                            UserId = user.Id,
                            Content = textFaker.Lorem.Sentence(),
                            DetectedEmotion = mood2,
                            SentimentScore = sentiment2,
                            CreatedAt = createdAt.AddHours(rnd.Next(1, 5)),
                            UpdatedAt = createdAt.AddHours(rnd.Next(1, 5))
                        });
                    }
                }

                day = day.AddDays(1);
            }
        }

        await db.Set<Journal_Entry>().AddRangeAsync(entries, ct);
        await db.SaveChangesAsync(ct);
    }

    private static string Pick(Random rnd, string[] arr) => arr[rnd.Next(arr.Length)];
    private static double Clamp(double x, double lo, double hi) => Math.Max(lo, Math.Min(hi, x));
    private static double Normal(Random rnd, double mean = 0.0, double std = 1.0)
    {
        // Box–Muller
        var u1 = 1.0 - rnd.NextDouble();
        var u2 = 1.0 - rnd.NextDouble();
        var z0 = Math.Sqrt(-2.0 * Math.Log(u1)) * Math.Cos(2.0 * Math.PI * u2);
        return mean + std * z0;
    }
}
