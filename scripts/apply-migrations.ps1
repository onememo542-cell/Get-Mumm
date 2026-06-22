# Apply Database Migrations Script
# Purpose: Apply EF Core migrations in CI/CD pipeline
# Usage: .\apply-migrations.ps1 -Environment Production
# Environment variables expected:
#   - ASPNETCORE_ENVIRONMENT: Development, Staging, or Production
#   - ConnectionStrings__DefaultConnection: Full PostgreSQL connection string

param(
    [string]$Environment = "Development",
    [string]$ProjectPath = ".\backend\GetMumm.Api",
    [string]$ConnectionString = "",
    [int]$MaxRetries = 3,
    [int]$RetryDelaySeconds = 10
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Apply EF Core Migrations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Project Path: $ProjectPath" -ForegroundColor Yellow
Write-Host ""

# Validate environment
if ($Environment -notin @("Development", "Staging", "Production")) {
    Write-Host "ERROR: Invalid environment. Must be Development, Staging, or Production" -ForegroundColor Red
    exit 1
}

# Set environment variable
$env:ASPNETCORE_ENVIRONMENT = $Environment

# Check if EF Core CLI tools are installed
Write-Host "[1/4] Checking EF Core CLI tools..." -ForegroundColor Yellow
$efVersion = dotnet ef --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: EF Core CLI tools not found. Install with: dotnet tool install --global dotnet-ef" -ForegroundColor Red
    exit 1
}
Write-Host "✓ EF Core CLI tools found: $efVersion" -ForegroundColor Green

# Check database connectivity with retries
Write-Host "[2/4] Checking database connectivity (max $MaxRetries attempts)..." -ForegroundColor Yellow
$attempt = 0
$connected = $false

while ($attempt -lt $MaxRetries -and -not $connected) {
    $attempt++
    Write-Host "  Attempt $attempt/$MaxRetries..." -ForegroundColor Gray
    
    Push-Location $ProjectPath
    
    # Try to list migrations (lightweight database check)
    $output = dotnet ef migrations list 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $connected = $true
        Write-Host "✓ Database connection successful" -ForegroundColor Green
    } else {
        if ($attempt -lt $MaxRetries) {
            Write-Host "  Connection failed, waiting $RetryDelaySeconds seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds $RetryDelaySeconds
        }
    }
    
    Pop-Location
}

if (-not $connected) {
    Write-Host "ERROR: Could not connect to database after $MaxRetries attempts" -ForegroundColor Red
    Write-Host "Please verify:" -ForegroundColor Yellow
    Write-Host "  - Database is running and accessible"
    Write-Host "  - ConnectionStrings__DefaultConnection environment variable is set correctly"
    Write-Host "  - Network connectivity to database host"
    exit 1
}

# Apply pending migrations
Write-Host "[3/4] Applying pending migrations..." -ForegroundColor Yellow
Push-Location $ProjectPath

# Get list of pending migrations
$pendingMigrations = dotnet ef migrations list --no-build 2>&1 | Select-String "^\s*\?"
$hasPending = $pendingMigrations | Measure-Object | Select-Object -ExpandProperty Count

if ($hasPending -gt 0) {
    Write-Host "  Found $hasPending pending migration(s)" -ForegroundColor Yellow
    Write-Host "  $($pendingMigrations -join ', ')" -ForegroundColor Gray
    
    # Apply migrations
    dotnet ef database update --no-build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to apply migrations" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "✓ Migrations applied successfully" -ForegroundColor Green
} else {
    Write-Host "✓ No pending migrations found (database is up to date)" -ForegroundColor Green
}

Pop-Location

# Verify migration success
Write-Host "[4/4] Verifying migration success..." -ForegroundColor Yellow
Push-Location $ProjectPath

# List all applied migrations
$appliedMigrations = dotnet ef migrations list --no-build 2>&1 | Select-String "^\s*[^?]"
$count = $appliedMigrations | Measure-Object | Select-Object -ExpandProperty Count

if ($count -gt 0) {
    Write-Host "✓ $count migration(s) applied:" -ForegroundColor Green
    foreach ($migration in $appliedMigrations) {
        Write-Host "  ✓ $($migration -replace '^\s+', '')" -ForegroundColor Green
    }
} else {
    Write-Host "WARNING: No migrations found in database" -ForegroundColor Yellow
}

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Migration process complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Rollback (if needed):" -ForegroundColor Yellow
Write-Host "  dotnet ef database update <previous-migration-name>" -ForegroundColor Gray
Write-Host ""
