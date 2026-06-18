# Deployment Guide

## Overview

- **Frontend:** Deployed to Netlify
- **Backend:** Deployed to Vercel
- **Database:** PostgreSQL (managed service)
- **CI/CD:** GitHub Actions

## Frontend Deployment (Netlify)

### Setup

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Node version: 18 (see `.nvmrc`)

### Environment Variables

Set in Netlify dashboard → Site settings → Build & deploy → Environment:
```
VITE_API_URL=https://api.yourdomain.com
```

### Deploy

**Automatic:**
- Push to `main` → Auto-deploys to production
- Push to other branches → Preview deploys

**Manual:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Netlify
```

### Configuration

See `netlify.toml` for build settings.

## Backend Deployment (Vercel)

### Setup

1. Connect GitHub repository to Vercel
2. Configure project settings:
   - Framework: Node.js
   - Build command: `npm run build`
   - Output directory: `backend/dist`
   - Root directory: `backend`

### Environment Variables

Set in Vercel dashboard → Settings → Environment Variables:
```
DATABASE_URL=postgresql://user:pass@host/db
NODE_ENV=production
PORT=3001
```

### Deploy

**Automatic:**
- Push to `main` → Auto-deploys to production
- Push to `develop` → Auto-deploys to staging

**Manual:**
```bash
cd backend
npm run build
vercel deploy
```

### Configuration

See `backend/vercel.json` for settings.

### Serverless Functions

Backend runs as serverless functions via `api/index.mjs`.

## Database Setup (Production)

### PostgreSQL Service

Use managed PostgreSQL (e.g., AWS RDS, Heroku Postgres):

1. Create PostgreSQL database
2. Note connection string:
   ```
   postgresql://username:password@host:5432/database
   ```

### Migrations

Run migrations on deployment:

```bash
cd backend
DATABASE_URL=<connection_string> npm run migrate
npm run seed  # Optional: seed initial data
```

### Backups

- Configure automatic daily backups
- Keep 30-day retention policy
- Test restore procedures regularly

## CI/CD Pipeline

### GitHub Actions

Workflow: `.github/workflows/e2e-tests.yml`

**Triggers:**
- Push to `main` or `develop`
- Pull requests
- Manual trigger

**Steps:**
1. Setup Python 3.11 + Node 18
2. Install dependencies
3. Run E2E tests (244+ tests)
4. Generate test reports
5. Comment PR with results

**Artifacts Retained:**
- Test results: 30 days
- Allure reports: 30 days
- Screenshots: 7 days

### Test Status

- All tests must pass before merge
- See Actions tab for results

## Monitoring

### Frontend (Netlify)
- Netlify Analytics
- Error tracking
- Performance monitoring

### Backend (Vercel)
- Vercel Analytics
- Function logs
- Error monitoring

### Database
- Connection health
- Query performance
- Backup verification

## Scaling

### Frontend
- Static site on CDN
- Automatic scaling built-in

### Backend
- Serverless auto-scales with demand
- Increase function timeout if needed
- Monitor concurrent executions

### Database
- Upgrade instance size if needed
- Add read replicas for scaling
- Implement connection pooling

## Troubleshooting

### Deployment Failed

**Check logs:**
- Netlify: Deploy tab → View logs
- Vercel: Deployments → View logs

**Common issues:**
- Build command failed
- Environment variables missing
- Database connection error

### Application Not Working

**Check status:**
- Frontend: Netlify status page
- Backend: Vercel status page
- Database: Service provider status

**Debug:**
- Check environment variables
- View application logs
- Test API endpoints manually

### Database Connection Issues

```bash
# Test connection
psql <DATABASE_URL>

# Check migrations ran
SELECT * FROM information_schema.tables;
```

## Rollback

### Frontend (Netlify)
1. Go to Netlify dashboard
2. Find previous deployment
3. Click "Publish deploy"

### Backend (Vercel)
1. Go to Vercel dashboard
2. Find previous deployment
3. Click "Promote to Production"

## Security

### Production Checklist

- [ ] Environment variables set (no hardcoded secrets)
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error tracking enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Dependencies updated

See [Security Policy](../.github/SECURITY.md) for details.

## Performance

### Optimization Tips

**Frontend:**
- Enable Netlify caching
- Use image optimization
- Monitor bundle size

**Backend:**
- Enable request caching
- Database query optimization
- Connection pooling

### Monitor Performance

- Frontend: Netlify Analytics
- Backend: Vercel Analytics
- Database: Provider metrics

See [Architecture](./ARCHITECTURE.md) for performance considerations.
