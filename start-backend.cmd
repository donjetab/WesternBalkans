@echo off
cd /d "%~dp0"
dotnet run --project backend\Edu4Migration.Api.csproj --launch-profile Edu4Migration.Api
pause
