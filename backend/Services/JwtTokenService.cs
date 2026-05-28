using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Edu4Migration.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace Edu4Migration.Api.Services;

public class JwtTokenService(IConfiguration configuration)
{
    public string CreateToken(AdminUser user)
    {
        var key = configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is missing.");
        var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
