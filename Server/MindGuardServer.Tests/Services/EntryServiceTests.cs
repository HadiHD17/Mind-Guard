using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using MindGuardServer.Services;
using Moq;
using Xunit;

namespace MindGuardServer.Tests.Services
{
    public class EntryServiceTests : IDisposable
    {
        private readonly AppDbContext _context;

        public EntryServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("EntryTestDatabase_" + Guid.NewGuid())
                .Options;

            _context = new AppDbContext(options);
            _context.Database.EnsureCreated();
        }

        [Fact]
        public async Task GetEntryByUserId_ShouldReturnUserEntries()
        {
            // Arrange
            var entries = new List<Journal_Entry>
            {
                new Journal_Entry
                {
                    UserId = 1,
                    Content = "First entry",
                    DetectedEmotion = "Happy",
                    SentimentScore = 4.0,
                    CreatedAt = DateTime.UtcNow.AddHours(-2),
                    UpdatedAt = DateTime.UtcNow.AddHours(-2)
                },
                new Journal_Entry
                {
                    UserId = 1,
                    Content = "Second entry",
                    DetectedEmotion = "Sad",
                    SentimentScore = -3.0,
                    CreatedAt = DateTime.UtcNow.AddHours(-1),
                    UpdatedAt = DateTime.UtcNow.AddHours(-1)
                },
                new Journal_Entry
                {
                    UserId = 2,
                    Content = "Other user entry",
                    DetectedEmotion = "Neutral",
                    SentimentScore = 0.0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            _context.Journal_Entries.AddRange(entries);
            await _context.SaveChangesAsync();

            // Create service with null analyzer (we won't use it for these tests)
            var service = new EntryService(_context, null);

            // Act
            var result = await service.GetEntryByUserId(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.All(result, e => Assert.Equal(1, e.UserId));
            Assert.Contains(result, e => e.Content == "First entry");
            Assert.Contains(result, e => e.Content == "Second entry");
            Assert.DoesNotContain(result, e => e.Content == "Other user entry");
        }

        [Fact]
        public async Task GetEntryByUserId_ShouldReturnEmptyList_WhenNoEntriesExist()
        {
            // Create service with null analyzer (we won't use it for these tests)
            var service = new EntryService(_context, null);

            // Act
            var result = await service.GetEntryByUserId(999);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetEntryById_ShouldReturnEntry_WhenExists()
        {
            // Arrange
            var entry = new Journal_Entry
            {
                UserId = 1,
                Content = "Test entry",
                DetectedEmotion = "Happy",
                SentimentScore = 4.0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Journal_Entries.Add(entry);
            await _context.SaveChangesAsync();

            // Create service with null analyzer (we won't use it for these tests)
            var service = new EntryService(_context, null);

            // Act
            var result = await service.GetEntryById(entry.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test entry", result.Content);
            Assert.Equal("Happy", result.DetectedEmotion);
            Assert.Equal(4.0, result.SentimentScore);
        }

        [Fact]
        public async Task GetEntryById_ShouldReturnNull_WhenEntryDoesNotExist()
        {
            // Create service with null analyzer (we won't use it for these tests)
            var service = new EntryService(_context, null);

            // Act
            var result = await service.GetEntryById(999);

            // Assert
            Assert.Null(result);
        }


        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}