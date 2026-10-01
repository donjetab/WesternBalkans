using Edu4Migration.Api.Data;
using Edu4Migration.Api.DTOs;
using Edu4Migration.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, PasswordService passwords, JwtTokenService tokens, ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("login")]
    [EnableRateLimiting("Login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            logger.LogWarning("Rejected administrator login with missing credentials from {RemoteIp}", HttpContext.Connection.RemoteIpAddress);
            return Unauthorized("Invalid email or password.");
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await db.AdminUsers.SingleOrDefaultAsync(admin => admin.Email == email);
        if (user is null || !passwords.Verify(request.Password, user.PasswordHash))
        {
            logger.LogWarning("Failed administrator login for {Email} from {RemoteIp}", email, HttpContext.Connection.RemoteIpAddress);
            return Unauthorized("Invalid email or password.");
        }

        if (user.PasswordHash == request.Password)
        {
            user.PasswordHash = passwords.Hash(request.Password);
            await db.SaveChangesAsync();
        }

        logger.LogInformation("Successful administrator login for user {UserId} from {RemoteIp}", user.Id, HttpContext.Connection.RemoteIpAddress);
        return Ok(new LoginResponse(tokens.CreateToken(user), user.Id, user.Email, user.Role, InitialsFromEmail(user.Email)));
    }

    private static string InitialsFromEmail(string email)
    {
        var namePart = email.Split('@')[0];
        var pieces = namePart.Split(['.', '_', '-', ' '], StringSplitOptions.RemoveEmptyEntries);
        var initials = string.Concat(pieces.Take(2).Select(piece => char.ToUpperInvariant(piece[0])));
        return string.IsNullOrWhiteSpace(initials) ? "A" : initials;
    }
}
