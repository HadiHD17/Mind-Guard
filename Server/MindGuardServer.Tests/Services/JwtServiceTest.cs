using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MindGuardServer.Data;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using MindGuardServer.Services;
using Moq;
using Xunit;

public class JwtServiceTest
{
    private readonly AppDbContext _dbContext;
    private readonly JwtService _jwtService;
    private readonly Mock<IConfiguration> _mockConfiguration;

    public JwtServiceTest()
    {
        // Mock the Configuration
        _mockConfiguration = new Mock<IConfiguration>();
        _mockConfiguration.Setup(c => c["JwtConfig:Issuer"]).Returns("test-issuer");
        _mockConfiguration.Setup(c => c["JwtConfig:Audience"]).Returns("test-audience");

        // Set the key to a string that is exactly 64 characters long (512 bits)
        // Ensure that your key is exactly 64 characters long (512 bits).
        _mockConfiguration.Setup(c => c["JwtConfig:Key"]).Returns("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"); // 64 characters

        _mockConfiguration.Setup(c => c["JwtConfig:TokenValidityMins"]).Returns("30");

        // Create In-Memory DbContext
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("InMemoryDb")  // Use InMemoryDatabase for testing
            .Options;
        _dbContext = new AppDbContext(options);

        // Ensure database is cleared before each test
        _dbContext.Database.EnsureDeleted();  // Deletes the in-memory database
        _dbContext.Database.EnsureCreated();  // Creates a fresh database

        // Seed data into the in-memory database
        _dbContext.Users.Add(new User
        {
            Id = 1,
            Email = "test@test.com",
            Password = PasswordHashHandler.HashPassword("Password123!"),
            FullName = "Test User",
            PhoneNumber = "1234567890",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        _dbContext.SaveChanges();

        // Create JwtService instance
        _jwtService = new JwtService(_dbContext, _mockConfiguration.Object);
    }


    [Fact]
    public async Task Authenticate_ShouldReturnValidToken_WhenCredentialsAreCorrect()
    {
        var userLoginDto = new UserLoginDto
        {
            Email = "test@test.com",
            Password = "Password123!"
        };

        var result = await _jwtService.Authenticate(userLoginDto);

        Assert.NotNull(result);
        Assert.Equal("test@test.com", result.Email);
        Assert.NotEmpty(result.AccessToken);  // Check that the access token is not empty
    }

    [Fact]
    public async Task Authenticate_ShouldReturnNull_WhenCredentialsAreInvalid()
    {
        var userLoginDto = new UserLoginDto
        {
            Email = "invalid@test.com",
            Password = "wrongpassword"
        };

        var result = await _jwtService.Authenticate(userLoginDto);

        Assert.Null(result);  // Should return null when credentials are invalid
    }

    [Fact]
    public async Task Register_ShouldReturnValidToken_WhenRegistrationIsSuccessful()
    {
        var userCreateDto = new UserCreateDto
        {
            FullName = "New User",
            Email = "newuser@test.com",
            Password = "Newpassword123!",
            PhoneNumber = "9876543210",
            IsDark = true,
            Calendar_sync_enabled = true
        };

        var result = await _jwtService.Register(userCreateDto);

        Assert.NotNull(result);
        Assert.Equal("newuser@test.com", result.Email);
        Assert.NotEmpty(result.AccessToken);  // Check that the access token is not empty
    }

    [Fact]
    public async Task Register_ShouldReturnNull_WhenEmailAlreadyExists()
    {
        var userCreateDto = new UserCreateDto
        {
            FullName = "Test User",
            Email = "test@test.com",  // Existing email
            Password = "password123",
            PhoneNumber = "1234567890",
            IsDark = true,
            Calendar_sync_enabled = true
        };

        var result = await _jwtService.Register(userCreateDto);

        Assert.Null(result);  // Should return null when the email already exists
    }
}