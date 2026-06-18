# Troubleshooting Guide

## Development

### Port Already in Use

**Problem:** "Address already in use" error

**Solution:**
```bash
# Find process on port
lsof -i :3001        # Backend
lsof -i :5173        # Frontend
lsof -i :5432        # Database

# Kill process
kill -9 <PID>
```

### Node Modules Issues

**Problem:** Module not found, version conflicts

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Environment Variables Not Loading

**Problem:** Variables undefined, `.env` not read

**Solution:**
```bash
# Verify .env file exists
ls -la backend/.env

# Check variables loaded
echo $DATABASE_URL

# Restart service with env
source .env && npm run dev
```

### Database Connection Error

**Problem:** "Cannot connect to database"

**Solution:**
```bash
# Verify PostgreSQL running
pg_isready -h localhost -p 5432

# Check connection string
echo $DATABASE_URL

# Test manually
psql postgresql://user:password@localhost:5432/db

# Restart database
docker restart get-mumm-db
```

### Frontend Won't Load

**Problem:** Blank page, 404 errors

**Solutions:**
1. Check browser console for errors
2. Verify API URL in `.env.local`
3. Check backend is running
4. Clear browser cache: Cmd+Shift+Delete
5. Rebuild frontend:
   ```bash
   cd frontend
   rm -rf dist node_modules
   npm install
   npm run dev
   ```

## Testing

### Tests Won't Run

**Problem:** "Module not found", import errors

**Solution:**
```bash
pip install -r tests/requirements-test.txt
playwright install chromium
```

### Docker Services Won't Start

**Problem:** Port already in use, permission denied

**Solution:**
```bash
# Stop all containers
docker-compose -f tests/docker-compose.test.yml down

# Remove volumes
docker-compose -f tests/docker-compose.test.yml down -v

# Rebuild and start
docker-compose -f tests/docker-compose.test.yml up --build
```

### Test Connection Refused

**Problem:** "Cannot connect to localhost:3001"

**Solution:**
```bash
# Wait for services
./scripts/wait-for-services.sh

# Check services running
docker ps | grep get-mumm

# View logs
docker-compose -f tests/docker-compose.test.yml logs
```

### Playwright Issues

**Problem:** "Browser closed unexpectedly", "element not found"

**Solution:**
```bash
# Reinstall browsers
playwright install chromium --with-deps

# Run with debug output
PWDEBUG=1 pytest tests/ui -v -s

# Increase timeout
pytest --timeout=600 tests/
```

### Test Timeouts

**Problem:** "Timeout waiting for element"

**Solutions:**
1. Increase timeout: `pytest --timeout=600 tests/`
2. Check if element selector is correct
3. Wait for navigation: `await page.wait_for_load_state()`
4. Verify test environment is ready

### Database Transaction Errors

**Problem:** "Transaction failed", "Constraint violation"

**Solution:**
```bash
# Check database is running
docker ps | grep postgres-test

# View database logs
docker logs get-mumm-test-db

# Recreate database
docker-compose -f tests/docker-compose.test.yml down -v
docker-compose -f tests/docker-compose.test.yml up -d postgres-test
```

## Deployment

### Netlify Build Fails

**Check:**
1. Build logs: Netlify → Deploys → View logs
2. Node version: Check `.nvmrc`
3. Build command: `npm run build`
4. Environment variables set?

**Solution:**
```bash
# Test build locally
cd frontend
npm run build

# Check for errors
npm run build 2>&1
```

### Vercel Deployment Fails

**Check:**
1. Build logs: Vercel → Deployments → View logs
2. Root directory set to `backend`
3. Build command: `npm run build`
4. Environment variables set?

**Solution:**
```bash
# Test build locally
cd backend
npm run build

# Check dist/ generated
ls -la dist/
```

### Database Migration Failed

**Problem:** Deployment stuck, database schema invalid

**Solution:**
```bash
# Manually run migrations
DATABASE_URL=<connection_string> npm run migrate

# Check migration status
SELECT * FROM drizzle_schema_migration;

# Rollback if needed
# Restore from backup
```

### API Returns 502 Bad Gateway

**Problem:** Backend not responding

**Solutions:**
1. Check function is deployed
2. Check environment variables
3. Check database connection
4. View function logs in Vercel

## Performance

### Slow Queries

**Problem:** API responds slowly, database timeout

**Solution:**
```sql
-- Check slow queries
EXPLAIN ANALYZE SELECT * FROM menu_items;

-- Add indexes
CREATE INDEX idx_menu_category ON menu_items(category);
```

### High Memory Usage

**Problem:** Tests fail, "Out of memory"

**Solution:**
```bash
# Run tests sequentially
pytest tests/ -n 0

# Run test subset
pytest tests/ui -n 2
```

### Deployment Slow

**Problem:** Takes >10 minutes

**Solutions:**
1. Reduce test parallelization
2. Skip optional tests: `pytest -m "not flaky"`
3. Cache dependencies: npm cache
4. Monitor build logs

## Getting Help

### View Logs

**Development:**
```bash
tail -f tests/test_execution.log
```

**Deployment (Netlify):**
- Netlify → Deploys → Latest → View logs

**Deployment (Vercel):**
- Vercel → Deployments → Latest → View logs

### Check Status

```bash
# Services running
docker ps

# Ports listening
lsof -i :3001

# Database
psql -c "SELECT 1"
```

### Debug Mode

```bash
# Show all output
pytest tests/ui -v -s

# Extra verbose
pytest tests/ui -vv --tb=long

# Debug specific test
pytest tests/ui/test_home_page.py -v -s
```

### Still Stuck?

1. Check [Setup Guide](./SETUP.md)
2. Check [Architecture](./ARCHITECTURE.md)
3. Check [Testing Guide](./TESTING.md)
4. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment (OS, versions)
   - Log output
