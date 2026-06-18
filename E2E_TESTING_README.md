# E2E Testing Infrastructure - Get-Mumm

Complete end-to-end testing infrastructure combining Docker Compose, Python pytest, Playwright UI automation, and API testing with Allure reporting.

## Quick Start

### Prerequisites

- Python 3.11+ 
- Node.js 20+
- Docker & Docker Compose
- pip

### Installation

```bash
# Install test dependencies
pip install -r requirements-test.txt

# Install Playwright browsers
python -m playwright install chromium
```

### Run Tests Locally

**Windows:**
```bash
.\run-tests-local.bat
```

**Linux/Mac:**
```bash
./run-tests-local.sh
chmod +x run-tests-local.sh
```

## Test Structure

```
tests/
├── api/                      # API tests
│   ├── test_menu_api.py
│   └── test_*.py
├── database/                 # Database integration tests
│   ├── test_data_isolation.py
│   └── test_*.py
├── pages/                    # Page Object classes
│   ├── base_page.py          # Base class with common methods
│   ├── home_page.py
│   ├── menu_page.py
│   ├── chefs_page.py
│   ├── blog_page.py
│   ├── contact_page.py
│   └── subscriptions_page.py
├── ui/                       # UI tests
│   ├── test_home_page.py
│   ├── test_menu_page.py
│   └── test_*.py
├── fixtures/                 # Pytest fixtures
│   ├── api_client.py         # HTTP client fixtures
│   ├── database.py           # DB & seeding fixtures
│   ├── pages.py              # Browser & page fixtures
│   └── __init__.py
├── conftest.py               # Global pytest configuration
└── pytest.ini                # Pytest settings & markers

scripts/
├── wait-for-services.sh      # Service health check utility
└── seed.mjs                  # Database seeding script
```

## Running Tests

### All Tests
```bash
pytest tests/
```

### By Category
```bash
# UI tests only
pytest tests/ -m ui

# API tests only
pytest tests/ -m api

# Database tests only
pytest tests/ -m database

# Smoke tests (quick validation)
pytest tests/ -m smoke
```

### With Filters
```bash
# Run specific test file
pytest tests/ui/test_home_page.py

# Run specific test class
pytest tests/ui/test_home_page.py::TestHomePage

# Run specific test method
pytest tests/ui/test_home_page.py::TestHomePage::test_home_page_loads

# Run tests matching pattern
pytest tests/ -k "menu"
```

### Parallel Execution
```bash
# Run with 4 workers
pytest tests/ -n 4

# Auto-detect optimal worker count
pytest tests/ -n auto
```

### With Options
```bash
# Verbose output
pytest tests/ -v

# Stop on first failure
pytest tests/ -x

# Show print statements
pytest tests/ -s

# Generate Allure report
pytest tests/ --alluredir=allure-results

# Generate JUnit XML
pytest tests/ --junit-xml=test-results/junit.xml
```

## Test Markers

Tests are categorized using pytest markers:

- `@pytest.mark.ui` - UI tests with Playwright
- `@pytest.mark.api` - API endpoint tests
- `@pytest.mark.database` - Database integration tests
- `@pytest.mark.smoke` - Quick smoke tests
- `@pytest.mark.flaky` - Tests that may be unreliable
- `@pytest.mark.asyncio` - Async tests (pytest-asyncio)

## Configuration

### Environment Variables

Set in `.env` file or via export:

```bash
# Application URLs
TEST_APP_URL=http://localhost:3000
TEST_API_URL=http://localhost:3001

# Database
TEST_DB_HOST=localhost
TEST_DB_PORT=5433
TEST_DB_NAME=test_db
TEST_DB_USER=test_user
TEST_DB_PASSWORD=test_password
```

### pytest.ini

Main pytest configuration with:
- Test discovery patterns
- Markers for categorization
- Parallel execution settings
- Allure & JUnit reporting
- Asyncio mode

## Docker Compose Test Environment

The test infrastructure includes Docker Compose configuration for isolated test environments.

### Start Services
```bash
docker-compose -f docker-compose.test.yml up -d
```

### Wait for Services
```bash
./scripts/wait-for-services.sh
```

### Stop Services
```bash
docker-compose -f docker-compose.test.yml down
```

### Clean Up
```bash
docker-compose -f docker-compose.test.yml down -v
```

## Page Objects

### BasePage Class

Base class for all page objects with common methods:

```python
# Navigation
await page.navigate_to("/path")
await page.go_back()
await page.go_forward()
await page.reload_page()

# Element interaction
element = await page.find_element(selector)
await page.click(selector)
await page.fill_text(selector, text)
text = await page.get_text(selector)
await page.select_option(selector, value)

# Wait operations
await page.wait_for_element(selector)
await page.wait_for_navigation()

# Checks
visible = await page.is_visible(selector)
enabled = await page.is_enabled(selector)
url = await page.get_current_url()

# Debugging
path = await page.take_screenshot(name)
```

### Creating New Page Objects

```python
from tests.pages.base_page import BasePage
from playwright.async_api import Page

class MyPage(BasePage):
    # Define selectors
    MY_ELEMENT = "button.my-btn"
    MY_FORM = "form#my-form"
    
    async def assert_page_loaded(self):
        """Verify page loaded - required method."""
        assert await self.wait_for_element(self.MY_FORM)
    
    async def do_something(self):
        """Custom page actions."""
        await self.click(self.MY_ELEMENT)
```

## Fixtures

### Database Fixtures

```python
# Connection pool (session-scoped)
def db_connection_pool(test_env):
    # Reused across all tests
    pass

# Transaction (function-scoped)  
async def db_transaction(db_connection_pool):
    # Automatic rollback after test
    pass

# Seeding
async def seed_menu_items(db_transaction):
    # Pre-seeds menu items
    pass

async def seed_chefs(db_transaction):
    # Pre-seeds chef data
    pass
```

### API Fixtures

```python
# Session (connection pooling)
async def api_session():
    # Reused HTTP session
    pass

# Client
def api_client(api_session, test_env):
    # HTTP client instance
    status, data = await api_client.get("/api/endpoint")
    pass

# Authenticated
def authenticated_api_client(api_client):
    # Client with JWT token
    pass
```

### Playwright Fixtures

```python
async def browser():
    # Session-scoped Chromium browser
    pass

async def page(browser):
    # Function-scoped page with 1280x720 viewport
    pass

async def home_page(page, test_env):
    # HomePage object ready for testing
    pass

async def menu_page(page, test_env):
    # MenuPage object ready for testing
    pass
```

## Writing Tests

### UI Test Example

```python
import pytest

@pytest.mark.ui
@pytest.mark.asyncio
class TestMyFeature:
    
    async def test_feature_loads(self, home_page):
        """Test that feature loads."""
        await home_page.navigate_to("/")
        assert await home_page.is_navigation_visible()
    
    async def test_feature_interaction(self, home_page):
        """Test feature interaction."""
        await home_page.click_menu_link()
        # Verify navigation
        assert "menu" in await home_page.get_current_url()
```

### API Test Example

```python
@pytest.mark.api
@pytest.mark.asyncio
class TestMenuAPI:
    
    async def test_get_menu(self, api_client):
        """Test GET /api/menu endpoint."""
        status, data = await api_client.get("/api/menu")
        
        assert status == 200
        assert "items" in data
        assert len(data["items"]) > 0
```

### Database Test Example

```python
@pytest.mark.database
@pytest.mark.asyncio
class TestDataIsolation:
    
    async def test_seeded_data(self, db_transaction, seed_menu_items):
        """Test that seeded data is accessible."""
        db_transaction.execute("SELECT COUNT(*) FROM menu_items")
        count = db_transaction.fetchone()[0]
        assert count > 0
```

## Reports

### Allure Report

Generate and view Allure report:

```bash
# Generate report
allure generate allure-results/ -o allure-report

# View report
allure serve allure-results/
```

### JUnit XML

Located at `test-results/junit.xml` for CI/CD integration.

### Test Logs

Detailed logs at `test-results/test.log` with timestamps and source info.

## CI/CD Integration

GitHub Actions workflow configured in `.github/workflows/e2e-tests.yml`:

- Triggers on PR, push to main, and manual dispatch
- Runs on Ubuntu with Python 3.11 & Node.js 20
- Executes with 4 parallel workers
- Generates Allure reports
- Posts results to PRs

### Local CI Simulation

```bash
# Run tests as CI would
pytest tests/ \
    --junit-xml=test-results/junit.xml \
    --alluredir=allure-results \
    -n 4 \
    --tb=short
```

## Debugging Failed Tests

### Enable Debug Logging

```bash
pytest tests/ -v -s --log-cli-level=DEBUG
```

### Capture Screenshots

Screenshots automatically saved on failure to `screenshots/` directory.

### Access Test Logs

```bash
tail -f test-results/test.log
```

### Use pdb Debugger

```python
async def test_something(self, page):
    # Break into debugger
    import pdb; pdb.set_trace()
    await page.do_something()
```

### Slow Down Tests

```bash
# Set viewport delay for interactive debugging
export PLAYWRIGHT_DEBUG=1
pytest tests/ui/test_home_page.py -s
```

## Troubleshooting

### Services Not Connecting

1. Check Docker Compose is running:
   ```bash
   docker-compose -f docker-compose.test.yml ps
   ```

2. Verify service health:
   ```bash
   ./scripts/wait-for-services.sh
   ```

3. Check environment variables match `.env`

### Python Version Mismatch

Ensure Python 3.11+:
```bash
python --version
```

### Playwright Browser Missing

Reinstall browsers:
```bash
python -m playwright install chromium
```

### Database Connection Failed

Check credentials in environment variables:
```bash
echo $TEST_DB_HOST $TEST_DB_PORT $TEST_DB_NAME
```

### Tests Timeout

Increase timeout in pytest.ini or via CLI:
```bash
pytest tests/ --timeout=600
```

## Architecture Overview

### Test Infrastructure Stack

```
┌─────────────────────────────────────┐
│   GitHub Actions CI/CD Workflow     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Pytest Test Orchestration         │
│  (markers, fixtures, parallel)      │
└────────────┬────────────────────────┘
             │
     ┌───────┼───────┐
     ▼       ▼       ▼
┌─────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│  UI Tests       │ │  API Tests      │ │  Database Tests  │
│ (Playwright)    │ │  (aiohttp)      │ │  (psycopg2)      │
└────────┬────────┘ └────────┬────────┘ └────────┬─────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│ Frontend        │ │  Backend API    │ │  Database        │
│ (Vite/React)    │ │  (Express)      │ │  (PostgreSQL)    │
└─────────────────┘ └─────────────────┘ └──────────────────┘
     (Docker)           (Docker)            (Docker)
```

### Data Flow

```
Test Session Start
  ├─ Load Environment Config
  ├─ Initialize Connection Pools
  │  ├─ Database Pool (session-scoped)
  │  └─ API Session (session-scoped)
  │
  └─ For Each Test:
     ├─ Create Function-Scoped Fixtures
     │  ├─ Database Transaction (auto-rollback)
     │  ├─ Browser Page (1280x720)
     │  └─ Page Objects (initialized & verified)
     │
     ├─ Execute Test
     │  ├─ UI Actions (click, fill, wait)
     │  ├─ API Requests (GET, POST, etc.)
     │  └─ DB Assertions (transactions isolated)
     │
     ├─ Capture Evidence
     │  ├─ Screenshots (on failure)
     │  ├─ Test Logs (detailed)
     │  └─ Allure Attachments
     │
     └─ Cleanup
        ├─ Close Page/Browser
        ├─ Rollback Database Transaction
        └─ Log Completion
```

## Performance

### Optimization Tips

1. **Use Parallel Execution** - Reduces total runtime:
   ```bash
   pytest tests/ -n 4
   ```

2. **Filter by Marker** - Run only what's needed:
   ```bash
   pytest tests/ -m ui  # Just UI tests
   ```

3. **Session-Scoped Fixtures** - Reused across tests:
   - `db_connection_pool` - Database connection
   - `api_session` - HTTP session with connection pooling
   - `browser` - Chromium instance

4. **Transaction Rollback** - Faster than cleanup:
   - DB state restored automatically after each test
   - No database rebuild needed

### Typical Timing

- Full suite (50 tests): ~5-8 minutes
- UI tests (15 tests): ~2-3 minutes  
- API tests (20 tests): ~1-2 minutes
- Database tests (15 tests): ~1-2 minutes

## Contributing

### Add New Test

1. Create test file in appropriate directory (`tests/ui/`, `tests/api/`, `tests/database/`)
2. Use appropriate markers (`@pytest.mark.ui`, etc.)
3. Use existing fixtures and page objects
4. Follow naming: `test_<feature>.py` and `test_<action>()`
5. Add docstrings explaining what's tested

### Add New Page Object

1. Create in `tests/pages/<page_name>.py`
2. Inherit from `BasePage`
3. Define selectors as class constants
4. Implement `assert_page_loaded()`
5. Add methods for page interactions
6. Add fixture in `tests/fixtures/pages.py`

### Add New Fixture

1. Add to appropriate file in `tests/fixtures/`
2. Use appropriate scope (`session`, `function`, etc.)
3. Add logging for debugging
4. Include proper error handling
5. Document in fixture docstring

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Playwright Python API](https://playwright.dev/python/)
- [Allure Report](https://docs.qameta.io/allure/)
- [aiohttp Documentation](https://docs.aiohttp.org/)
- [psycopg2 Documentation](https://www.psycopg.org/)

## Support

For issues or questions:
1. Check logs in `test-results/test.log`
2. Review screenshots in `screenshots/` directory
3. Check environment variables in `.env`
4. Run with verbose logging: `pytest tests/ -vv --log-cli-level=DEBUG`

---

**Status:** Production Ready  
**Last Updated:** 2026-06-18  
**Version:** 1.0.0
