# Set Application Settings from Environment Variables Script
# Purpose: Replace appsettings values from environment variables for configuration management
# Usage: .\set-appsettings.ps1 -Environment Production -ConfigPath .\backend\GetMumm.Api\appsettings.json
# 
# Environment Variables Mapped:
#   - DB_HOST -> ConnectionStrings:DefaultConnection (host)
#   - DB_PORT -> ConnectionStrings:DefaultConnection (port)
#   - DB_USER -> ConnectionStrings:DefaultConnection (username)
#   - DB_PASSWORD -> ConnectionStrings:DefaultConnection (password)
#   - DB_NAME -> ConnectionStrings:DefaultConnection (database)
#   - SUPABASE_URL -> Supabase:Url
#   - SUPABASE_KEY -> Supabase:Key
#   - SUPABASE_SERVICE_ROLE_KEY -> Supabase:ServiceRoleKey
#   - CORS_ALLOWED_ORIGINS -> Cors:AllowedOrigins (comma-separated)
#   - LOG_LEVEL -> Logging:LogLevel:Default

param(
    [string]$Environment = "Development",
    [string]$ConfigPath = ".\backend\GetMumm.Api\appsettings.json",
    [switch]$Backup = $true
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Set Application Settings from Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Config Path: $ConfigPath" -ForegroundColor Yellow
Write-Host ""

# Validate config file exists
if (-not (Test-Path $ConfigPath)) {
    Write-Host "ERROR: Configuration file not found: $ConfigPath" -ForegroundColor Red
    exit 1
}

# Create backup if requested
if ($Backup) {
    $backupPath = "$ConfigPath.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Host "[1/3] Creating backup..." -ForegroundColor Yellow
    Copy-Item -Path $ConfigPath -Destination $backupPath
    Write-Host "✓ Backup created: $backupPath" -ForegroundColor Green
}

Write-Host "[2/3] Loading configuration..." -ForegroundColor Yellow

# Load JSON configuration
$config = Get-Content -Path $ConfigPath -Raw | ConvertFrom-Json
Write-Host "✓ Configuration loaded" -ForegroundColor Green

Write-Host "[3/3] Applying environment variables..." -ForegroundColor Yellow

# Flag to track if any values were changed
$changed = $false

# Database Connection String
if ($env:DB_HOST -or $env:DB_PORT -or $env:DB_USER -or $env:DB_PASSWORD -or $env:DB_NAME) {
    Write-Host "  Processing database connection..." -ForegroundColor Gray
    
    $dbHost = $env:DB_HOST ?? "localhost"
    $dbPort = $env:DB_PORT ?? "5432"
    $dbUser = $env:DB_USER ?? "postgres"
    $dbPassword = $env:DB_PASSWORD ?? ""
    $dbName = $env:DB_NAME ?? "postgres"
    
    # Build connection string
    $connectionString = "Host=$dbHost;Port=$dbPort;Database=$dbName;Username=$dbUser;Password=$dbPassword;SSL Mode=Require;Trust Server Certificate=true;Keepalive=30;Command Timeout=120;Tcp Keepalive=true;Max Auto Prepare=0"
    
    if ($config.ConnectionStrings.DefaultConnection -ne $connectionString) {
        $config.ConnectionStrings.DefaultConnection = $connectionString
        Write-Host "    ✓ ConnectionStrings:DefaultConnection updated" -ForegroundColor Green
        $changed = $true
    }
    
    # Also update Database section
    if ($env:DB_HOST) { $config.Database.Host = $dbHost }
    if ($env:DB_PORT) { $config.Database.Port = [int]$dbPort }
    if ($env:DB_USER) { $config.Database.Username = $dbUser }
    if ($env:DB_PASSWORD) { $config.Database.Password = $dbPassword }
    if ($env:DB_NAME) { $config.Database.Database = $dbName }
}

# Supabase Configuration
if ($env:SUPABASE_URL) {
    if ($config.Supabase.Url -ne $env:SUPABASE_URL) {
        $config.Supabase.Url = $env:SUPABASE_URL
        Write-Host "    ✓ Supabase:Url updated" -ForegroundColor Green
        $changed = $true
    }
}

if ($env:SUPABASE_KEY) {
    if ($config.Supabase.Key -ne $env:SUPABASE_KEY) {
        $config.Supabase.Key = $env:SUPABASE_KEY
        Write-Host "    ✓ Supabase:Key updated" -ForegroundColor Green
        $changed = $true
    }
}

if ($env:SUPABASE_SERVICE_ROLE_KEY) {
    if ($config.Supabase.ServiceRoleKey -ne $env:SUPABASE_SERVICE_ROLE_KEY) {
        $config.Supabase.ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
        Write-Host "    ✓ Supabase:ServiceRoleKey updated" -ForegroundColor Green
        $changed = $true
    }
}

# CORS Configuration
if ($env:CORS_ALLOWED_ORIGINS) {
    Write-Host "  Processing CORS origins..." -ForegroundColor Gray
    $origins = $env:CORS_ALLOWED_ORIGINS -split ','
    $config.Cors.AllowedOrigins = @($origins | ForEach-Object { $_.Trim() })
    Write-Host "    ✓ Cors:AllowedOrigins updated ($($origins.Count) origin(s))" -ForegroundColor Green
    $changed = $true
}

# Logging Configuration
if ($env:LOG_LEVEL) {
    Write-Host "  Processing logging configuration..." -ForegroundColor Gray
    if ($config.Logging.LogLevel.Default -ne $env:LOG_LEVEL) {
        $config.Logging.LogLevel.Default = $env:LOG_LEVEL
        Write-Host "    ✓ Logging:LogLevel:Default updated to '$env:LOG_LEVEL'" -ForegroundColor Green
        $changed = $true
    }
}

# Save configuration
if ($changed) {
    Write-Host "  Saving configuration..." -ForegroundColor Gray
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $ConfigPath
    Write-Host "✓ Configuration saved" -ForegroundColor Green
} else {
    Write-Host "✓ No environment variables found to apply" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Configuration update complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary of environment variables recognized:" -ForegroundColor Yellow
Write-Host "  Database:"
Write-Host "    - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME" -ForegroundColor Gray
Write-Host "  Supabase:"
Write-Host "    - SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Gray
Write-Host "  CORS:"
Write-Host "    - CORS_ALLOWED_ORIGINS (comma-separated)" -ForegroundColor Gray
Write-Host "  Logging:"
Write-Host "    - LOG_LEVEL (Information, Warning, Error, etc.)" -ForegroundColor Gray
Write-Host ""
