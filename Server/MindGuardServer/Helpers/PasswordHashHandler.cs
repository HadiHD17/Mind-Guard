using Microsoft.AspNetCore.Identity;

namespace MindGuardServer.Helpers
{
    public class PasswordHashHandler
    {
        private static readonly PasswordHasher<object> _hasher = new();

        public static string HashPassword(string password)
        {
            return _hasher.HashPassword(null!, password);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            var result = _hasher.VerifyHashedPassword(null!, hashedPassword, password);
            return result == PasswordVerificationResult.Success;
        }
    }
}
