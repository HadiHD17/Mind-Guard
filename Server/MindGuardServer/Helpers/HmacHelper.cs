using System.Security.Cryptography;
using System.Text;

namespace MindGuardServer.Helpers
{
    public static class HmacHelper
    {
        public static string HmacSha256Hex(string body, string secret)
        {
            var key = Encoding.UTF8.GetBytes(secret);
            var data = Encoding.UTF8.GetBytes(body);
            using var hmac = new HMACSHA256(key);
            var hash = hmac.ComputeHash(data);
            return Convert.ToHexString(hash).ToLowerInvariant();
        }
    }
}
