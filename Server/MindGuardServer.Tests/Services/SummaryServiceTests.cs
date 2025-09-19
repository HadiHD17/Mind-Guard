using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;
using Moq;
using Xunit;
using static MindGuardServer.Services.MoodService;

namespace MindGuardServer.Tests
{
    public class SummaryServiceTests
    {
        private readonly AppDbContext _dbContext;
        private readonly Mock<MoodService> _mockMoodService;
        private readonly SummaryService _summaryService;

        public SummaryServiceTests()
        {
            // Setup InMemory DbContext
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _dbContext = new AppDbContext(options);

            // Mock the MoodService
            _mockMoodService = new Mock<MoodService>(_dbContext);

            // Initialize the service under test
            _summaryService = new SummaryService(_dbContext, _mockMoodService.Object);

            _dbContext.Database.EnsureDeleted();
            _dbContext.Database.EnsureCreated();

            // Seed initial data into the in-memory database
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            // Seed user and mood check-in data
            var user = new User
            {
                Id = 1,
                Email = "testuser@example.com",
                FullName = "Test User",
                Password = "hashedpassword", // Assume a hashed password
                PhoneNumber = "1234567890",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            // Seed mood check-ins for the user
            var moodCheckins = new List<Mood_Checkin>
            {
                new Mood_Checkin { UserId = 1, Mood_Label = "Happy", CreatedAt = DateTime.UtcNow.AddDays(-1) },
                new Mood_Checkin { UserId = 1, Mood_Label = "Happy", CreatedAt = DateTime.UtcNow.AddDays(-3) },
                new Mood_Checkin { UserId = 1, Mood_Label = "Sad", CreatedAt = DateTime.UtcNow.AddDays(-5) }
            };

            _dbContext.Mood_Checkins.AddRange(moodCheckins);
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task GenerateWeeklySummary_ShouldReturnSummary_WhenValidUserId()
        {
            // Mock the behavior of MoodService (mock the moods for a user)
            _mockMoodService.Setup(m => m.GetAllMoods(It.IsAny<int>()))
                .ReturnsAsync(new List<MoodDto>
                {
                    new MoodDto { Mood_Label = "Happy", Date = DateTime.UtcNow.AddDays(-1) },
                    new MoodDto { Mood_Label = "Happy", Date = DateTime.UtcNow.AddDays(-3) },
                    new MoodDto { Mood_Label = "Sad", Date = DateTime.UtcNow.AddDays(-5) }
                });

            // Call the method under test
            var result = await _summaryService.GenerateWeeklySummary(1);

            // Assert that the result is not null and contains expected values
            Assert.NotNull(result);
            Assert.Equal("Happy", result.Mood_Trend);  // Most frequent mood
            Assert.Equal(3, result.AVG_Sentiment);     // Sentiment based on the number of moods
        }

        [Fact]
        public async Task GenerateWeeklySummary_ShouldReturnNull_WhenNoMoodsInLastWeek()
        {
            // Mock no moods in the last week
            _mockMoodService.Setup(m => m.GetAllMoods(It.IsAny<int>()))
                .ReturnsAsync(new List<MoodDto>());

            // Call the method under test
            var result = await _summaryService.GenerateWeeklySummary(1);

            // Assert that the result is null when no moods were recorded in the past week
            Assert.Null(result);
        }
    }
}
