# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Get Mumm ASP.NET Core backend.

## Overview

The CI/CD pipeline consists of the following stages:

1. **Build** - Compile the .NET solution and run tests
2. **Deploy** - Apply database migrations and deploy to target environment
3. **Verify** - Health check and smoke tests

## Pipeline Stages

### Stage 1: Build

**Trigger**: On push to any branch

**Steps**:
1. Restore NuGet packages
```bash
dotnet restore
```

2. Build solution (Release configuration)
```bash
dotnet build --configuration Release --no-restore
```

3. Run unit tests
```bash
dotnet test --configuration Release --no-build --verbosity minimal --logger "console;verbosity=minimal"
```

4. Build Docker image (if applicable)
```bash
docker build -t get-mumm-backend:latest -f Dockerfile .
```

**Success Criteria**:
- All tests pass (exit code 0)
- Build succeeds with no critical warnings
- Docker image builds successfully

### Stage 2: Deploy

**Trigger**: Automatically after successful build on main branch

**Steps**:

1. Configure environment
```powershell
.\scripts\configure-env.ps1 -Environment Production -ConfigSource EnvVars
```

2. Apply database migrations
```powershell
.\scripts\apply-migrations-ci.ps1 -Environment Production
```

3. Deploy to target environment
   - **Development**: Deploy to dev.get-mumm.azurewebsites.net
   - **Staging**: Deploy to staging.get-mumm.azurewebsites.net
   - **Production**: Deploy to api.get-mumm.com

**Environment Variables** (must be set in CI/CD):
```
DB_CONNECTION_STRING       = PostgreSQL connection string
SUPABASE_URL              = Supabase project URL
SUPABASE_KEY              = Supabase API key
CORS_ORIGINS              = Comma-separated allowed origins
LOG_LEVEL                 = Logging level (Information, Warning, Error)
ASPNETCORE_ENVIRONMENT    = Target environment
```

### Stage 3: Verify

**Trigger**: After deployment

**Steps**:

1. Health check
```bash
curl -f https://api.get-mumm.com/api/health || exit 1
```

2. Smoke tests
```bash
dotnet test --configuration Release --filter "Category=SmokeTest" --verbosity minimal
```

**Success Criteria**:
- Health endpoint returns 200 OK with status "Healthy"
- All smoke tests pass
- Database is accessible and responsive

---

## Local Deployment Simulation

To simulate the CI/CD pipeline locally:

### 1. Setup Development Environment
```powershell
.\scripts\setup-local-dev.ps1
```

### 2. Configure Environment
```powershell
.\scripts\configure-env.ps1 -Environment Development
```

### 3. Apply Migrations (DRY RUN)
```powershell
.\scripts\apply-migrations-ci.ps1 -Environment Development -DryRun
```

### 4. Apply Migrations (ACTUAL)
```powershell
.\scripts\apply-migrations-ci.ps1 -Environment Development
```

### 5. Build & Test
```powershell
dotnet build --configuration Release
dotnet test --configuration Release --no-build
```

---

## Rollback Procedures

### Database Rollback

If migrations fail or need to be rolled back:

```powershell
# List migrations
dotnet ef migrations list --project GetMumm.Api

# Rollback to previous migration
dotnet ef database update <previous-migration-name> --project GetMumm.Api

# Remove last migration (if not yet applied to DB)
dotnet ef migrations remove --project GetMumm.Api
```

### Application Rollback

To rollback to previous application version:

```powershell
# Azure Web App deployment slots
az webapp deployment slot swap --resource-group get-mumm-rg --name get-mumm-api --slot staging

# Or redeploy previous image
docker pull get-mumm-backend:previous
docker tag get-mumm-backend:previous get-mumm-backend:latest
```

---

## Error Handling

### Build Failures

**Symptoms**:
- Compilation errors
- Test failures
- NuGet restore issues

**Resolution**:
1. Review build logs for error details
2. Fix code issues locally
3. Run `dotnet build` and `dotnet test` locally to verify fix
4. Push to repository to re-trigger pipeline

### Migration Failures

**Symptoms**:
- "The database already contains a migration named..."
- Connection timeout to database
- Schema mismatch errors

**Resolution**:
1. Verify database connection string in `configure-env.ps1`
2. Check database permissions and accessibility
3. For schema mismatches, run migrations in correct order
4. See Database Rollback section above

### Deployment Failures

**Symptoms**:
- Authentication errors
- Insufficient permissions
- Resource already exists

**Resolution**:
1. Verify environment credentials and permissions
2. Check target environment health
3. Review deployment logs for specific errors
4. Execute rollback if necessary

---

## Configuration Management

### Environment-Specific Settings

Settings are loaded in the following order (highest priority first):

1. Environment variables (CI/CD system environment)
2. appsettings.{Environment}.json (Development/Staging/Production)
3. appsettings.json (default fallback)

**Example**: In Production, set these environment variables:
```
ASPNETCORE_ENVIRONMENT=Production
DB_CONNECTION_STRING=Host=prod-server;Database=getmumm;...
SUPABASE_URL=https://prod.supabase.co
SUPABASE_KEY=sb_prod_...
```

### Secrets Management

**For Azure DevOps**:
- Store secrets in Azure Key Vault
- Link Key Vault to pipeline
- Reference in pipeline YAML: `$(SecretVariableName)`

**For GitHub Actions**:
- Store secrets in GitHub Secrets
- Reference in workflow: `${{ secrets.SECRET_NAME }}`

**Best Practices**:
- Never commit secrets to repository
- Rotate secrets regularly
- Use managed identities when possible
- Audit secret access

---

## Monitoring & Alerts

### Pipeline Notifications

**On Build Failure**:
1. Email notification sent to team
2. Slack message posted to #deployments channel
3. GitHub status check marked as failed

**On Deployment Success**:
1. Slack notification with deployment details
2. Link to release notes
3. Performance metrics summary

### Application Monitoring

**Health Checks**:
- GET `/api/health` - Overall health status
- Database connectivity check
- External service status (Supabase)

**Logging**:
- Serilog sends logs to Application Insights
- Alert on ERROR level logs
- Performance dashboard available

---

## Manual Deployment

If automated pipeline fails, manual deployment can be performed:

```powershell
# 1. Build locally
cd backend
dotnet build --configuration Release

# 2. Apply migrations
$env:ASPNETCORE_ENVIRONMENT = "Production"
dotnet ef database update --project GetMumm.Api

# 3. Publish
dotnet publish --configuration Release --output ./publish

# 4. Deploy to Azure App Service
cd publish
az webapp deployment source config-zip --resource-group get-mumm-rg --name get-mumm-api --src-path ./app.zip

# 5. Verify deployment
curl https://api.get-mumm.com/api/health
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Secrets rotated if needed
- [ ] Rollback plan documented
- [ ] Team notified of deployment window
- [ ] Health check configured
- [ ] Monitoring alerts enabled
- [ ] Post-deployment tests defined

---

## Support & Troubleshooting

### Common Issues

1. **"Connection timeout" during migrations**
   - Check database connection string
   - Verify database server is accessible
   - Check firewall rules

2. **"IIS Application Pool stopped" after deployment**
   - Check app configuration
   - Review error logs in Application Insights
   - Restart app service

3. **"Migration already exists" error**
   - Don't remove applied migrations
   - Use `dotnet ef database update <target>`
   - Check migration naming for conflicts

### Getting Help

- Review Application Insights logs
- Check Event Viewer on deployed server
- Run health endpoint: `/api/health`
- Review Swagger documentation: `/swagger/ui`

---

**Last Updated**: 2025-06-22
**Maintained By**: DevOps Team
