# Deployment Scripts

This directory contains scripts for local development setup and CI/CD pipeline automation.

## Scripts Overview

### setup-local-dev.ps1 / setup-local-dev.sh
**Purpose**: Complete local development environment setup

**Platforms**: 
- PowerShell (Windows): `setup-local-dev.ps1`
- Bash (Linux/Mac): `setup-local-dev.sh`

**What it does**:
1. Checks .NET SDK installation
2. Restores NuGet packages
3. Builds the solution
4. Applies database migrations
5. (Optional) Seeds test data
6. Runs test suite

**Usage**:
```powershell
# Windows PowerShell
.\setup-local-dev.ps1                    # Full setup
.\setup-local-dev.ps1 -SkipDatabase      # Skip DB setup
.\setup-local-dev.ps1 -SeedTestData      # Seed test data

# Linux/Mac Bash
./setup-local-dev.sh                     # Full setup
./setup-local-dev.sh --skip-database     # Skip DB setup
./setup-local-dev.sh --seed-test-data    # Seed test data
```

**Requirements**:
- .NET 8 SDK
- PostgreSQL (running, connection string in appsettings.Development.json)
- Git (optional)

---

### apply-migrations-ci.ps1
**Purpose**: Apply database migrations in CI/CD pipeline

**Platform**: PowerShell (Windows) or PowerShell Core (cross-platform)

**What it does**:
1. Validates environment settings
2. Checks for pending migrations
3. Applies migrations (or shows what would be applied in dry-run mode)
4. Handles error scenarios

**Usage**:
```powershell
# Apply migrations to Development
.\apply-migrations-ci.ps1 -Environment Development

# Apply migrations to Production
.\apply-migrations-ci.ps1 -Environment Production

# Dry run (show what would happen, no changes)
.\apply-migrations-ci.ps1 -Environment Production -DryRun

# With explicit connection string
.\apply-migrations-ci.ps1 -Environment Production -ConnectionString "Host=prod-server;..."
```

**Environment Variables** (override appsettings):
```
ASPNETCORE_ENVIRONMENT    # Development, Staging, Production
DB_CONNECTION_STRING      # PostgreSQL connection string (optional)
```

**Exit Codes**:
- 0 = Success
- 1 = Error (check output for details)

---

### configure-env.ps1
**Purpose**: Configure environment variables and application settings

**Platform**: PowerShell (Windows) or PowerShell Core (cross-platform)

**What it does**:
1. Loads configuration from environment or file
2. Updates appsettings files with configuration values
3. Validates required settings
4. Sets ASPNETCORE_ENVIRONMENT variable

**Usage**:
```powershell
# Configure from environment variables
.\configure-env.ps1 -Environment Production

# Configure from JSON config file
.\configure-env.ps1 -Environment Staging -ConfigSource ConfigFile -ConfigFile ./config.staging.json

# Dry run to see what would change
.\configure-env.ps1 -Environment Development -DryRun
```

**Environment Variables** (when ConfigSource is EnvVars):
```
DB_CONNECTION_STRING       # PostgreSQL connection string
SUPABASE_URL              # Supabase project URL
SUPABASE_KEY              # Supabase API key
CORS_ORIGINS              # Comma-separated list: origin1,origin2,origin3
LOG_LEVEL                 # Information, Warning, Error
```

**Configuration File Format** (when using ConfigFile):
```json
{
  "ConnectionString": "Host=server;Database=getmumm;...",
  "SupabaseUrl": "https://proj.supabase.co",
  "SupabaseKey": "sb_...",
  "CorsOrigins": "http://localhost:3000,https://example.com",
  "LogLevel": "Information"
}
```

---

## Common Workflows

### Local Development Setup

```powershell
# Initial setup
.\setup-local-dev.ps1

# Make changes, run tests
dotnet test

# Start development server
cd GetMumm.Api
dotnet run

# API available at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger/ui
```

### CI/CD Pipeline Workflow

```powershell
# 1. Build and test (automatic in CI)
dotnet restore
dotnet build --configuration Release
dotnet test --configuration Release --no-build

# 2. Configure environment (before deployment)
.\scripts\configure-env.ps1 -Environment Production

# 3. Apply migrations
.\scripts\apply-migrations-ci.ps1 -Environment Production

# 4. Deploy application (CI/CD system specific)
# Azure DevOps: use deployment task
# GitHub Actions: use deployment action
```

### Manual Production Deployment

```powershell
# 1. Build
dotnet build --configuration Release

# 2. Configure environment
.\scripts\configure-env.ps1 -Environment Production

# 3. Apply migrations (dry run first!)
.\scripts\apply-migrations-ci.ps1 -Environment Production -DryRun

# 4. Apply migrations (actual)
.\scripts\apply-migrations-ci.ps1 -Environment Production

# 5. Publish
dotnet publish --configuration Release --output ./publish

# 6. Deploy to app service
# Use Azure CLI, GitHub Actions, or your deployment tool
```

---

## Troubleshooting

### "NuGet restore failed"
- Check internet connection
- Verify NuGet.org is accessible
- Clear NuGet cache: `dotnet nuget locals all --clear`
- Try: `dotnet restore --force`

### "Database connection timeout"
- Verify connection string in appsettings
- Check database server is running
- Verify firewall allows connection
- Test manually: `psql "connection string"`

### "Migration failed: already exists"
- Don't remove applied migrations
- Use: `dotnet ef database update <migration-name>`
- Check for migration naming conflicts

### "Permission denied" on .sh file
```bash
chmod +x setup-local-dev.sh
chmod +x apply-migrations-ci.ps1
```

### Scripts not found
- Ensure you're running from the `scripts` directory
- Or use full path: `./scripts/setup-local-dev.ps1`

---

## Best Practices

1. **Always do dry-run first**: Use `-DryRun` flag before applying migrations
2. **Test locally first**: Run full setup locally before deploying
3. **Review changes**: Always review what configuration changes will be made
4. **Keep secrets separate**: Never commit connection strings to repository
5. **Version control scripts**: Keep scripts in version control for audit trail
6. **Document deployments**: Log manual deployments in team channel

---

## Support

For issues or questions:
1. Check script output for error messages
2. Review configuration files for typos
3. Verify all prerequisites are installed
4. Check CI-CD-PIPELINE.md for detailed guidance
5. Contact DevOps team with error logs

---

**Last Updated**: 2025-06-22
**Scripts Directory**: `/backend/scripts/`
