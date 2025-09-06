using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;
using Moq;
using Xunit;

namespace MindGuardServer.Tests
{
    public class UserServiceTests
    {
        private readonly UserService _userService;
        private readonly AppDbContext _dbContext;

        public UserServiceTests()
        {
            // Setup an in-memory database for testing
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;

            _dbContext = new AppDbContext(options);
            _userService = new UserService(_dbContext);

            // Ensure the database is created
            _dbContext.Database.EnsureDeleted();
            _dbContext.Database.EnsureCreated();

            // Seed some data for the tests
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            var user = new User
            {
                Id = 1,
                FullName = "Test User",
                Email = "test@test.com",
                Password = PasswordHashHandler.HashPassword("Password123!"),
                PhoneNumber = "1234567890",
                IsDark = true,
                Calendar_sync_enabled = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task GetUserById_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var userId = 1;

            // Act
            var result = await _userService.GetUserById(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.Id);
            Assert.Equal("Test User", result.FullName);
        }

        [Fact]
        public async Task GetUserById_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = 2;

            // Act
            var result = await _userService.GetUserById(userId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateUser_ShouldReturnUpdatedUser_WhenUserExists()
        {
            // Arrange
            var userId = 1;
            var updatedUser = new User
            {
                FullName = "Updated User",
                Email = "updated@test.com",
                PhoneNumber = "0987654321",
                IsDark = false,
                Calendar_sync_enabled = false
            };

            // Act
            var result = await _userService.UpdateUser(userId, updatedUser);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated User", result.FullName);
            Assert.Equal("updated@test.com", result.Email);
            Assert.Equal("0987654321", result.PhoneNumber);
        }

        [Fact]
        public async Task UpdateUser_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = 2;
            var updatedUser = new User
            {
                FullName = "Updated User",
                Email = "updated@test.com",
                PhoneNumber = "0987654321",
                IsDark = false,
                Calendar_sync_enabled = false
            };

            // Act
            var result = await _userService.UpdateUser(userId, updatedUser);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdatePassword_ShouldReturnTrue_WhenPasswordIsUpdated()
        {
            // Arrange
            var userId = 1;
            var dto = new UpdatePasswordDto
            {
                CurrentPassword = "Password123!",
                NewPassword = "NewPassword123!"
            };

            // Act
            var result = await _userService.UpdatePassword(userId, dto);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdatePassword_ShouldThrowException_WhenCurrentPasswordIsIncorrect()
        {
            // Arrange
            var userId = 1;
            var dto = new UpdatePasswordDto
            {
                CurrentPassword = "WrongPassword123!",
                NewPassword = "NewPassword123!"
            };

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _userService.UpdatePassword(userId, dto));
        }

        [Fact]
        public async Task UpdatePassword_ShouldReturnFalse_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = 2;
            var dto = new UpdatePasswordDto
            {
                CurrentPassword = "Password123!",
                NewPassword = "NewPassword123!"
            };

            // Act
            var result = await _userService.UpdatePassword(userId, dto);

            // Assert
            Assert.False(result);
        }
    }
}
