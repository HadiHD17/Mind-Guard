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
        private static readonly TimeZoneInfo LebanonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Beirut");

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        private DateTime ConvertToLebanonTime(DateTime utcTime)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(utcTime, LebanonTimeZone);
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
        public async Task<User> UpdateUser(int id, User user)
        {
            var existinguser = await _context.Users.FindAsync(id);
            if (existinguser == null) 
            {
                return null;
            }
            existinguser.FullName = user.FullName;
            if (!string.IsNullOrWhiteSpace(user.Email))
                existinguser.Email = user.Email;
            if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                existinguser.PhoneNumber = user.PhoneNumber;
            existinguser.IsDark = user.IsDark;
            existinguser.Calendar_sync_enabled = user.Calendar_sync_enabled;
            existinguser.UpdatedAt = ConvertToLebanonTime(DateTime.UtcNow);

            await _context.SaveChangesAsync();
            return existinguser;
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
