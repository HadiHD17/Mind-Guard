using System;
using System.Threading;
using System.Threading.Tasks;
using Cronos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MindGuardServer.Data;

namespace MindGuardServer.Services
{
    /// <summary>
    /// Runs a weekly job to generate summaries for all users.
    /// Uses Cronos to schedule (default: every Monday 00:05 UTC).
    /// </summary>
    public class WeeklySummaryScheduler : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly ILogger<WeeklySummaryScheduler> _logger;


        private readonly CronExpression _cron;

        public WeeklySummaryScheduler(IServiceProvider services, ILogger<WeeklySummaryScheduler> logger, IConfiguration config)
        {
            _services = services;
            _logger = logger;

            var cron = config["WeeklySummary:Cron"];

            // Decide which CronFormat to use based on field count
            var parts = (cron ?? "").Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var format = parts.Length == 6 ? CronFormat.IncludeSeconds : CronFormat.Standard;

            // Default to Monday 00:05 UTC if not provided
            var expr = string.IsNullOrWhiteSpace(cron) ? "0 5 0 * * 1" : cron;

            _cron = CronExpression.Parse(expr, format);

            _logger.LogInformation("[WeeklySummaryScheduler] Using CRON '{Cron}' with format {Format}", expr, format);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("[WeeklySummaryScheduler] started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var nextUtc = _cron.GetNextOccurrence(DateTime.UtcNow, TimeZoneInfo.Utc);
                    if (nextUtc == null)
                    {
                        _logger.LogWarning("[WeeklySummaryScheduler] No next run computed. Sleeping 1 hour.");
                        await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
                        continue;
                    }

                    var delay = nextUtc.Value - DateTime.UtcNow;
                    if (delay < TimeSpan.Zero) delay = TimeSpan.Zero;

                    _logger.LogInformation("[WeeklySummaryScheduler] next run at {NextUtc:o} (in {Delay}).", nextUtc, delay);
                    await Task.Delay(delay, stoppingToken);

                    await RunJobAsync(stoppingToken);
                }
                catch (TaskCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[WeeklySummaryScheduler] loop error. Will retry in 1 minute.");
                    try { await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); } catch { /* ignore */ }
                }
            }

            _logger.LogInformation("[WeeklySummaryScheduler] stopped.");
        }

        private async Task RunJobAsync(CancellationToken ct)
        {
            _logger.LogInformation("[WeeklySummaryScheduler] generating weekly summaries…");

            using var scope = _services.CreateScope();

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var summaryService = scope.ServiceProvider.GetRequiredService<SummaryService>();

            var userIds = await db.Users
                .AsNoTracking()
                .Select(u => u.Id)
                .ToListAsync(ct);

            _logger.LogInformation("[WeeklySummaryScheduler] Found {Count} users.", userIds.Count);

            int success = 0, skipped = 0, failed = 0;

            foreach (var userId in userIds)
            {
                try
                {

                    var nowUtc = DateTime.UtcNow;
                    var weekStartUtc = StartOfWeek(nowUtc, DayOfWeek.Monday);
                    var weekStartDateOnly = DateOnly.FromDateTime(weekStartUtc);

                    var alreadyExists = await db.Weekly_Summaries
                        .AsNoTracking()
                        .AnyAsync(s => s.UserId == userId && s.Week_Start_Date == weekStartDateOnly, ct);

                    if (alreadyExists)
                    {
                        skipped++;
                        continue;
                    }

                    var result = await summaryService.GenerateWeeklySummary(userId);
                    if (result == null)
                    {
                        skipped++;
                    }
                    else
                    {
                        success++;
                    }
                }
                catch (Exception ex)
                {
                    failed++;
                    _logger.LogError(ex, "[WeeklySummaryScheduler] Failed for user {UserId}.", userId);
                }
            }

            _logger.LogInformation("[WeeklySummaryScheduler] Done. success={Success}, skipped={Skipped}, failed={Failed}",
                success, skipped, failed);
        }

        private static DateTime StartOfWeek(DateTime dtUtc, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dtUtc.DayOfWeek - startOfWeek)) % 7;
            var date = dtUtc.Date.AddDays(-diff);
            return date;
        }
    }
}
