using Bogus;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace MindGuardServer.Data;

public static class BulkSeedJournalEntries
{
    // Defaults (can override via env vars, see below)
    private const int DEFAULT_SEED_TARGET = 4000; // ~4k total entries
    private const int DEFAULT_DAYS_BACK = 90;     // spread over last 90 days
    private const int DEFAULT_MAX_PER_DAY = 2;    // up to 2 entries per user per day

    private static readonly string[] AllMoods = new[]
    {
        "anxiety","sadness","anger","fear","stress","shame","lonely",
        "calm","happy","excited","confused"
    };

    private static readonly HashSet<string> NegativeMoods = new(new[]
    {
        "anxiety","sadness","anger","fear","stress","shame","lonely","confused"
    });

    public static async Task RunAsync(AppDbContext db, CancellationToken ct = default)
    {
        // Read environment overrides
        var seedTarget = ParseEnvInt("SEED_TARGET", DEFAULT_SEED_TARGET);
        var daysBack = ParseEnvInt("SEED_DAYS", DEFAULT_DAYS_BACK);
        var maxPerDay = ParseEnvInt("SEED_MAX_PER_DAY", DEFAULT_MAX_PER_DAY);

        // If we already have lots of entries, skip
        var existingCount = await db.Set<Journal_Entry>().CountAsync(ct);
        if (existingCount >= seedTarget * 0.9)
        {
            Console.WriteLine($"BulkSeed: Skipping (existing {existingCount} >= target {seedTarget})");
            return;
        }

        // Get users to attach entries to
        var users = await db.Users.AsNoTracking().OrderBy(u => u.Id).ToListAsync(ct);
        if (users.Count == 0)
        {
            Console.WriteLine("BulkSeed: No users found. Create at least 1 user, then re-run with ENABLE_SEED=true.");
            return;
        }

        var rnd = new Random(12345);
        var textFaker = new Faker();

        var startDate = DateTime.UtcNow.Date.AddDays(-daysBack);
        var perUserTarget = Math.Max(1, (int)Math.Ceiling((seedTarget - existingCount) / (double)users.Count));

        var toInsert = new List<Journal_Entry>(seedTarget);

        foreach (var user in users)
        {
            int createdForUser = 0;
            var day = startDate;

            // Slightly different phase per user so timelines vary
            double userPhase = rnd.NextDouble() * Math.PI;

            while (day <= DateTime.UtcNow.Date && createdForUser < perUserTarget)
            {
                // Decide how many entries today (0..maxPerDay)
                var entriesToday = rnd.Next(0, maxPerDay + 1);
                for (int k = 0; k < entriesToday && createdForUser < perUserTarget; k++)
                {
                    // Weekly oscillation to create positive/negative regimes
                    var daysSinceStart = (day - startDate).TotalDays;
                    double regime = Math.Sin((daysSinceStart / 7.0) * Math.PI + userPhase);

                    string mood;
                    double sentiment;

                    if (regime > 0.4)
                    {
                        // positive window
                        mood = Pick(rnd, new[] { "happy", "calm", "excited" });
                        sentiment = Clamp(Normal(rnd, mean: 0.35, std: 0.18), -1, 1);
                    }
                    else if (regime < -0.3)
                    {
                        // negative window
                        mood = Pick(rnd, new[] { "anxiety", "sadness", "stress", "confused" });
                        sentiment = Clamp(Normal(rnd, mean: -0.35, std: 0.22), -1, 1);
                    }
                    else
                    {
                        // mixed
                        mood = Pick(rnd, AllMoods);
                        var baseMean = NegativeMoods.Contains(mood) ? -0.1 : 0.1;
                        sentiment = Clamp(Normal(rnd, mean: baseMean, std: 0.25), -1, 1);
                    }

                    var createdAt = day.AddHours(rnd.Next(7, 23)).AddMinutes(rnd.Next(0, 60));

                    var content = mood switch
                    {
                        "anxiety" => "Anxious and restless today.",
                        "sadness" => "Feeling a bit down; low motivation.",
                        "anger" => "Frustrated—trying to cool off.",
                        "fear" => "Nervous about upcoming tasks.",
                        "stress" => "Overwhelmed by my to-do list.",
                        "shame" => "Embarrassed about a mistake.",
                        "lonely" => "Wish I connected more today.",
                        "calm" => "Peaceful; slow and steady.",
                        "happy" => "Good moments with friends.",
                        "excited" => "Energized about plans.",
                        "confused" => "Scattered thoughts; hard to focus.",
                        _ => textFaker.Lorem.Sentence()
                    };

                    toInsert.Add(new Journal_Entry
                    {
                        UserId = user.Id,
                        Content = content,
                        DetectedEmotion = mood,
                        SentimentScore = sentiment,
                        CreatedAt = createdAt,
                        UpdatedAt = createdAt
                    });

                    createdForUser++;
                }

                day = day.AddDays(1);
            }
        }

        // Bulk insert in chunks to avoid huge transactions
        const int CHUNK = 1000;
        for (int i = 0; i < toInsert.Count; i += CHUNK)
        {
            var slice = toInsert.Skip(i).Take(CHUNK).ToList();
            await db.Set<Journal_Entry>().AddRangeAsync(slice, ct);
            await db.SaveChangesAsync(ct);
            Console.WriteLine($"BulkSeed: inserted {Math.Min(i + CHUNK, toInsert.Count)}/{toInsert.Count}");
        }

        Console.WriteLine($"BulkSeed: done. Inserted ~{toInsert.Count} new entries.");
    }

    // ---- helpers ----
    private static int ParseEnvInt(string key, int defVal)
        => int.TryParse(Environment.GetEnvironmentVariable(key), out var v) ? v : defVal;

    private static string Pick(Random rnd, string[] arr) => arr[rnd.Next(arr.Length)];

    private static double Clamp(double x, double lo, double hi) => Math.Max(lo, Math.Min(hi, x));

    // Box–Muller
    private static double Normal(Random rnd, double mean = 0.0, double std = 1.0)
    {
        var u1 = 1.0 - rnd.NextDouble();
        var u2 = 1.0 - rnd.NextDouble();
        var z0 = Math.Sqrt(-2.0 * Math.Log(u1)) * Math.Cos(2.0 * Math.PI * u2);
        return mean + std * z0;
    }
}
