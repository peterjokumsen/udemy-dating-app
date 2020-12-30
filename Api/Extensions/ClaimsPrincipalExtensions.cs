using System;
using System.Security.Claims;

namespace Api.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
            => Guid.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        public static string GetUsername(this ClaimsPrincipal user) =>
            user.FindFirst(ClaimTypes.Name)?.Value;
    }
}
