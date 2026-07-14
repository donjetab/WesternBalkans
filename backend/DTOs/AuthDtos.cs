namespace Edu4Migration.Api.DTOs;

public record LoginRequest(string Email, string Password);
public record LoginResponse(string Token, int Id, string Email, string Role, string Initials);
