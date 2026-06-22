# Setup Development Environment Script
# Purpose: Initialize local development environment with database, migrations, and environment variables
# Usage: .\setup-dev.ps1
# Requirements:
#   - .NET 8.0 SDK installed
#   - EF Core CLI tools installed (dotnet ef)
#   - PostgreSQL or Docker running (for database)

param(
    [string]$Environment = "Development",
    [string]$ProjectPath = ".\backend\GetMumm.Api",
    [switch]$SkipDatabase = $false,
    [switch]$SkipMigrations = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GetMumm Backend - Development Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .NET SDK is installed
Write-Host "[1/5] Checking .NET SDK installation..." -ForegroundColor Yellow
$dotnetVersion = dotnet --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: .NET SDK not found. Please install .NET 8.0 SDK." -ForegroundColor Red
    exit 1
}
Write-Host "✓ .NET SDK $dotnetVersion installed" -ForegroundColor Green

# Check if EF Core CLI tools are installed
Write-Host "[2/5] Checking EF Core CLI tools..." -ForegroundColor Yellow
$efVersion = dotnet ef --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing EF Core CLI tools..." -ForegroundColor Yellow
    dotnet tool install --global dotnet-ef
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Could not install EF Core CLI tools. Continuing anyway..." -ForegroundColor Yellow
    } else {
        Write-Host "✓ EF Core CLI tools installed" -ForegroundColor Green
    }
} else {
    Write-Host "✓ EF Core CLI tools installed: $efVersion" -ForegroundColor Green
}

# Restore NuGet packages
Write-Host "[3/5] Restoring NuGet packages..." -ForegroundColor Yellow
Push-Location $ProjectPath
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to restore NuGet packages" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "✓ NuGet packages restored" -ForegroundColor Green
Pop-Location

# Apply database migrations
if (-not $SkipMigrations) {
    Write-Host "[4/5] Applying database migrations..." -ForegroundColor Yellow
    Push-Location $ProjectPath
    
    # Set ASPNETCORE_ENVIRONMENT for dotnet ef
    $env:ASPNETCORE_ENVIRONMENT = $Environment
    
    dotnet ef database update
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Failed to apply migrations. Database connection might not be ready." -ForegroundColor Yellow
        Write-Host "        Run migrations manually with: dotnet ef database update" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Database migrations applied" -ForegroundColor Green
    }
    Pop-Location
} else {
    Write-Host "[4/5] Skipping database migrations (--SkipMigrations flag set)" -ForegroundColor Yellow
}

# Build the project
Write-Host "[5/5] Building the project..." -ForegroundColor Yellow
Push-Location $ProjectPath
dotnet build --configuration Debug
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "✓ Project built successfully" -ForegroundColor Green
Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Development environment setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Set environment variables in .env or appsettings.Development.json:"
Write-Host "     - ConnectionStrings:DefaultConnection"
Write-Host "     - Supabase:Url"
Write-Host "     - Supabase:Key"
Write-Host "     - Supabase:ServiceRoleKey"
Write-Host "     - Cors:AllowedOrigins"
Write-Host ""
Write-Host "  2. Start the development server:"
Write-Host "     cd $ProjectPath"
Write-Host "     dotnet run"
Write-Host ""
Write-Host "  3. View API documentation at:"
Write-Host "     http://localhost:5000/swagger"
Write-Host ""
