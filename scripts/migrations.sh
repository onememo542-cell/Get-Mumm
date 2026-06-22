#!/bin/bash

# Migration Management Script for Get Mumm Backend
# Purpose: Simplify common EF Core migration operations
# Usage: ./scripts/migrations.sh <command> [options]

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Display help
show_help() {
    cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║           Get Mumm - Database Migration Script Help            ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  ./scripts/migrations.sh <command> [options]

COMMANDS:

  create <name>
    Creates a new migration after entity model changes
    Usage: ./migrations.sh create AddChefEntity
    
  update [environment]
    Applies all pending migrations to the database
    Usage: ./migrations.sh update
    Usage: ./migrations.sh update production

  rollback [name]
    Reverts database to a specific migration state
    Usage: ./migrations.sh rollback                    (reset all)
    Usage: ./migrations.sh rollback InitialCreate

  list
    Shows all migrations and their application status
    Usage: ./migrations.sh list

  remove
    Deletes the latest unapplied migration
    Usage: ./migrations.sh remove

  script [name]
    Generates SQL script for manual deployment
    Usage: ./migrations.sh script
    Usage: ./migrations.sh script deploy-2024-01

  help
    Shows this help message
    Usage: ./migrations.sh help

EXAMPLES:

  1. Create a new migration after modifying MenuItem entity:
     ./migrations.sh create AddPriceColumn

  2. Apply migrations to development database:
     ./migrations.sh update

  3. Apply migrations to production database:
     ./migrations.sh update production

  4. List all migrations:
     ./migrations.sh list

  5. Revert to initial state:
     ./migrations.sh rollback

  6. Generate SQL for manual deployment:
     ./migrations.sh script prod-deploy

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
    → Run: ./migrations.sh list
    → Apply remaining with: ./migrations.sh update

For detailed information, see: GetMumm.Infrastructure/Data/Migrations/README.md
EOF
}

# Command handlers
create_migration() {
    local name=$1
    
    if [ -z "$name" ]; then
        error "Migration name is required"
        echo "Usage: ./migrations.sh create MigrationName"
        exit 1
    fi
    
    info "Creating migration: $name"
    
    if dotnet ef migrations add "$name" -p GetMumm.Infrastructure -s GetMumm.Api; then
        success "Migration created successfully!"
        info "Generated files in GetMumm.Infrastructure/Data/Migrations/"
    else
        error "Failed to create migration"
        exit 1
    fi
}

update_database() {
    local env=$1
    if [ -z "$env" ]; then
        env="Development"
    fi
    
    # Convert to Title Case for .NET
    env=$(echo "${env:0:1}" | tr '[:lower:]' '[:upper:]')${env:1}
    
    info "Applying pending migrations to $env database..."
    
    if [ "$env" = "Development" ]; then
        dotnet ef database update -p GetMumm.Infrastructure -s GetMumm.Api
    else
        dotnet ef database update -p GetMumm.Infrastructure -s GetMumm.Api --environment "$env"
    fi
    
    if [ $? -eq 0 ]; then
        success "Database updated successfully!"
    else
        error "Failed to update database"
        exit 1
    fi
}

rollback_database() {
    local name=$1
    
    if [ -z "$name" ]; then
        warning "Rolling back all migrations (resetting database)..."
        target="0"
    else
        info "Rolling back to migration: $name"
        target="$name"
    fi
    
    warning "This will revert the database. Data will be lost!"
    read -p "Type 'yes' to confirm: " confirmation
    
    if [ "$confirmation" = "yes" ]; then
        if dotnet ef database update "$target" -p GetMumm.Infrastructure -s GetMumm.Api; then
            success "Rollback completed!"
        else
            error "Failed to rollback"
            exit 1
        fi
    else
        info "Rollback cancelled."
    fi
}

list_migrations() {
    info "Listing all migrations..."
    echo "Legend: (Pending) = not yet applied, no prefix = already applied"
    echo ""
    
    if ! dotnet ef migrations list -p GetMumm.Infrastructure -s GetMumm.Api; then
        error "Failed to list migrations"
        exit 1
    fi
}

remove_migration() {
    warning "Removing the latest unapplied migration..."
    read -p "Continue? (yes/no): " confirmation
    
    if [ "$confirmation" = "yes" ]; then
        if dotnet ef migrations remove -p GetMumm.Infrastructure -s GetMumm.Api; then
            success "Migration removed successfully!"
        else
            error "Failed to remove migration"
            exit 1
        fi
    else
        info "Remove cancelled."
    fi
}

generate_script() {
    local name=$1
    
    if [ -z "$name" ]; then
        outputfile="migration-$(date +%Y%m%d-%H%M%S).sql"
    else
        outputfile="$name.sql"
    fi
    
    info "Generating SQL migration script..."
    info "Output file: $outputfile"
    
    if dotnet ef migrations script -p GetMumm.Infrastructure -s GetMumm.Api --idempotent -o "$outputfile"; then
        success "SQL script generated successfully!"
        info "Script location: $(pwd)/$outputfile"
    else
        error "Failed to generate script"
        exit 1
    fi
}

# Main script logic
if [ $# -lt 1 ]; then
    show_help
    exit 1
fi

command=$1
shift

case $command in
    create)
        create_migration "$@"
        ;;
    update)
        update_database "$@"
        ;;
    rollback)
        rollback_database "$@"
        ;;
    list)
        list_migrations
        ;;
    remove)
        remove_migration
        ;;
    script)
        generate_script "$@"
        ;;
    help)
        show_help
        ;;
    *)
        error "Unknown command: $command"
        echo ""
        show_help
        exit 1
        ;;
esac

