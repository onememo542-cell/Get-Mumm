# Database Module - Quick Usage Guide

## Import the Database

```typescript
import { db } from './db';
```

That's it. Everything is initialized automatically.

---

## Query Data

### Select

```typescript
// Get first user
const user = await db.query.users.findFirst();

// Get all users
const users = await db.query.users.findMany();

// With filter
import { eq } from 'drizzle-orm';
const user = await db.query.users.findFirst({
  where: eq(users.id, 1),
});
```

### Insert

```typescript
await db.insert(users).values({
  email: 'user@example.com',
  name: 'John Doe',
});
```

### Update

```typescript
import { eq } from 'drizzle-orm';
await db.update(users)
  .set({ active: true })
  .where(eq(users.id, 1));
```

### Delete

```typescript
import { eq } from 'drizzle-orm';
await db.delete(users).where(eq(users.id, 1));
```

---

## Health & Monitoring

### Basic Health Check

```typescript
import { checkDatabaseHealth } from './monitoring';

const health = await checkDatabaseHealth();
console.log('Database healthy:', health.healthy);
console.log('Response time:', health.responseTime, 'ms');
```

### Health Check Endpoint

```typescript
import { checkDatabaseHealth } from './monitoring';

app.get('/health', async (req, res) => {
  const health = await checkDatabaseHealth();
  
  if (health.healthy) {
    res.json(health);
  } else {
    res.status(503).json(health);
  }
});
```

### Pool Statistics

```typescript
import { getPoolStatsForMonitoring } from './monitoring';

const stats = getPoolStatsForMonitoring();
if (stats) {
  console.log('Active connections:', stats.activeConnections);
  console.log('Total connections:', stats.totalConnections);
  console.log('Waiting requests:', stats.waitingRequests);
}
```

### Check if Pool is Over-Utilized

```typescript
import { isPoolOverUtilized } from './monitoring';

if (isPoolOverUtilized(80)) {
  logger.warn('Pool is at 80%+ capacity!');
}
```

### Get Diagnostics

```typescript
import { getDiagnostics } from './monitoring';

const diag = getDiagnostics();
console.log('Healthy:', diag.poolHealthy);
console.log('Stats:', diag.poolStats);
console.log('Alerts:', diag.alerts);
console.log('Recommendations:', diag.recommendations);
```

---

## Configuration

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Optional (shown with defaults)
NODE_ENV=development
DB_POOL_SIZE=2
DB_CONNECTION_TIMEOUT=3000
DB_IDLE_TIMEOUT=10000
```

### Configuration Object

```typescript
import { databaseConfig } from './db';

console.log('Environment:', databaseConfig.environment);
console.log('Pool size:', databaseConfig.poolSize);
console.log('Connection timeout:', databaseConfig.connectionTimeoutMillis, 'ms');
console.log('Idle timeout:', databaseConfig.idleTimeoutMillis, 'ms');
```

---

## Error Handling

### Configuration Errors

These throw immediately on startup:

```typescript
// These will throw before app starts
// - DATABASE_URL not set
// - DB_POOL_SIZE > 50
// - DB_CONNECTION_TIMEOUT < 100
```

**Solution:** Fix the environment variable and restart.

### Runtime Errors

```typescript
try {
  await db.query.users.findFirst();
} catch (error) {
  if (error instanceof Error) {
    logger.error('Query failed:', error.message);
  }
}
```

---

## Common Patterns

### Query with Error Handling

```typescript
async function getUser(id: number) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    
    return user;
  } catch (error) {
    logger.error({ err: error, userId: id }, 'Failed to get user');
    throw error;
  }
}
```

### Transaction

```typescript
import { db } from './db';

const result = await db.transaction(async (tx) => {
  const user = await tx.insert(users).values({
    email: 'new@example.com',
  }).returning();
  
  await tx.insert(profiles).values({
    userId: user[0].id,
    bio: 'New user',
  });
  
  return user[0];
});
```

### Batch Operations

```typescript
// Insert multiple
await db.insert(users).values([
  { email: 'user1@example.com' },
  { email: 'user2@example.com' },
  { email: 'user3@example.com' },
]);
```

---

## Type Safety

### Typed Queries

```typescript
import type { User } from './schema'; // If schema exports type

async function getUsersReport(): Promise<User[]> {
  return db.query.users.findMany();
}
```

### Configuration Type

```typescript
import type { DatabaseConfig } from './db';

function validateDbConfig(config: DatabaseConfig): boolean {
  return config.poolSize > 0 && config.poolSize <= 50;
}
```

---

## Debugging

### Enable Query Logging

```typescript
// In development, queries are logged by drizzle
// Set LOG_LEVEL=debug to see pool events
// Set NODE_ENV=development to see pretty-printed logs
```

### Check Pool Health in Code

```typescript
import { isPoolHealthy, getPoolStats } from './pool';

if (!isPoolHealthy()) {
  console.warn('Pool is not healthy!');
  console.log(getPoolStats());
}
```

### Get Full Diagnostics

```typescript
import { getDiagnostics } from './monitoring';

const diag = getDiagnostics();
console.log(JSON.stringify(diag, null, 2));
// Shows recommendations for issues
```

---

## Performance Tips

### 1. Reuse the db Instance

```typescript
// ✅ Good - One instance used everywhere
import { db } from './db';
const user1 = await db.query.users.findFirst();
const user2 = await db.query.users.findMany();
```

```typescript
// ❌ Bad - Creating new pool each time (would fail anyway)
const pool = new Pool(config);  // Don't do this
```

### 2. Connection Pooling is Automatic

```typescript
// ✅ Pool reuses connections automatically
await Promise.all([
  db.query.users.findMany(),
  db.query.posts.findMany(),
  db.query.comments.findMany(),
]);
```

### 3. Monitor Connection Usage

```typescript
import { isPoolOverUtilized } from './monitoring';

// Check periodically
setInterval(() => {
  if (isPoolOverUtilized(80)) {
    console.warn('Connections at 80%+');
  }
}, 60000); // Every minute
```

### 4. Use Connection Pooling Features

```typescript
// Timeouts prevent queries from hanging forever
// Connection reuse saves connection setup time
// Idle timeout closes unused connections automatically
```

---

## Testing

### Test Database Connection

```bash
# Verify DATABASE_URL works
psql $DATABASE_URL -c "SELECT 1"
```

### Test in Code

```typescript
import { checkDatabaseHealth } from './db/monitoring';

async function testConnection() {
  const health = await checkDatabaseHealth();
  if (health.healthy) {
    console.log('✅ Database connected');
  } else {
    console.error('❌ Database connection failed:', health.error);
  }
}

testConnection();
```

---

## Troubleshooting

### "Pool not initialized"
- Check DATABASE_URL is set
- Check database server is running
- Check connection string is valid

### "Too many connections"
- Check DB_POOL_SIZE isn't too high
- Look for connection leaks (connections not closed)
- Monitor with `getDiagnostics()`

### "Connection timeout"
- Increase DB_CONNECTION_TIMEOUT
- Check database server is responsive
- Check network connectivity

### "Idle timeout"
- Increase DB_IDLE_TIMEOUT if queries take time
- Or keep connections active with health checks

### "Pool is overutilized"
```typescript
import { isPoolOverUtilized } from './monitoring';

if (isPoolOverUtilized(80)) {
  // Increase DB_POOL_SIZE
  // Or reduce database load
}
```

---

## Full Example

```typescript
import express from 'express';
import { db } from './db';
import { checkDatabaseHealth, getDiagnostics } from './db/monitoring';

const app = express();

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = await checkDatabaseHealth();
  res.status(health.healthy ? 200 : 503).json(health);
});

// Diagnostics endpoint (for debugging)
app.get('/health/diagnostics', async (req, res) => {
  const diag = getDiagnostics();
  res.json(diag);
});

// Query endpoint
app.get('/users', async (req, res) => {
  try {
    const users = await db.query.users.findMany();
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Graceful shutdown is automatic
// Just listen and it handles SIGTERM/SIGINT
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## More Information

- **Configuration:** See `config.ts`
- **Pool Management:** See `pool.ts`
- **Monitoring:** See `monitoring.ts`
- **Error Types:** See `types.ts`
- **Complete Reference:** See `README.md`

