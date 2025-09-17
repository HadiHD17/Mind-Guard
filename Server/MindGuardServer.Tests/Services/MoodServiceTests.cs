using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using MindGuardServer.Services;
using Xunit;

namespace MindGuardServer.Tests.Services
{
    public class MoodServiceTests : IDisposable
    {
        private readonly MoodService _moodService;
        private readonly AppDbContext _context;

        public MoodServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("MoodTestDatabase_" + Guid.NewGuid())
                .Options;

            _context = new AppDbContext(options);
            _moodService = new MoodService(_context);

            _context.Database.EnsureCreated();
        }

        [Fact]
        public async Task AddMood_ShouldAddMoodSuccessfully()
        {
            // Arrange
            var mood = new Mood_Checkin
            {
                UserId = 1,
                Mood_Label = "Happy",
                CreatedAt = DateTime.UtcNow
            };

            // Act
            var result = await _moodService.AddMood(mood);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Happy", result.Mood_Label);
            Assert.Equal(1, result.UserId);
        }

        [Fact]
        public async Task GetMoodByUserId_ShouldReturnLatestMood()
        {
            // Arrange
            var moods = new List<Mood_Checkin>
            {
                new Mood_Checkin { UserId = 1, Mood_Label = "Sad", CreatedAt = DateTime.UtcNow.AddHours(-2) },
                new Mood_Checkin { UserId = 1, Mood_Label = "Happy", CreatedAt = DateTime.UtcNow.AddHours(-1) },
                new Mood_Checkin { UserId = 2, Mood_Label = "Anxious", CreatedAt = DateTime.UtcNow }
            };

            _context.Mood_Checkins.AddRange(moods);
            await _context.SaveChangesAsync();

            // Act
            var result = await _moodService.GetMoodByUserId(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Happy", result.Mood_Label);
            Assert.Equal(1, result.UserId);
        }

        [Fact]
        public async Task GetMoodByUserId_ShouldReturnNull_WhenNoMoodsExist()
        {
            // Act
            var result = await _moodService.GetMoodByUserId(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAllMoods_ShouldReturnCombinedMoodsFromCheckinsAndJournals()
        {
            // Arrange
            var checkins = new List<Mood_Checkin>
            {
                new Mood_Checkin { UserId = 1, Mood_Label = "Happy", CreatedAt = DateTime.UtcNow.AddHours(-2) },
                new Mood_Checkin { UserId = 1, Mood_Label = "Sad", CreatedAt = DateTime.UtcNow.AddHours(-1) }
            };

            var journalEntries = new List<Journal_Entry>
            {
                new Journal_Entry {
                    UserId = 1,
                    Content = "Test journal content", // Added required field
                    DetectedEmotion = "Anxious",
                    CreatedAt = DateTime.UtcNow
                },
                new Journal_Entry {
                    UserId = 2,
                    Content = "Another journal content", // Added required field
                    DetectedEmotion = "Excited",
                    CreatedAt = DateTime.UtcNow
                } // Different user
            };

            _context.Mood_Checkins.AddRange(checkins);
            _context.Journal_Entries.AddRange(journalEntries);
            await _context.SaveChangesAsync();

            // Act
            var result = await _moodService.GetAllMoods(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count); // 2 checkins + 1 journal entry for user 1
            Assert.Contains(result, m => m.Mood_Label == "Happy" && m.Source == "Checkin");
            Assert.Contains(result, m => m.Mood_Label == "Sad" && m.Source == "Checkin");
            Assert.Contains(result, m => m.Mood_Label == "Anxious" && m.Source == "Journal");
            Assert.DoesNotContain(result, m => m.Mood_Label == "Excited"); // Should not include user 2's journal
        }

        [Fact]
        public async Task GetAllMoods_ShouldReturnEmptyList_WhenNoMoodsExist()
        {
            // Act
            var result = await _moodService.GetAllMoods(999);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAllMoods_ShouldReturnOnlyCheckins_WhenNoJournalsExist()
        {
            // Arrange
            var checkins = new List<Mood_Checkin>
            {
                new Mood_Checkin { UserId = 1, Mood_Label = "Happy", CreatedAt = DateTime.UtcNow }
            };

            _context.Mood_Checkins.AddRange(checkins);
            await _context.SaveChangesAsync();

            // Act
            var result = await _moodService.GetAllMoods(1);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.All(result, m => Assert.Equal("Checkin", m.Source));
        }

        [Fact]
        public async Task GetAllMoods_ShouldReturnOnlyJournals_WhenNoCheckinsExist()
        {
            // Arrange
            var journalEntries = new List<Journal_Entry>
            {
                new Journal_Entry {
                    UserId = 1,
                    Content = "Test journal content", // Added required field
                    DetectedEmotion = "Anxious",
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.Journal_Entries.AddRange(journalEntries);
            await _context.SaveChangesAsync();

            // Act
            var result = await _moodService.GetAllMoods(1);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.All(result, m => Assert.Equal("Journal", m.Source));
        }

        [Fact]
        public async Task GetAllMoods_ShouldOrderByDateDescending()
        {
            // Arrange
            var checkins = new List<Mood_Checkin>
            {
                new Mood_Checkin { UserId = 1, Mood_Label = "Old", CreatedAt = DateTime.UtcNow.AddHours(-2) },
                new Mood_Checkin { UserId = 1, Mood_Label = "New", CreatedAt = DateTime.UtcNow }
            };

            _context.Mood_Checkins.AddRange(checkins);
            await _context.SaveChangesAsync();

            // Act
            var result = await _moodService.GetAllMoods(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("New", result[0].Mood_Label); // Most recent first
            Assert.Equal("Old", result[1].Mood_Label); // Oldest last
        }

        [Fact]
        public async Task GetAllMoods_ShouldHandleJournalEntriesWithoutDetectedEmotion()
        {
            // Arrange
            var journalEntries = new List<Journal_Entry>
            {
                new Journal_Entry {
                    UserId = 1,
                    Content = "Test journal content",
                    DetectedEmotion = null, // No detected emotion
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.Journal_Entries.AddRange(journalEntries);
            await _context.SaveChangesAsync();

            // Act
            var result = await _moodService.GetAllMoods(1);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should not include journal entries without detected emotion
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}