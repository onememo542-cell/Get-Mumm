# Complete GitHub Secrets Configuration Guide

## 🔴 SECURITY ALERT

**Your appsettings.json files contain hardcoded secrets!**

These files should NOT be committed to Git with real credentials:
- ❌ `backend/GetMumm.Api/appsettings.json` - Contains database password & Supabase keys
- ❌ `backend/GetMumm.Api/appsettings.Production.json` - Contains database password & Supabase keys
- ❌ `backend/GetMumm.Api/appsettings.Development.json` - Contains database password & Supabase keys

## Required GitHub Secrets (Complete List)

### Category 1: Frontend Deployment (Netlify)

#### 1. `NETLIFY_AUTH_TOKEN`
- **Purpose:** Authenticate with Netlify to deploy frontend
- **How to get:**
  1. Go to https://app.netlify.com/user/applications/personal-access-tokens
  2. Click "Create new token"
  3. Save the generated token
- **Example value:** `nf_xxxxxxxxxxxxx`
- **Security:** Keep this secret, do not share

#### 2. `NETLIFY_SITE_ID`
- **Purpose:** Identify which Netlify site to deploy to
- **How to get:**
  1. Go to your Netlify site
  2. Site settings → General → Site information
  3. Copy the "Site ID"
- **Example value:** `abcdef123456-xyz`
- **Security:** Can be public (non-sensitive)

### Category 2: Backend Deployment (MonsterASP FTP)

#### 3. `FTP_SERVER`
- **Purpose:** FTP server address for MonsterASP
- **How to get:**
  1. Log into MonsterASP control panel
  2. Find FTP account details or "Hosting" section
  3. Copy FTP server address
- **Example value:** `ftp.monsterasp.com` or `192.168.1.100`
- **Security:** Keep this secret (leaking reveals your host)

#### 4. `FTP_USERNAME`
- **Purpose:** FTP username to authenticate
- **How to get:**
  1. MonsterASP control panel → FTP accounts
  2. Copy the username
- **Example value:** `user@yourdomain.com`
- **Security:** Keep this secret

#### 5. `FTP_PASSWORD`
- **Purpose:** FTP password to authenticate
- **How to get:**
  1. MonsterASP control panel → FTP accounts
  2. Copy or reset the password
- **Example value:** `SecurePassword123!`
- **Security:** 🔴 CRITICAL - Keep this extremely secret

---

## Optional GitHub Secrets (For Future Use)

These are NOT currently used but recommended for production:

### 6. `SUPABASE_URL` (Optional - not needed for deployment)
- Database connection string
- Currently hardcoded in appsettings (⚠️ should be moved to secret)

### 7. `SUPABASE_KEY` (Optional - not needed for deployment)
- Supabase public API key
- Currently hardcoded in appsettings (⚠️ should be moved to secret)

### 8. `SUPABASE_SERVICE_ROLE_KEY` (Optional - not needed for deployment)
- Supabase service role key (high privilege)
- Currently hardcoded in appsettings (🔴 CRITICAL - should be secret)

---

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** (green button)
5. Enter the secret name (e.g., `NETLIFY_AUTH_TOKEN`)
6. Paste the value
7. Click **Add secret**

### Adding All Secrets (Checklist)

```
☐ NETLIFY_AUTH_TOKEN        (from Netlify)
☐ NETLIFY_SITE_ID           (from Netlify)
☐ FTP_SERVER                (from MonsterASP)
☐ FTP_USERNAME              (from MonsterASP)
☐ FTP_PASSWORD              (from MonsterASP - KEEP SECRET!)
```

---

## Workflow Usage (How Secrets Are Used)

### In `deploy.yml`

**Frontend Deployment:**
```yaml
env:
  NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
  NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Backend Deployment (FTP):**
```yaml
with:
  server: ${{ secrets.FTP_SERVER }}
  username: ${{ secrets.FTP_USERNAME }}
  password: ${{ secrets.FTP_PASSWORD }}
```

---

## ⚠️ Security Best Practices

### DO:
- ✅ Use strong, unique passwords for FTP
- ✅ Rotate credentials regularly (every 90 days recommended)
- ✅ Use GitHub encrypted secrets (they're stored encrypted)
- ✅ Limit who has repository access
- ✅ Enable branch protection rules
- ✅ Audit workflow runs regularly

### DON'T:
- ❌ Commit secrets to Git (use .gitignore)
- ❌ Copy/paste secrets in issues or PRs
- ❌ Share FTP credentials via email or chat
- ❌ Use generic passwords (e.g., "password123")
- ❌ Hardcode secrets in code
- ❌ Log secrets in workflow outputs

---

## 🔴 IMMEDIATE ACTION REQUIRED

### Step 1: Secure Hardcoded Secrets

Your appsettings files contain secrets that should be removed:

1. **Remove from appsettings.json files:**
   - Database passwords
   - Supabase API keys
   - Supabase service role keys

2. **Move to environment variables instead:**
   - MonsterASP will read these from environment or web.config
   - ASP.NET Core reads environment variables automatically

3. **Example of safe appsettings.Production.json:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": ""  // Empty - read from environment
     },
     "Supabase": {
       "Url": "",     // Empty - read from environment
       "Key": "",     // Empty - read from environment
       "ServiceRoleKey": ""  // Empty - read from environment
     }
   }
   ```

### Step 2: Configure Environment Variables in MonsterASP

After deploying, set these in MonsterASP control panel:

1. Database connection string
2. Supabase URL
3. Supabase public key
4. Supabase service role key
5. CORS allowed origins
6. Logging level

---

## Deployment Flow with Secrets

```
1. Push to main/production branch
   ↓
2. GitHub Actions reads workflow file (deploy.yml)
   ↓
3. Build backend & frontend
   ↓
4. Frontend deployment:
   - Reads NETLIFY_AUTH_TOKEN from secrets
   - Reads NETLIFY_SITE_ID from secrets
   - Deploys to Netlify CDN
   ↓
5. Backend deployment:
   - Reads FTP_SERVER from secrets
   - Reads FTP_USERNAME from secrets
   - Reads FTP_PASSWORD from secrets
   - Deploys via FTP to MonsterASP /site/wwwroot/
   ↓
6. MonsterASP reads environment variables:
   - Supabase configuration
   - Database connection
   - CORS settings
```

---

## Troubleshooting

### "Input required and not supplied: server"
**Cause:** `FTP_SERVER` secret not configured  
**Fix:** Add `FTP_SERVER` to GitHub secrets

### "530 Login incorrect"
**Cause:** Wrong `FTP_USERNAME` or `FTP_PASSWORD`  
**Fix:** Verify credentials in MonsterASP control panel

### "Connection refused"
**Cause:** `FTP_SERVER` address is wrong or FTP service offline  
**Fix:** Verify FTP server address in MonsterASP

### "Netlify deployment fails"
**Cause:** Invalid `NETLIFY_AUTH_TOKEN` or `NETLIFY_SITE_ID`  
**Fix:** Regenerate tokens from Netlify dashboard

---

## Testing Secrets Configuration

After adding secrets, test the workflow:

1. Make a small commit to `main` branch:
   ```bash
   git commit --allow-empty -m "Test CI/CD workflow"
   git push origin main
   ```

2. Go to repository → **Actions** tab

3. Check workflow execution:
   - ✅ Build job should complete
   - ✅ Frontend deployment to Netlify
   - ✅ Backend deployment to MonsterASP via FTP

4. Verify:
   - Frontend: Check Netlify dashboard for new deployment
   - Backend: Connect to MonsterASP FTP to verify files uploaded

---

## Reference: Current Secrets Usage

| Secret | Workflow | Used By | Step |
|--------|----------|---------|------|
| `NETLIFY_AUTH_TOKEN` | deploy.yml | Netlify action | deploy-frontend |
| `NETLIFY_SITE_ID` | deploy.yml | Netlify action | deploy-frontend |
| `FTP_SERVER` | deploy.yml | FTP action | deploy-backend |
| `FTP_USERNAME` | deploy.yml | FTP action | deploy-backend |
| `FTP_PASSWORD` | deploy.yml | FTP action | deploy-backend |
| `GITHUB_TOKEN` | deploy.yml | GitHub (auto) | deploy-frontend |

---

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Netlify Tokens](https://app.netlify.com/user/applications/personal-access-tokens)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
- [ASP.NET Core Configuration](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)
