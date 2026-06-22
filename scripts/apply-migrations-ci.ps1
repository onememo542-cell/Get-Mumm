#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Apply database migrations in CI/CD pipeline
    
.DESCRIPTION
    Applies pending migrations to the database in a CI/CD environment.
    Designed to run after build succeeds and before deployment.
    
.PARAMETER Environment
    Target environment: Development, Staging, Production
    Default: Development
    
.PARAMETER ConnectionString
    Database connection string (overrides appsettings)
    
.PARAMETER DryRun
    Show what migrations would be applied without applying them
    
.EXAMPLE
    .\scripts\apply-migrations-ci.ps1 -Environment Production
    .\scripts\apply-migrations-ci.ps1 -DryRun
    
.NOTES
    Requires: .NET 8 SDK, EF Core tools
    Used in: CI/CD pipeline after successful build
    Canonical location: /scripts/apply-migrations-ci.ps1
#>

param(
    [ValidateSet("Development", "Staging", "Production")]
    [string]$Environment = "Development",
    
    [string]$ConnectionString,
    
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Applying Database Migrations (CI/CD)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Dry Run: $DryRun" -ForegroundColor Yellow

# Navigate to backend directory
$backendPath = Join-Path $PSScriptRoot ".." "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
}

# Set environment variable for EF Core
$env:ASPNETCORE_ENVIRONMENT = $Environment
Write-Host "`n✅ Environment set to: $Environment" -ForegroundColor Green

# Check for pending migrations
Write-Host "`n🔍 Checking for pending migrations..." -ForegroundColor Yellow

$migrationInfo = dotnet ef migrations list --project GetMumm.Api --startup-project GetMumm.Api 2>&1 | Select-String -Pattern "^>"
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Unable to check migrations (this may be normal if first run)" -ForegroundColor Yellow
}

# Apply migrations
if ($DryRun) {
    Write-Host "`n📋 DRY RUN: Would apply the following migrations:" -ForegroundColor Cyan
    Write-Host "   (No changes will be made to the database)" -ForegroundColor Gray
    
    # Show which migrations exist
    dotnet ef migrations list --project GetMumm.Api --startup-project GetMumm.Api
} else {
    Write-Host "`n💾 Applying migrations..." -ForegroundColor Yellow
    
    $migrationArgs = @(
        "ef", "database", "update",
        "--project", "GetMumm.Api",
        "--startup-project", "GetMumm.Api",
        "--verbose"
    )
    
    # Add connection string if provided
    if ($ConnectionString) {
        $migrationArgs += "--connection", $ConnectionString
    }
    
    dotnet @migrationArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to apply migrations" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Database migrations applied successfully" -ForegroundColor Green
}

Write-Host "`n✅ Migration check complete!" -ForegroundColor Green
Write-Host ""
