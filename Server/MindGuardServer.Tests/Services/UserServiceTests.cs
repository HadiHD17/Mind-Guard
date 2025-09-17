using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;
using Xunit;

namespace MindGuardServer.Tests
{
    public class UserServiceTests
    {
        private readonly UserService _userService;
        private readonly AppDbContext _dbContext;

        public UserServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // isolate each run
                .Options;

            _dbContext = new AppDbContext(options);
            _userService = new UserService(_dbContext);

            _dbContext.Database.EnsureCreated();
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
            var userId = 1;

            var result = await _userService.GetUserById(userId);

            Assert.NotNull(result);
            Assert.Equal(userId, result!.Id);
            Assert.Equal("Test User", result.FullName);
        }

        [Fact]
        public async Task GetUserById_ShouldReturnNull_WhenUserDoesNotExist()
        {
            var result = await _userService.GetUserById(999);
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateUser_ShouldReturnUpdatedUser_WhenUserExists()
        {
            var userId = 1;
            var updateDto = new UserUpdateDto
            {
                FullName = "Updated User",
                Email = "updated@test.com",
                PhoneNumber = "0987654321",
                IsDark = false,
                Calendar_sync_enabled = false
            };

            var result = await _userService.UpdateUser(userId, updateDto);

            Assert.NotNull(result);
            Assert.Equal("Updated User", result!.FullName);
            Assert.Equal("updated@test.com", result.Email);
            Assert.Equal("0987654321", result.PhoneNumber);
            Assert.False(result.IsDark);
            Assert.False(result.Calendar_sync_enabled);
        }

        [Fact]
        public async Task UpdateUser_ShouldReturnNull_WhenUserDoesNotExist()
        {
            var updateDto = new UserUpdateDto
            {
                FullName = "Updated User",
                Email = "updated@test.com",
                PhoneNumber = "0987654321",
                IsDark = false,
                Calendar_sync_enabled = false
            };

            var result = await _userService.UpdateUser(999, updateDto);
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdatePassword_ShouldReturnTrue_WhenPasswordIsUpdated()
        {
            var dto = new UpdatePasswordDto
            {
                CurrentPassword = "Password123!",
                NewPassword = "NewPassword123!",
                ConfirmNewPassword = "NewPassword123!"
            };

            var result = await _userService.UpdatePassword(1, dto);

            Assert.True(result);
        }

        [Fact]
        public async Task UpdatePassword_ShouldReturnFalse_WhenCurrentPasswordIsIncorrect()
        {
            var dto = new UpdatePasswordDto
            {
                CurrentPassword = "WrongPassword123!",
                NewPassword = "NewPassword123!",
                ConfirmNewPassword = "NewPassword123!"
            };

            var result = await _userService.UpdatePassword(1, dto);

            Assert.False(result);
        }

        [Fact]
        public async Task UpdatePassword_ShouldReturnFalse_WhenUserDoesNotExist()
        {
            var dto = new UpdatePasswordDto
            {
                CurrentPassword = "Password123!",
                NewPassword = "NewPassword123!",
                ConfirmNewPassword = "NewPassword123!"
            };

            var result = await _userService.UpdatePassword(999, dto);

            Assert.False(result);
        }
    }
}
