# Deployment & Development Scripts

This directory contains all scripts for local development setup and CI/CD pipeline automation for both frontend and backend components.

## 📁 Directory Structure

```
scripts/
├── README.md                        # This file
├── setup-dev.ps1                    # Windows: Complete development setup
├── setup-dev.sh                     # Linux/Mac: Complete development setup
├── setup-local-dev.ps1              # Windows: Backend local setup (legacy)
├── setup-local-dev.sh               # Linux/Mac: Backend local setup (legacy)
├── apply-migrations.ps1             # Windows: Apply database migrations
├── apply-migrations-ci.ps1          # Windows: CI/CD database migrations
├── set-appsettings.ps1              # Windows: Set application settings
├── configure-env.ps1                # Windows: Environment configuration
├── migrations.ps1                   # Windows: Migration utilities
├── migrations.sh                     # Linux/Mac: Migration utilities
├── run-tests-local.bat              # Windows: Run local tests
├── run-tests-local.sh               # Linux/Mac: Run local tests
├── pre-deploy.bat                   # Windows: Pre-deployment tasks
├── pre-deploy.sh                    # Linux/Mac: Pre-deployment tasks
├── wait-for-services.sh             # Linux/Mac: Wait for services startup
└── backend/                         # Backend-specific scripts (if needed)
    ├── setup-local-dev.ps1          # Backend setup (canonical: use ../setup-dev.ps1)
    ├── setup-local-dev.sh           # Backend setup (canonical: use ../setup-dev.sh)
    ├── apply-migrations-ci.ps1      # Backend migrations (canonical: use ../apply-migrations-ci.ps1)
    ├── configure-env.ps1            # Backend config (canonical: use ../configure-env.ps1)
    └── README.md                    # Backend script documentation
```

## 🚀 Quick Start

### Windows (PowerShell)

```powershell
# Initial setup (database + packages + tests)
.\scripts\setup-dev.ps1

# Start development server
cd backend\GetMumm.Api
dotnet run

# API available at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger/ui
```

### Linux/Mac (Bash)

```bash
# Initial setup
./scripts/setup-dev.sh

# Start development server
cd backend/GetMumm.Api
dotnet run

# API available at http://localhost:5000
```

## 📋 Scripts Overview

### Setup Scripts

#### `setup-dev.ps1` / `setup-dev.sh`
**Purpose**: Complete local development environment setup

**What it does**:
1. ✅ Checks .NET SDK installation
2. ✅ Restores NuGet packages  
3. ✅ Builds the backend solution
4. ✅ Applies database migrations
5. ✅ Runs test suite
6. ✅ (Optional) Seeds test data

**Usage**:
```powershell
# Windows
.\scripts\setup-dev.ps1                    # Full setup
.\scripts\setup-dev.ps1 -SkipDatabase      # Skip DB setup
.\scripts\setup-dev.ps1 -SeedTestData      # Seed test data

# Linux/Mac
./scripts/setup-dev.sh                     # Full setup
./scripts/setup-dev.sh --skip-database     # Skip DB setup
./scripts/setup-dev.sh --seed-test-data    # Seed test data
```

**Requirements**:
- .NET 8 SDK
- PostgreSQL (running, connection string in `appsettings.Development.json`)

---

### Database Scripts

#### `apply-migrations-ci.ps1`
**Purpose**: Apply database migrations in CI/CD pipeline

**What it does**:
1. Sets ASPNETCORE_ENVIRONMENT
2. Checks for pending migrations
3. Applies migrations (or shows dry-run)
4. Handles error scenarios

**Usage**:
```powershell
# Apply to Development
.\scripts\apply-migrations-ci.ps1 -Environment Development

# Apply to Production
.\scripts\apply-migrations-ci.ps1 -Environment Production

# Dry run (show what would happen)
.\scripts\apply-migrations-ci.ps1 -Environment Production -DryRun
```

**Environment Variables**:
- `ASPNETCORE_ENVIRONMENT` - Development, Staging, Production
- `DB_CONNECTION_STRING` - PostgreSQL connection string (optional)

**Exit Codes**:
- `0` = Success
- `1` = Error

---

#### `migrations.ps1` / `migrations.sh`
**Purpose**: Database migration utilities and management

**Usage**:
```powershell
# List all migrations
.\scripts\migrations.ps1 -List

# Create new migration
.\scripts\migrations.ps1 -Create -Name "AddUserTable"

# Update database to specific migration
.\scripts\migrations.ps1 -Update -Migration "InitialCreate"

# Rollback to previous migration
.\scripts\migrations.ps1 -Rollback
```

---

### Configuration Scripts

#### `configure-env.ps1`
**Purpose**: Configure environment variables and appsettings

**What it does**:
1. Loads configuration from environment or file
2. Updates appsettings with configuration values
3. Validates required settings
4. Sets ASPNETCORE_ENVIRONMENT

**Usage**:
```powershell
# Configure from environment variables
.\scripts\configure-env.ps1 -Environment Production

# Configure from JSON file
.\scripts\configure-env.ps1 -Environment Staging -ConfigSource ConfigFile -ConfigFile ./config.staging.json

# Dry run
.\scripts\configure-env.ps1 -Environment Development -DryRun
```

**Environment Variables** (when using EnvVars):
```
DB_CONNECTION_STRING       # PostgreSQL connection string
SUPABASE_URL              # Supabase project URL
SUPABASE_KEY              # Supabase API key
CORS_ORIGINS              # Comma-separated: http://localhost:3000,https://example.com
LOG_LEVEL                 # Information, Warning, Error
```

---

### Test Scripts

#### `run-tests-local.bat` / `run-tests-local.sh`
**Purpose**: Run local test suite with options

**Usage**:
```powershell
# Windows
.\scripts\run-tests-local.bat                    # All tests
.\scripts\run-tests-local.bat unit              # Unit tests only

# Linux/Mac
./scripts/run-tests-local.sh                    # All tests
./scripts/run-tests-local.sh integration        # Integration tests only
```

---

### Deployment Scripts

#### `pre-deploy.bat` / `pre-deploy.sh`
**Purpose**: Pre-deployment validation and preparation

**What it does**:
1. Validates environment configuration
2. Checks database connectivity
3. Runs final test suite
4. Generates deployment artifacts

**Usage**:
```powershell
# Windows
.\scripts\pre-deploy.bat

# Linux/Mac
./scripts/pre-deploy.sh
```

---

#### `wait-for-services.sh`
**Purpose**: Wait for dependent services to be ready

**Usage**:
```bash
# Wait for PostgreSQL
./scripts/wait-for-services.sh --service postgres --host localhost --port 5432

# Wait for Supabase
./scripts/wait-for-services.sh --service supabase --url https://proj.supabase.co
```

---

## 🔄 Common Workflows

### Local Development

```powershell
# 1. Initial setup
.\scripts\setup-dev.ps1

# 2. Make code changes in your editor

# 3. Run tests
.\scripts\run-tests-local.bat

# 4. Start development server
cd backend\GetMumm.Api
dotnet run

# 5. Visit http://localhost:5000/swagger/ui
```

### CI/CD Pipeline

```powershell
# Triggered automatically on commit
# 1. Build and test (CI system)
dotnet restore
dotnet build --configuration Release
dotnet test --configuration Release

# 2. Configure environment (before deploy)
.\scripts\configure-env.ps1 -Environment Production

# 3. Apply migrations
.\scripts\apply-migrations-ci.ps1 -Environment Production

# 4. Deploy application (CI system specific)
```

### Manual Production Deployment

```powershell
# 1. Build Release
dotnet build --configuration Release

# 2. Configure for production
.\scripts\configure-env.ps1 -Environment Production

# 3. Check migrations (dry run)
.\scripts\apply-migrations-ci.ps1 -Environment Production -DryRun

# 4. Apply migrations
.\scripts\apply-migrations-ci.ps1 -Environment Production

# 5. Publish
dotnet publish --configuration Release --output ./publish

# 6. Deploy to hosting
# Use Azure CLI, GitHub Actions, or your deployment tool
```

---

## ⚠️ Important Notes

### Security
- ❌ **NEVER** commit connection strings to repository
- ❌ **NEVER** commit API keys or secrets
- ✅ Use environment variables or secrets management
- ✅ Use `.env` files locally (add to `.gitignore`)

### Best Practices
1. **Always dry-run first**: Use `-DryRun` flag before applying migrations
2. **Test locally**: Run full setup locally before deploying
3. **Review changes**: Check what configuration will change
4. **Backup first**: Backup production database before migrations
5. **Document deployments**: Log all manual deployments

### Troubleshooting

#### "NuGet restore failed"
```powershell
# Clear cache and retry
dotnet nuget locals all --clear
dotnet restore --force
```

#### "Database connection timeout"
- Verify connection string in `appsettings.Development.json`
- Check PostgreSQL is running
- Test connection: `psql "connection string"`

#### "Permission denied" on .sh file
```bash
chmod +x scripts/*.sh
```

#### "Migration failed: Already exists"
- Don't delete applied migrations
- Use: `dotnet ef database update <migration-name>`
- Check for naming conflicts

#### "Scripts not found"
```powershell
# If running from backend folder, use:
../scripts/setup-dev.ps1

# Or from root:
./scripts/setup-dev.ps1
```

---

## 📞 Support

For issues or questions:
1. Check script output for error details
2. Review `backend/README.md` for backend setup
3. Review `CI-CD-PIPELINE.md` in backend folder
4. Check configuration files for typos
5. Verify all prerequisites are installed

---

## 📝 Documentation References

- **Backend Setup**: See `backend/README.md`
- **Deployment Guide**: See `backend/DEPLOYMENT.md`
- **Security Validation**: See `backend/SECURITY_VALIDATION.md`
- **CI/CD Pipeline**: See `backend/CI-CD-PIPELINE.md`

---

**Last Updated**: June 22, 2025  
**Location**: `/scripts/`  
**Canonical Scripts**: Use scripts in root `/scripts/` folder (backend/scripts/ are legacy references)
