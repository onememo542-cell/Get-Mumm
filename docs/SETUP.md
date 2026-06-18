# Local Development Setup

## Prerequisites

- Node.js >= 20
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose
- Git

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/Mostafa-SAID7/Get-Mumm.git
cd Get-Mumm
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**Tests:**
```bash
pip install -r tests/requirements-test.txt
playwright install chromium
```

### 3. Environment Configuration

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your settings
```

**Example .env:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/get_mumm
NODE_ENV=development
PORT=3001
```

### 4. Database Setup

**Option A: Local PostgreSQL**
```bash
createdb get_mumm
cd backend
npm run migrate  # Run migrations
npm run seed     # Seed initial data
```

**Option B: Docker PostgreSQL**
```bash
docker run -d \
  --name get-mumm-db \
  -e POSTGRES_DB=get_mumm \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine
```

## Running Locally

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm run start
```

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/
```

## Testing

See [Testing Guide](./TESTING.md) for running tests.

## Troubleshooting

**Port already in use:**
```bash
# Find process on port 3001
lsof -i :3001
# Kill it
kill -9 <PID>
```

**Database connection error:**
```bash
# Check PostgreSQL is running
psql -U postgres -d get_mumm -c "SELECT 1"
```

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

See [Troubleshooting](./TROUBLESHOOTING.md) for more help.
