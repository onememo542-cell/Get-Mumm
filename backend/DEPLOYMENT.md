# Deployment Guide

## Overview

This guide outlines the deployment process for the GetMumm ASP.NET Core backend API. The deployment workflow includes database migrations, environment configuration, and application startup procedures.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Migration Process](#database-migration-process)
4. [Environment Configuration](#environment-configuration)
5. [Production Deployment](#production-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **.NET 8.0 SDK** or later
  - Download: https://dotnet.microsoft.com/download
  - Verify: `dotnet --version`

- **EF Core CLI Tools**
  ```powershell
  dotnet tool install --global dotnet-ef
  ```
  - Verify: `dotnet ef --version`

- **PostgreSQL Database** (or running on Supabase)
  - Version 12 or later
  - Network access to database host
  - Valid connection credentials

- **Git** for version control
  - Download: https://git-scm.com/

---

## Local Development Setup

### Quick Start (Automated)

Run the setup script to configure your local environment:

```powershell
cd Get-Mumm
.\scripts\setup-dev.ps1
```

This script will:
1. Verify .NET SDK installation
2. Install EF Core CLI tools (if needed)
3. Restore NuGet packages
4. Apply database migrations
5. Build the project

### Manual Setup

If you prefer manual setup:

#### 1. Restore NuGet Packages

```powershell
cd backend/GetMumm.Api
dotnet restore
```

#### 2. Apply Database Migrations

```powershell
dotnet ef database update
```

#### 3. Build the Project

```powershell
dotnet build --configuration Debug
```

#### 4. Run the Application

```powershell
dotnet run
```

The API will be available at: `http://localhost:5000`

Swagger documentation: `http://localhost:5000/swagger`

---

## Database Migration Process

### Understanding Migrations

Migrations are version-controlled snapshots of the database schema. They track changes to entities and update the database accordingly.

**Current Migrations:**
- `InitialCreate` - Base schema with all tables and relationships
- `AddContactStatus` - Add ContactStatus enum for Contact entity

### Creating a New Migration

When you modify entities (add properties, create new entities, etc.), create a migration:

```powershell
cd backend/GetMumm.Api
dotnet ef migrations add <MigrationName>
```

**Example:**
```powershell
dotnet ef migrations add AddMenuItemRating
```

This creates a new migration file in `Infrastructure/Migrations/` folder.

### Applying Migrations

#### Development

```powershell
cd backend/GetMumm.Api
dotnet ef database update
```

#### Production (Automated Script)

```powershell
.\scripts\apply-migrations.ps1 -Environment Production
```

#### Production (Manual)

```powershell
set ASPNETCORE_ENVIRONMENT=Production
dotnet ef database update --project .\backend\GetMumm.Api
```

**Important:** Always backup your database before applying migrations to production!

### Rollback Migrations

To revert to a previous migration:

```powershell
cd backend/GetMumm.Api
dotnet ef database update <PreviousMigrationName>
```

**Example (rollback to InitialCreate):**
```powershell
dotnet ef database update InitialCreate
```

### Generate SQL Script

To review the SQL before applying:

```powershell
cd backend/GetMumm.Api
dotnet ef migrations script --idempotent --output migration.sql
```

---

## Environment Configuration

### Configuration Hierarchy

The application loads configuration in this order (later overrides earlier):
1. `appsettings.json` (base configuration)
2. `appsettings.{Environment}.json` (environment-specific)
3. Environment variables
4. User secrets (development only)

### Configuration Sections

#### Connection Strings

**appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=getmumm;Username=postgres;Password=your_password;SSL Mode=Require"
  }
}
```

**Environment Variable:**
```powershell
$env:ConnectionStrings__DefaultConnection = "Host=db.example.com;Port=5432;Database=getmumm;Username=user;Password=pass"
```

#### Supabase Configuration

**appsettings.json:**
```json
{
  "Supabase": {
    "Url": "https://your-project.supabase.co",
    "Key": "your_public_key",
    "ServiceRoleKey": "your_service_role_key"
  }
}
```

**Environment Variables:**
```powershell
$env:Supabase__Url = "https://your-project.supabase.co"
$env:Supabase__Key = "your_public_key"
$env:Supabase__ServiceRoleKey = "your_service_role_key"
```

#### CORS Configuration

**appsettings.json:**
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://get-mumm.netlify.app"
    ]
  }
}
```

**Environment Variable (comma-separated):**
```powershell
$env:CORS_ALLOWED_ORIGINS = "http://localhost:3000,https://get-mumm.netlify.app"
```

### Using the Configuration Script

Automatically set all environment variables:

```powershell
.\scripts\set-appsettings.ps1 -Environment Production -ConfigPath .\backend\GetMumm.Api\appsettings.Production.json
```

**Supported Environment Variables:**
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ALLOWED_ORIGINS` (comma-separated)
- `LOG_LEVEL` (Information, Warning, Error)

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Code review completed
- [ ] All tests passing (run `dotnet test`)
- [ ] Release build successful (run `dotnet build -c Release`)
- [ ] Secrets are NOT in configuration files
- [ ] Environment variables are set in deployment platform
- [ ] Database backup created
- [ ] Rollback plan documented

### Database Backup

Before deploying to production:

```sql
-- Using PostgreSQL
pg_dump -U username -h hostname database_name > backup_$(date +%Y%m%d_%H%M%S).sql

-- Or use Supabase dashboard backup feature
```

### Build for Release

```powershell
cd backend/GetMumm.Api
dotnet publish -c Release -o ..\bin\Release\publish
```

### Apply Migrations

```powershell
.\scripts\apply-migrations.ps1 -Environment Production
```

### Start Application

**Using dotnet:**
```powershell
cd backend\bin\Release\publish
dotnet GetMumm.Api.dll
```

**Using Docker:**
```bash
docker run -d \
  --name getmumm-api \
  -p 5000:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="your_connection_string" \
  -e Supabase__Url="your_supabase_url" \
  -e Supabase__Key="your_supabase_key" \
  getmumm-api:latest
```

### Health Check

Verify the API is healthy:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Healthy"
}
```

---

## CI/CD Pipeline

### GitHub Actions Pipeline

The `.github/workflows/deploy.yml` workflow handles automated deployment:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0'
      
      - name: Restore packages
        run: dotnet restore
      
      - name: Build
        run: dotnet build --configuration Release
      
      - name: Run tests
        run: dotnet test --configuration Release
      
      - name: Apply migrations
        run: ./scripts/apply-migrations.ps1 -Environment Production
      
      - name: Publish
        run: dotnet publish -c Release -o publish
      
      - name: Deploy to hosting
        run: ./scripts/deploy-to-hosting.ps1
```

### Pipeline Stages

1. **Build Stage**
   - Restore NuGet packages
   - Compile C# code
   - Generate DLL assemblies

2. **Test Stage**
   - Run unit tests
   - Run integration tests
   - Report coverage

3. **Database Stage**
   - Apply pending migrations
   - Verify schema consistency

4. **Deployment Stage**
   - Publish release binaries
   - Deploy to hosting platform
   - Warm up application

### Environment Variables for CI/CD

Set these in your CI/CD platform (GitHub Secrets, GitLab CI/CD variables, etc.):

```
DB_HOST=production-db.example.com
DB_PORT=5432
DB_USER=api_user
DB_PASSWORD=***
DB_NAME=getmumm_prod
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***
CORS_ALLOWED_ORIGINS=https://get-mumm.netlify.app
LOG_LEVEL=Warning
```

---

## Rollback Procedures

### Immediate Rollback (If Deployment Fails)

1. Verify health check endpoint: `GET /api/health`
2. Check logs: `backend/GetMumm.Api/logs/app-*.txt`
3. If unhealthy, restart application using previous release

### Database Rollback

If migration caused issues:

```powershell
# Revert to previous migration
cd backend/GetMumm.Api
dotnet ef database update <PreviousMigrationName>

# Example: Revert to InitialCreate
dotnet ef database update InitialCreate
```

### Full Rollback Plan

1. **Application Rollback**
   ```powershell
   # Deploy previous release binary
   git checkout previous-tag
   dotnet publish -c Release
   ```

2. **Database Rollback**
   ```powershell
   # If migrations need reverting
   dotnet ef database update PreviousMigration
   
   # If using backup
   psql -U username -h hostname < backup_restore.sql
   ```

3. **Verification**
   ```powershell
   # Test API health
   Invoke-RestMethod http://localhost:5000/api/health
   
   # Run smoke tests
   dotnet test --filter "Category=Smoke"
   ```

---

## Troubleshooting

### Database Connection Errors

**Error:** `Unable to connect to database`

**Solutions:**
1. Verify connection string in appsettings
2. Check database is running: `ping database-host`
3. Verify firewall allows port 5432
4. Test connection manually:
   ```powershell
   psql -h host -U username -d database_name
   ```

### Migration Errors

**Error:** `The EntitySet 'Categories' does not contain a definition for property`

**Solutions:**
1. Verify entity classes match DbSet definitions in DbContext
2. Regenerate migrations: `dotnet ef migrations add Fix...`
3. Check for spelling mismatches in property names

### Out of Memory During Build

```powershell
# Reduce parallel builds
dotnet build --no-parallel
```

### Port Already in Use

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <process_id> /F

# Or use different port
set ASPNETCORE_URLS=http://localhost:5001
```

### Secrets Exposure Prevention

**Never commit secrets!** Use environment variables instead:

```powershell
# Don't do this:
# ConnectionString = "Host=localhost;Password=secret123"

# Do this instead:
# ConnectionString from environment variable
```

---

## Support

For issues during deployment:

1. Check application logs: `backend/GetMumm.Api/logs/`
2. Review error response: `GET /api/health`
3. Check database schema: `\dt` in psql
4. Verify migrations applied: `dotnet ef migrations list`

---

## Related Documentation

- [Database Schema](./DATABASE.md)
- [API Documentation](./GetMumm.Api/README.md)
- [Architecture Guide](../../.kiro/specs/asp-net-backend-migration/design.md)
- [.NET Deployment Guide](https://learn.microsoft.com/en-us/dotnet/core/deploying/)

