# SQLite to SQL Server Data Migration Script
# This script migrates data from SQLite to SQL Server using PowerShell and .NET
# Usage: .\migrate-data.ps1

param(
    [string]$SqliteDb = "edu4migration.db",
    [string]$SqlServer = "localhost\SQLEXPRESS",
    [string]$Database = "edu4migration",
    [string]$Method = "endpoint"  # Options: endpoint, manual
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Message)
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

Write-Header "SQLite to SQL Server Data Migration"

# Check if SQLite database exists
if (-not (Test-Path $SqliteDb)) {
    Write-Error "SQLite database not found: $SqliteDb"
    exit 1
}

Write-Success "SQLite database found: $SqliteDb"

# Check if SQL Server is accessible
Write-Info "Checking SQL Server connection..."
try {
    $connectionString = "Server=$SqlServer;Database=$Database;Trusted_Connection=true;Connection Timeout=5;"
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    $connection.Close()
    Write-Success "SQL Server is accessible"
}
catch {
    Write-Error "Cannot connect to SQL Server: $_"
    Write-Info "Make sure SQL Server Express (SQLEXPRESS) is running"
    Write-Info "Run: Start-Service MSSQL`$SQLEXPRESS"
    exit 1
}

if ($Method -eq "endpoint") {
    Write-Header "Migration via API Endpoint"
    
    Write-Info "Make sure the backend API is running..."
    Write-Info "Run in another terminal: cd backend && dotnet run"
    Write-Host ""
    Write-Host "Press Enter to continue..." -ForegroundColor Yellow
    Read-Host
    
    Write-Info "Calling migration endpoint..."
    try {
        $response = Invoke-WebRequest `
            -Uri "http://localhost:5088/admin/migrate-sqlite-to-sqlserver" `
            -Method POST `
            -ContentType "application/json" `
            -ErrorAction Stop
        
        $result = $response.Content | ConvertFrom-Json
        Write-Success $result.message
    }
    catch {
        Write-Error "Migration endpoint call failed: $_"
        Write-Info "Make sure the API is running on http://localhost:5088"
        exit 1
    }
}
elseif ($Method -eq "manual") {
    Write-Header "Manual Migration (Advanced)"
    
    Write-Warning "This method requires manual SQL execution."
    Write-Info "Steps:"
    Write-Host "1. Export SQLite data to CSV or SQL scripts"
    Write-Host "2. Import into SQL Server using SQL Server Management Studio"
    Write-Host "3. Verify data integrity"
    Write-Host ""
    Write-Host "This is beyond the scope of this script."
    exit 0
}

Write-Header "Verifying Migration"

Write-Info "Checking record counts..."
try {
    $connection = New-Object System.Data.SqlClient.SqlConnection("Server=$SqlServer;Database=$Database;Trusted_Connection=true;")
    $connection.Open()
    
    $tables = @("AdminUsers", "HomepageContents", "ContentPages", "ContentSections", "NewsItems", "MediaAssets")
    foreach ($table in $tables) {
        $command = $connection.CreateCommand()
        $command.CommandText = "SELECT COUNT(*) FROM $table"
        $count = $command.ExecuteScalar()
        Write-Host "   $table`: $count records" -ForegroundColor Green
    }
    
    $connection.Close()
    Write-Success "Migration verification complete"
}
catch {
    Write-Error "Verification failed: $_"
    exit 1
}

Write-Header "Migration Complete!"
Write-Success "Data has been successfully migrated from SQLite to SQL Server"
Write-Info "Next steps:"
Write-Host "1. Test the API endpoints: curl http://localhost:5088/api/news"
Write-Host "2. Test the frontend"
Write-Host "3. Archive the SQLite database as a backup"
Write-Host "4. Remove the temporary migration endpoint from Program.cs"
Write-Host ""
