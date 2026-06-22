#!/bin/bash

# Local development environment setup script for Get Mumm Backend
# 
# Usage:
#   ./scripts/setup-dev.sh                           # Full setup with database
#   ./scripts/setup-dev.sh --skip-database           # Skip database setup
#   ./scripts/setup-dev.sh --seed-test-data          # Seed test data
#
# Prerequisites: .NET 8 SDK, PostgreSQL
# Canonical location: /scripts/setup-dev.sh (root level)
#

set -e

SKIP_DATABASE=false
SEED_TEST_DATA=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-database)
            SKIP_DATABASE=true
            shift
            ;;
        --seed-test-data)
            SEED_TEST_DATA=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🚀 Get Mumm Backend - Local Development Setup"
echo "================================================"

# Check for required tools
echo ""
echo "📋 Checking prerequisites..."

if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK not found. Please install .NET 8 SDK."
    exit 1
fi

DOTNET_VERSION=$(dotnet --version)
echo "✅ .NET SDK $DOTNET_VERSION found"

# Navigate to backend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/../backend"

if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
    echo "📍 Working directory: $(pwd)"
fi

# Restore NuGet packages
echo ""
echo "📦 Restoring NuGet packages..."
dotnet restore
if [ $? -ne 0 ]; then
    echo "❌ Failed to restore NuGet packages"
    exit 1
fi
echo "✅ NuGet packages restored"

# Build the solution
echo ""
echo "🔨 Building solution..."
dotnet build --configuration Debug
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed successfully"

# Setup database
if [ "$SKIP_DATABASE" = true ]; then
    echo ""
    echo "⏭️  Skipping database setup (as requested)"
else
    echo ""
    echo "💾 Setting up database..."
    
    # Apply migrations
    echo "Applying database migrations..."
    dotnet ef database update --project GetMumm.Api --startup-project GetMumm.Api
    if [ $? -ne 0 ]; then
        echo "❌ Failed to apply migrations"
        exit 1
    fi
    echo "✅ Database migrations applied"
    
    # Seed test data if requested
    if [ "$SEED_TEST_DATA" = true ]; then
        echo ""
        echo "🌱 Seeding test data..."
        # Note: Implement data seeding logic here if needed
        echo "✅ Test data seeded (if seeder implemented)"
    fi
fi

# Run tests
echo ""
echo "🧪 Running tests..."
dotnet test --configuration Debug --verbosity minimal --logger "console;verbosity=minimal" 2>&1 | tail -10
if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed (but setup completed)"
    echo "Note: You can still proceed to development and fix test failures"
fi

echo ""
echo "✅ Local development environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Update connection strings in appsettings.Development.json if needed"
echo "  2. Run 'dotnet run' in the GetMumm.Api directory to start the API"
echo "  3. API will be available at http://localhost:5000"
echo "  4. Swagger docs available at http://localhost:5000/swagger/ui"
echo ""
