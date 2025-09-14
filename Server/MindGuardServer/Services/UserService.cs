using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Helpers;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;
using System;

namespace MindGuardServer.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }



        public async Task<User> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }
            return user;
        }
        public async Task<User?> UpdateUser(int id, UserUpdateDto dto)
        {
            var existing = await _context.Users.FindAsync(id);
            if (existing == null) return null;

            if (!string.IsNullOrWhiteSpace(dto.FullName))
                existing.FullName = dto.FullName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                existing.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
                existing.PhoneNumber = dto.PhoneNumber;

            if (dto.IsDark.HasValue)
                existing.IsDark = dto.IsDark.Value;

            if (dto.Calendar_sync_enabled.HasValue)
                existing.Calendar_sync_enabled = dto.Calendar_sync_enabled.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> UpdatePassword(int id, UpdatePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false; 

           
            if (!PasswordHashHandler.VerifyPassword(dto.CurrentPassword, user.Password))
                throw new Exception("Current password is incorrect.");

          
            user.Password = PasswordHashHandler.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
