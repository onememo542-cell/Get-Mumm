#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Configure application environment variables and appsettings
    
.DESCRIPTION
    Replaces environment-specific placeholders in appsettings files
    and sets environment variables from configuration sources.
    
.PARAMETER Environment
    Target environment: Development, Staging, Production
    
.PARAMETER ConfigSource
    Source for configuration: EnvVars, ConfigFile
    Default: EnvVars (reads from environment variables)
    
.PARAMETER ConfigFile
    Path to configuration JSON file (when ConfigSource is ConfigFile)
    
.EXAMPLE
    .\configure-env.ps1 -Environment Production
    .\configure-env.ps1 -Environment Staging -ConfigSource ConfigFile -ConfigFile ./config.prod.json
    
.NOTES
    Replaces these placeholders in appsettings:
    - {CONNECTION_STRING}
    - {SUPABASE_URL}
    - {SUPABASE_KEY}
    - {CORS_ORIGINS}
    - {LOG_LEVEL}
#>

param(
    [ValidateSet("Development", "Staging", "Production")]
    [string]$Environment = "Production",
    
    [ValidateSet("EnvVars", "ConfigFile")]
    [string]$ConfigSource = "EnvVars",
    
    [string]$ConfigFile
)

$ErrorActionPreference = "Stop"

Write-Host "⚙️  Configuring Environment Variables" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Config Source: $ConfigSource" -ForegroundColor Yellow

# Load configuration
$config = @{}

if ($ConfigSource -eq "ConfigFile") {
    if (-not $ConfigFile) {
        Write-Host "❌ ConfigFile parameter required when ConfigSource is ConfigFile" -ForegroundColor Red
        exit 1
    }
    
    if (-not (Test-Path $ConfigFile)) {
        Write-Host "❌ Configuration file not found: $ConfigFile" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`n📖 Loading configuration from: $ConfigFile" -ForegroundColor Yellow
    $config = Get-Content $ConfigFile | ConvertFrom-Json
    
} else {
    Write-Host "`n📖 Loading configuration from environment variables" -ForegroundColor Yellow
    
    # Read from environment variables
    $config = @{
        ConnectionString = $env:DB_CONNECTION_STRING
        SupabaseUrl = $env:SUPABASE_URL
        SupabaseKey = $env:SUPABASE_KEY
        CorsOrigins = $env:CORS_ORIGINS
        LogLevel = $env:LOG_LEVEL
    }
}

# Validate required configuration
$requiredKeys = @("ConnectionString", "SupabaseUrl", "SupabaseKey")
foreach ($key in $requiredKeys) {
    if (-not $config[$key]) {
        Write-Host "❌ Missing required configuration: $key" -ForegroundColor Red
        Write-Host "   Set environment variable or provide config file" -ForegroundColor Gray
        exit 1
    }
}

# Update appsettings file
$appSettingsPath = "GetMumm.Api/appsettings.$Environment.json"

if (-not (Test-Path $appSettingsPath)) {
    $appSettingsPath = "GetMumm.Api/appsettings.json"
}

Write-Host "`n✏️  Updating appsettings..." -ForegroundColor Yellow

try {
    $appSettings = Get-Content $appSettingsPath | ConvertFrom-Json
    
    # Update connection strings
    if ($config.ConnectionString) {
        $appSettings.ConnectionStrings.DefaultConnection = $config.ConnectionString
        Write-Host "  ✅ Connection string updated"
    }
    
    # Update Supabase settings
    if ($config.SupabaseUrl) {
        $appSettings.Supabase.Url = $config.SupabaseUrl
        Write-Host "  ✅ Supabase URL updated"
    }
    
    if ($config.SupabaseKey) {
        $appSettings.Supabase.Key = $config.SupabaseKey
        Write-Host "  ✅ Supabase Key updated"
    }
    
    # Update CORS origins
    if ($config.CorsOrigins) {
        $origins = $config.CorsOrigins -split ","
        $appSettings.Cors.AllowedOrigins = @($origins)
        Write-Host "  ✅ CORS origins updated"
    }
    
    # Update log level
    if ($config.LogLevel) {
        $appSettings.Logging.LogLevel.Default = $config.LogLevel
        Write-Host "  ✅ Log level updated"
    }
    
    # Save updated settings
    $appSettings | ConvertTo-Json -Depth 10 | Set-Content $appSettingsPath
    Write-Host "`n✅ Configuration updated successfully" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Failed to update appsettings: $_" -ForegroundColor Red
    exit 1
}

# Set environment variable for .NET
$env:ASPNETCORE_ENVIRONMENT = $Environment
Write-Host "✅ ASPNETCORE_ENVIRONMENT set to: $Environment" -ForegroundColor Green

Write-Host "`n✅ Environment configuration complete!" -ForegroundColor Green
Write-Host ""
