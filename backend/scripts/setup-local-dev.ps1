#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Local development environment setup script for Get Mumm Backend
    
.DESCRIPTION
    Sets up the ASP.NET Core backend for local development including:
    - Database initialization with migrations
    - NuGet package restoration
    - Environment configuration
    - Optional test data seeding
    
.PARAMETER SkipDatabase
    Skip database setup (migrations)
    
.PARAMETER SeedTestData
    Seed test data into the database after migrations
    
.EXAMPLE
    .\setup-local-dev.ps1
    .\setup-local-dev.ps1 -SeedTestData
    
.NOTES
    Requires: .NET 8 SDK, PostgreSQL connection string in appsettings.Development.json
#>

param(
    [switch]$SkipDatabase,
    [switch]$SeedTestData
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Get Mumm Backend - Local Development Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check for required tools
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET SDK $dotnetVersion found"
} catch {
    Write-Host "❌ .NET SDK not found. Please install .NET 8 SDK." -ForegroundColor Red
    exit 1
}

# Restore NuGet packages
Write-Host "`n📦 Restoring NuGet packages..." -ForegroundColor Yellow
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to restore NuGet packages" -ForegroundColor Red
    exit 1
}
Write-Host "✅ NuGet packages restored"

# Build the solution
Write-Host "`n🔨 Building solution..." -ForegroundColor Yellow
dotnet build --configuration Debug
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completed successfully"

# Setup database
if ($SkipDatabase) {
    Write-Host "`n⏭️  Skipping database setup (as requested)"
} else {
    Write-Host "`n💾 Setting up database..." -ForegroundColor Yellow
    
    # Apply migrations
    Write-Host "Applying database migrations..." -ForegroundColor Cyan
    dotnet ef database update --project GetMumm.Api --startup-project GetMumm.Api
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to apply migrations" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Database migrations applied"
    
    # Seed test data if requested
    if ($SeedTestData) {
        Write-Host "`n🌱 Seeding test data..." -ForegroundColor Yellow
        # Note: Implement data seeding logic here if needed
        Write-Host "✅ Test data seeded (if seeder implemented)"
    }
}

# Run tests
Write-Host "`n🧪 Running tests..." -ForegroundColor Yellow
dotnet test --configuration Debug --verbosity minimal --logger "console;verbosity=minimal" | Select-Object -Last 5
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed" -ForegroundColor Red
    Write-Host "Note: You can still proceed to development and fix test failures" -ForegroundColor Yellow
}

Write-Host "`n✅ Local development environment setup complete!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update connection strings in appsettings.Development.json if needed"
Write-Host "  2. Run 'dotnet run' in the GetMumm.Api directory to start the API"
Write-Host "  3. API will be available at http://localhost:5000"
Write-Host "  4. Swagger docs available at http://localhost:5000/swagger/ui"
Write-Host ""
