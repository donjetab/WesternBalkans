using System.Security.Claims;
using Edu4Migration.Api.Data;
using Edu4Migration.Api.DTOs;
using Edu4Migration.Api.Models;
using Edu4Migration.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Controllers;

[ApiController]
[Route("api/adminusers")]
public class AdminUsersController(AppDbContext db, PasswordService passwords, AuditService audit) : ControllerBase
{
    private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        "Admin",
        "MainAdmin"
    };

    [HttpGet("me")]
    [Authorize(Roles = "Admin,MainAdmin")]
    public async Task<ActionResult<AdminUserDto>> GetCurrentUser()
    {
        var userId = GetCurrentUserId();
        var user = await db.AdminUsers.FindAsync(userId);
        return user is null ? NotFound() : Ok(ToDto(user));
    }

    [HttpGet]
    [Authorize(Roles = "MainAdmin")]
    public async Task<ActionResult<List<AdminUserDto>>> GetUsers()
    {
        var users = await db.AdminUsers
            .OrderBy(user => user.Role == "MainAdmin" ? 0 : 1)
            .ThenBy(user => user.Email)
            .Select(user => new AdminUserDto(user.Id, user.Email, user.Role, user.CreatedAt, InitialsFromEmail(user.Email)))
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost]
    [Authorize(Roles = "MainAdmin")]
    public async Task<ActionResult<AdminUserDto>> CreateUser(CreateAdminUserRequest request)
    {
        var email = NormalizeEmail(request.Email);
        var role = NormalizeRole(request.Role);

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Email and password are required.");
        }

        var passwordError = ValidatePassword(request.Password);
        if (!string.IsNullOrEmpty(passwordError))
        {
            return BadRequest(passwordError);
        }

        if (await db.AdminUsers.AnyAsync(user => user.Email == email))
        {
            return Conflict("An admin with this email already exists.");
        }

        var user = new AdminUser
        {
            Email = email,
            PasswordHash = passwords.Hash(request.Password),
            Role = role
        };

        db.AdminUsers.Add(user);
        await db.SaveChangesAsync();
        
        var currentEmail = User.FindFirstValue(ClaimTypes.Email) ?? "system";
        await audit.LogAsync(GetCurrentUserId(), currentEmail, "AdminUser", "Created", email);

        return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, ToDto(user));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "MainAdmin")]
    public async Task<ActionResult<AdminUserDto>> UpdateUser(int id, UpdateAdminUserRequest request)
    {
        var user = await db.AdminUsers.FindAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        var email = NormalizeEmail(request.Email);
        var role = NormalizeRole(request.Role);
        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest("Email is required.");
        }

        var currentUserId = GetCurrentUserId();
        if (id == currentUserId && !role.Equals("MainAdmin", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("You cannot remove your own main admin access.");
        }

        if (await db.AdminUsers.AnyAsync(admin => admin.Id != id && admin.Email == email))
        {
            return Conflict("An admin with this email already exists.");
        }

        var oldEmail = user.Email;
        user.Email = email;
        user.Role = role;
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            var passwordError = ValidatePassword(request.Password);
            if (!string.IsNullOrEmpty(passwordError))
            {
                return BadRequest(passwordError);
            }

            user.PasswordHash = passwords.Hash(request.Password);
        }

        await db.SaveChangesAsync();
        
        var currentEmail = User.FindFirstValue(ClaimTypes.Email) ?? "system";
        await audit.LogAsync(GetCurrentUserId(), currentEmail, "AdminUser", "Updated", email);

        return Ok(ToDto(user));
    }

    [HttpPost("change-password")]
    [Authorize(Roles = "Admin,MainAdmin")]
    public async Task<ActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var userId = GetCurrentUserId();
        var user = await db.AdminUsers.FindAsync(userId);
        if (user is null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return BadRequest("Current password and new password are required.");
        }

        var passwordError = ValidatePassword(request.NewPassword);
        if (!string.IsNullOrEmpty(passwordError))
        {
            return BadRequest(passwordError);
        }

        if (!passwords.Verify(request.CurrentPassword, user.PasswordHash))
        {
            return BadRequest("Current password is incorrect.");
        }

        user.PasswordHash = passwords.Hash(request.NewPassword);
        await db.SaveChangesAsync();
        
        var currentEmail = User.FindFirstValue(ClaimTypes.Email) ?? "system";
        await audit.LogAsync(userId, currentEmail, "AdminUser", "PasswordChanged", user.Email);

        return Ok(new { message = "Password changed successfully" });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "MainAdmin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await db.AdminUsers.FindAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        if (id == GetCurrentUserId())
        {
            return BadRequest("You cannot delete your own account.");
        }

        if (user.Role == "MainAdmin" && await db.AdminUsers.CountAsync(admin => admin.Role == "MainAdmin") <= 1)
        {
            return BadRequest("At least one main admin must remain.");
        }

        db.AdminUsers.Remove(user);
        await db.SaveChangesAsync();
        
        var currentEmail = User.FindFirstValue(ClaimTypes.Email) ?? "system";
        await audit.LogAsync(GetCurrentUserId(), currentEmail, "AdminUser", "Deleted", user.Email);

        return NoContent();
    }

    private int GetCurrentUserId()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return int.TryParse(id, out var parsed) ? parsed : 0;
    }

    private static AdminUserDto ToDto(AdminUser user)
    {
        return new AdminUserDto(user.Id, user.Email, user.Role, user.CreatedAt, InitialsFromEmail(user.Email));
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    private static string NormalizeRole(string role)
    {
        return AllowedRoles.Contains(role) ? role : "Admin";
    }

    private static string ValidatePassword(string password)
    {
        var value = password.Trim();
        if (value.Length < 8) return "Password must be at least 8 characters.";
        if (!value.Any(char.IsUpper)) return "Password must include an uppercase letter.";
        if (!value.Any(char.IsLower)) return "Password must include a lowercase letter.";
        if (!value.Any(char.IsDigit)) return "Password must include a number.";
        if (!value.Any(character => !char.IsLetterOrDigit(character))) return "Password must include a special character.";
        return "";
    }

    private static string InitialsFromEmail(string email)
    {
        var namePart = email.Split('@')[0];
        var pieces = namePart.Split(['.', '_', '-', ' '], StringSplitOptions.RemoveEmptyEntries);
        var initials = string.Concat(pieces.Take(2).Select(piece => char.ToUpperInvariant(piece[0])));
        return string.IsNullOrWhiteSpace(initials) ? "A" : initials;
    }
}
