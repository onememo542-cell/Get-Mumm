# Migration Management Script for Get Mumm Backend
# Purpose: Simplify common EF Core migration operations
# Usage: .\scripts\migrations.ps1 -Command <command> [-Name <migrationName>] [-Environment <environment>]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('create', 'update', 'rollback', 'list', 'remove', 'script', 'help')]
    [string]$Command,
    
    [Parameter(Mandatory=$false)]
    [string]$Name,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('Development', 'Production', 'Staging')]
    [string]$Environment = 'Development'
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Info {
    Write-Host "ℹ️  $args" -ForegroundColor Cyan
}

function Write-Success {
    Write-Host "✅ $args" -ForegroundColor Green
}

function Write-Error {
    Write-Host "❌ $args" -ForegroundColor Red
}

function Write-Warning {
    Write-Host "⚠️  $args" -ForegroundColor Yellow
}

# Main commands
switch ($Command) {
    'create' {
        if ([string]::IsNullOrEmpty($Name)) {
            Write-Error "Migration name is required. Usage: .\migrations.ps1 -Command create -Name MigrationName"
            exit 1
        }
        
        Write-Info "Creating migration: $Name"
        Write-Info "Environment: $Environment"
        
        try {
            dotnet ef migrations add $Name -p GetMumm.Infrastructure -s GetMumm.Api
            Write-Success "Migration created successfully!"
            Write-Info "Generated files:"
            Get-ChildItem "GetMumm.Infrastructure\Data\Migrations\*$Name*" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  - $($_.Name)" }
        }
        catch {
            Write-Error "Failed to create migration: $_"
            exit 1
        }
    }
    
    'update' {
        Write-Info "Applying pending migrations to $Environment database..."
        
        try {
            if ($Environment -eq 'Development') {
                dotnet ef database update -p GetMumm.Infrastructure -s GetMumm.Api
            }
            else {
                dotnet ef database update -p GetMumm.Infrastructure -s GetMumm.Api --environment $Environment
            }
            Write-Success "Database updated successfully!"
        }
        catch {
            Write-Error "Failed to update database: $_"
            exit 1
        }
    }
    
    'rollback' {
        if ([string]::IsNullOrEmpty($Name)) {
            Write-Info "Rolling back all migrations (resetting database)..."
            $targetMigration = '0'
        }
        else {
            Write-Info "Rolling back to migration: $Name"
            $targetMigration = $Name
        }
        
        Write-Warning "This will revert the database. Data will be lost!"
        $confirmation = Read-Host "Type 'yes' to confirm"
        
        if ($confirmation -eq 'yes') {
            try {
                if ($Environment -eq 'Development') {
                    dotnet ef database update $targetMigration -p GetMumm.Infrastructure -s GetMumm.Api
                }
                else {
                    dotnet ef database update $targetMigration -p GetMumm.Infrastructure -s GetMumm.Api --environment $Environment
                }
                Write-Success "Rollback completed!"
            }
            catch {
                Write-Error "Failed to rollback: $_"
                exit 1
            }
        }
        else {
            Write-Info "Rollback cancelled."
        }
    }
    
    'list' {
        Write-Info "Listing all migrations..."
        Write-Info "Legend: (Pending) = not yet applied, no prefix = already applied"
        Write-Host ""
        
        try {
            dotnet ef migrations list -p GetMumm.Infrastructure -s GetMumm.Api
        }
        catch {
            Write-Error "Failed to list migrations: $_"
            exit 1
        }
    }
    
    'remove' {
        Write-Warning "Removing the latest unapplied migration..."
        $confirmation = Read-Host "Continue? (yes/no)"
        
        if ($confirmation -eq 'yes') {
            try {
                dotnet ef migrations remove -p GetMumm.Infrastructure -s GetMumm.Api
                Write-Success "Migration removed successfully!"
            }
            catch {
                Write-Error "Failed to remove migration: $_"
                exit 1
            }
        }
        else {
            Write-Info "Remove cancelled."
        }
    }
    
    'script' {
        if ([string]::IsNullOrEmpty($Name)) {
            $outputFile = "migration-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
        }
        else {
            $outputFile = "$Name.sql"
        }
        
        Write-Info "Generating SQL migration script..."
        Write-Info "Output file: $outputFile"
        
        try {
            dotnet ef migrations script -p GetMumm.Infrastructure -s GetMumm.Api --idempotent -o $outputFile
            Write-Success "SQL script generated successfully!"
            Write-Info "Script location: $(Resolve-Path $outputFile)"
        }
        catch {
            Write-Error "Failed to generate script: $_"
            exit 1
        }
    }
    
    'help' {
        Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║           Get Mumm - Database Migration Script Help            ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  .\scripts\migrations.ps1 -Command <command> [-Name <name>] [-Environment <env>]

COMMANDS:

  create <name>
    Creates a new migration after entity model changes
    Usage: .\migrations.ps1 -Command create -Name AddChefEntity
    
  update
    Applies all pending migrations to the database
    Usage: .\migrations.ps1 -Command update
    Usage: .\migrations.ps1 -Command update -Environment Production

  rollback [name]
    Reverts database to a specific migration state
    Usage: .\migrations.ps1 -Command rollback                    (reset all)
    Usage: .\migrations.ps1 -Command rollback -Name InitialCreate

  list
    Shows all migrations and their application status
    Usage: .\migrations.ps1 -Command list

  remove
    Deletes the latest unapplied migration
    Usage: .\migrations.ps1 -Command remove

  script [name]
    Generates SQL script for manual deployment
    Usage: .\migrations.ps1 -Command script
    Usage: .\migrations.ps1 -Command script -Name deploy-2024-01

  help
    Shows this help message
    Usage: .\migrations.ps1 -Command help

OPTIONS:

  -Environment <env>
    Target environment (default: Development)
    Valid values: Development, Production, Staging
    Example: .\migrations.ps1 -Command update -Environment Production

EXAMPLES:

  1. Create a new migration after modifying MenuItem entity:
     .\migrations.ps1 -Command create -Name AddPriceColumn

  2. Apply migrations to development database:
     .\migrations.ps1 -Command update

  3. Apply migrations to production database:
     .\migrations.ps1 -Command update -Environment Production

  4. List all migrations:
     .\migrations.ps1 -Command list

  5. Revert to initial state:
     .\migrations.ps1 -Command rollback

  6. Generate SQL for manual deployment:
     .\migrations.ps1 -Command script -Name prod-deploy

REQUIREMENTS:

  - Working directory: Get-Mumm/backend/
  - .NET CLI installed
  - EF Core tools installed: dotnet tool install -g dotnet-ef
  - PostgreSQL database running
  - Valid connection string in appsettings.json

TROUBLESHOOTING:

  "Unable to find DbContext"
    → Ensure you're in the backend/ directory
    → Check GetMumm.Infrastructure project name is correct

  "Cannot open database"
    → Verify connection string in appsettings.json
    → Ensure PostgreSQL is running
    → Create database if needed: createdb getmumm_dev

  "Migration already applied"
    → Run: .\migrations.ps1 -Command list
    → Apply remaining with: .\migrations.ps1 -Command update

For detailed information, see: GetMumm.Infrastructure/Data/Migrations/README.md
"@
    }
}

