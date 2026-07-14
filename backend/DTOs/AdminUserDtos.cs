namespace Edu4Migration.Api.DTOs;

public record AdminUserDto(int Id, string Email, string Role, DateTime CreatedAt, string Initials);
public record CreateAdminUserRequest(string Email, string Password, string Role = "Admin");
public record UpdateAdminUserRequest(string Email, string Role, string Password = "");
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
