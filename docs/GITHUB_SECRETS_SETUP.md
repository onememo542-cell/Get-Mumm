# GitHub Actions Secrets Setup

This guide explains how to configure the required GitHub secrets for CI/CD pipeline deployments.

## Required Secrets

### For Netlify Frontend Deployment

1. **NETLIFY_AUTH_TOKEN**
   - Go to Netlify Dashboard → User Settings → Applications → Personal access tokens
   - Create a new token
   - Copy and paste into GitHub

2. **NETLIFY_SITE_ID**
   - Go to your Netlify site settings
   - Site Information → Site ID
   - Copy and paste into GitHub

### For MonsterASP Backend Deployment (via FTP)

1. **FTP_SERVER**
   - Your MonsterASP FTP server address (e.g., `ftp.yourdomain.com` or IP address)
   - Get this from MonsterASP control panel

2. **FTP_USERNAME**
   - Your MonsterASP FTP username
   - Usually provided in welcome email or control panel

3. **FTP_PASSWORD**
   - Your MonsterASP FTP password
   - Usually provided in welcome email or control panel

## Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## Verifying Secrets

The deploy workflow will check for FTP secrets before attempting deployment:
- If secrets are missing, the workflow will fail with a clear error message
- If secrets are configured, FTP deployment will proceed

## Common Issues

### "Input required and not supplied: server"
**Cause:** FTP_SERVER secret is not configured  
**Solution:** Add FTP_SERVER to GitHub repository secrets

### "Error connecting to FTP server"
**Cause:** Incorrect FTP server address, username, or password  
**Solution:** Verify credentials in MonsterASP control panel

### Node version deprecation warning
**Cause:** Node 20 is deprecated on GitHub Actions  
**Solution:** Already configured in workflow (using Node 24 with backward compatibility flag)

## Testing the Deployment

1. Make a commit to `main` or `production` branch
2. Go to **Actions** tab to see workflow execution
3. Check logs for deployment status
4. Verify frontend deployed to Netlify
5. Verify backend deployed to MonsterASP FTP

## Deployment Paths

- **Frontend:** Built to `frontend/dist/` → Deployed to Netlify
- **Backend:** Published to `backend/publish/` → Deployed to MonsterASP `/site/wwwroot/`

## Rollback Procedure

### Frontend (Netlify)
1. Go to Netlify Dashboard → Deploys
2. Find previous deployment
3. Click "Publish deploy"

### Backend (MonsterASP FTP)
1. Connect to FTP server
2. Backup current `/site/wwwroot/` contents
3. Restore previous version
4. Restart application in MonsterASP control panel
