using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MindGuardServer.Data;
using MindGuardServer.Helpers;
using MindGuardServer.Models.DTO;
using System.IdentityModel.Tokens.Jwt;
using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services
{
    public class JwtService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;
        public JwtService(AppDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext; 
            _configuration = configuration;
        }
        public async Task<UserResponseDto?> Authenticate(UserLoginDto user)
        {
            if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
                return null;

            var userAccount = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == user.Email);

            if(userAccount is null || !PasswordHashHandler.VerifyPassword(user.Password,userAccount.Password))
                return null;

            var issuer = _configuration["JwtConfig:Issuer"];
            var audience = _configuration["JwtConfig:Audience"];
            var key = _configuration["JwtConfig:Key"];
            var tokenValidityMins = _configuration.GetValue<int>("JwtConfig:TokenValidityMins");
            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins); 

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub,user.Email),
                }),
                Expires = tokenExpiryTimeStamp,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                SecurityAlgorithms.HmacSha512Signature),

            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(securityToken);

            return new UserResponseDto
            {
                AccessToken = accessToken,
                Id = userAccount.Id,
                FullName = userAccount.FullName,
                Email = userAccount.Email,
                PhoneNumber = userAccount.PhoneNumber,
                ExpiresIn = (int)tokenExpiryTimeStamp.Subtract(DateTime.UtcNow).TotalSeconds,
                IsDark = userAccount.IsDark,
                Calendar_sync_enabled = userAccount.Calendar_sync_enabled,
                CreatedAt = userAccount.CreatedAt,
                UpdatedAt = userAccount.UpdatedAt

            };
        }

        public async Task<UserResponseDto?> Register(UserCreateDto user)
        {
            if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
                return null;

            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == user.Email);
            if (existingUser != null)
                return null; 

            var hashedPassword = PasswordHashHandler.HashPassword(user.Password);

            var newUser = new User
            {
                FullName = user.FullName,
                Email = user.Email,
                Password = hashedPassword,
                PhoneNumber = user.PhoneNumber,
                IsDark = user.IsDark,
                Calendar_sync_enabled = user.Calendar_sync_enabled,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(newUser);
            await _dbContext.SaveChangesAsync();

            var token = await Authenticate(new UserLoginDto
            {
                Email = user.Email,
                Password = user.Password
            });

            return token; 
        }

    }
}
