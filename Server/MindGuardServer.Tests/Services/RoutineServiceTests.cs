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
    public class RoutineServiceTests : IDisposable
    {
        private readonly RoutineService _routineService;
        private readonly AppDbContext _context;

        public RoutineServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("TestDatabase_" + Guid.NewGuid())  
                .Options;

            _context = new AppDbContext(options);
            _routineService = new RoutineService(_context);

            _context.Database.EnsureCreated();
        }

        [Fact]
        public async Task AddRoutine_ShouldAddRoutineSuccessfully()
        {
            var routine = new Routine
            {
                UserId = 1,
                Description = "Morning Exercise",
                Frequency = "Daily",
                Reminder_Time = new TimeSpan(6, 0, 0),
                Synced_Calendar = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _routineService.AddRoutine(routine);

            Assert.NotNull(result);
            Assert.Equal("Morning Exercise", result.Description);
            Assert.Equal("Daily", result.Frequency);
        }

        [Fact]
        public async Task GetRoutinesByUserId_ShouldReturnRoutines()
        {
            var routine1 = new Routine
            {
                UserId = 1,
                Description = "Morning Exercise",
                Frequency = "Daily",
                Reminder_Time = new TimeSpan(6, 0, 0),
                Synced_Calendar = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var routine2 = new Routine
            {
                UserId = 1,
                Description = "Evening Walk",
                Frequency = "Daily",
                Reminder_Time = new TimeSpan(18, 0, 0),
                Synced_Calendar = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Routines.Add(routine1);
            _context.Routines.Add(routine2);
            await _context.SaveChangesAsync();

            _context.ChangeTracker.Clear();

            var result = await _routineService.GetRoutinesByUserId(1);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task MarkAsCompleteAsync_ShouldMarkRoutineAsCompleted()
        {
            var routine = new Routine
            {
                UserId = 1,
                Description = "Morning Exercise",
                Frequency = "Daily",
                Reminder_Time = DateTime.Now.AddHours(1).TimeOfDay,
                Synced_Calendar = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Routines.Add(routine);
            await _context.SaveChangesAsync();

            var occurrence = new Routine_Occurence
            {
                RoutineID = routine.Id, 
                Date = DateOnly.FromDateTime(DateTime.Now),
                IsCompleted = false,
                CompletedAt = DateTime.UtcNow
            };

            _context.Routine_Occurunces.Add(occurrence);
            await _context.SaveChangesAsync();

            var result = await _routineService.MarkAsCompleteAsync(routine.Id);

            Assert.True(result.Success);
            Assert.Equal("Marked as complete", result.Message);
            Assert.True(result.Occurrence.IsCompleted);
        }

        [Fact]
        public async Task MarkAsCompleteAsync_ShouldReturnAlreadyCompletedMessage_WhenCompletedToday()
        {
            var routine = new Routine
            {
                UserId = 1,
                Description = "Morning Exercise",
                Frequency = "Daily",
                Reminder_Time = DateTime.Now.AddHours(1).TimeOfDay,
                Synced_Calendar = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Routines.Add(routine);
            await _context.SaveChangesAsync();

            var occurrence = new Routine_Occurence
            {
                RoutineID = routine.Id,
                Date = DateOnly.FromDateTime(DateTime.Now),
                IsCompleted = true, 
                CompletedAt = DateTime.UtcNow
            };

            _context.Routine_Occurunces.Add(occurrence);
            await _context.SaveChangesAsync();

            _context.ChangeTracker.Clear();

            var result = await _routineService.MarkAsCompleteAsync(routine.Id);

            Assert.False(result.Success);
            Assert.Equal("Already completed today", result.Message);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}