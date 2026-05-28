namespace Edu4Migration.Api.DTOs;

public record LoginRequest(string Email, string Password);
public record LoginResponse(string Token, string Email, string Role);
