# Local Development Setup

## Prerequisites

- .NET SDK 8.0+
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
dotnet restore
```

**Frontend:**
```bash
cd frontend
pnpm install
```

**Tests:**
```bash
pip install -r frontend/tests/e2e/requirements-test.txt
playwright install chromium
```

### 3. Environment Configuration

**Backend:**
```bash
cd backend/GetMumm.Api
cp appsettings.Development.json.example appsettings.Development.json
# Edit appsettings.Development.json with your settings
```

**Example appsettings.Development.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=get_mumm;Username=postgres;Password=password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### 4. Database Setup

**Option A: Local PostgreSQL**
```bash
createdb get_mumm
cd backend
dotnet ef database update --project GetMumm.Api
# Seed initial data (if seeding project exists)
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
cd backend/GetMumm.Api
dotnet run
# Server runs on http://localhost:5000 (or port specified in launchSettings.json)
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
# App runs on http://localhost:5173
```

### Build for Production

**Backend:**
```bash
cd backend
dotnet build --configuration Release
dotnet publish --configuration Release --output ./publish
```

**Frontend:**
```bash
cd frontend
pnpm build
# Output in dist/
```

## Testing

See [Testing Guide](./TESTING.md) for running tests.

## Troubleshooting

**Port already in use:**
```bash
# Find process on port 5000 (default ASP.NET Core)
lsof -i :5000
# Kill it
kill -9 <PID>
```

**Database connection error:**
```bash
# Check PostgreSQL is running
psql -U postgres -d get_mumm -c "SELECT 1"
```

**.NET dependencies issues:**
```bash
rm -rf backend/bin backend/obj
cd backend
dotnet restore
```

See [Troubleshooting](./TROUBLESHOOTING.md) for more help.
