# E2E Testing Infrastructure - Python/pytest

This directory contains the comprehensive end-to-end testing infrastructure for Get-Mumm, using Python, pytest, Playwright, and MCP for database operations.

## Architecture Overview

The testing infrastructure is **Python-first** with three main components:

```
tests/
├── conftest.py              # Global pytest configuration and fixtures
├── fixtures/
│   ├── mcp_client.py       # MCP client for database operations via backend API
│   ├── data_factory.py     # Test data generators
│   └── api_client.py       # HTTP client for direct API testing
├── pages/                   # Playwright page objects for UI tests
│   ├── base_page.py
│   ├── home_page.py
│   ├── menu_page.py
│   ├── chefs_page.py
│   ├── blog_page.py
│   ├── contact_page.py
│   └── subscriptions_page.py
├── ui/                      # UI tests with Playwright
│   ├── test_homepage.py
│   ├── test_menu.py
│   ├── test_chefs.py
│   ├── test_blog.py
│   ├── test_contact.py
│   └── test_subscriptions.py
├── api/                     # API tests
│   ├── test_menu_api.py
│   ├── test_chefs_api.py
│   ├── test_blog_api.py
│   ├── test_contact_api.py
│   └── test_subscriptions_api.py
├── integration/             # Integration tests
│   └── test_end_to_end.py
├── pytest.ini              # pytest configuration
├── requirements-test.txt   # Python dependencies
└── README.md              # This file
```

## Key Features

### 1. MCP-Driven Database Operations
All database seeding and data management goes through the backend's MCP endpoints, ensuring:
- No direct database access needed
- Consistent data setup across all test environments
- Automatic cleanup between tests
- API-driven approach matches production deployments

### 2. Pure Python/pytest (No TypeScript)
- Single test framework (pytest) for all tests
- Async-compatible via `pytest-asyncio`
- All fixtures are Python-based
- Cleaner, simpler architecture

### 3. Fixture Organization

**Session-Scoped Fixtures:**
- `test_config`: Loads environment variables once per session
- `allure_utils`: Allure reporting utilities

**Function-Scoped Fixtures:**
- `mcp_client`: MCP database client (via backend API)
- `http_client`: Direct HTTP client for API testing
- `browser`: Playwright browser instance
- `page`: Playwright page with viewport and base URL
- `*_page`: Page objects (home_page, menu_page, etc.)
- `seed_*`: Data seeding fixtures (seed_menu_items, seed_chefs, etc.)

**Parameterized Fixtures:**
- `dietary_category`: Tests with vegetarian, vegan, gluten-free, keto
- `meal_category`: Tests with breakfast, lunch, dinner, dessert
- `subscription_tier`: Tests with basic, premium, enterprise

### 4. Test Categories

Tests are organized by type and auto-marked with pytest markers:

**UI Tests** (`@pytest.mark.ui`)
- Playwright browser automation
- Page object model
- Located in `tests/ui/`

**API Tests** (`@pytest.mark.api`)
- Direct HTTP requests
- JSON responses
- Located in `tests/api/`

**Integration Tests** (`@pytest.mark.integration`)
- Combined UI + API workflows
- End-to-end scenarios
- Located in `tests/integration/`

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   cd tests
   pip install -r requirements-test.txt
   ```

2. Ensure backend is running:
   ```bash
   # In a separate terminal
   cd backend
   npm run dev
   ```

3. Set environment variables (or use defaults):
   ```bash
   export API_BASE_URL=http://localhost:3001
   export FRONTEND_BASE_URL=http://localhost:3000
   export MCP_API_KEY=test-key-12345
   ```

### Run All Tests
```bash
pytest
```

### Run Specific Test Categories
```bash
# UI tests only
pytest -m ui

# API tests only
pytest -m api

# Integration tests
pytest -m integration

# Smoke tests (quick validation)
pytest -m smoke
```

### Run Specific Test Files
```bash
pytest tests/ui/test_menu.py
pytest tests/api/test_chefs_api.py
```

### Run Tests in Parallel
```bash
pytest -n auto
```

### Run with Verbose Output
```bash
pytest -v
```

### Generate Allure Report
```bash
# Run tests with Allure collection
pytest --alluredir=allure-results

# Generate HTML report
allure serve allure-results
```

### Run Tests Headless (UI)
```bash
export BROWSER_HEADLESS=true
pytest -m ui
```

### Run Tests with Browser Window
```bash
export BROWSER_HEADLESS=false
pytest -m ui
```

## Fixture Usage

### Using MCP Client for Data Seeding

```python
import pytest

@pytest.mark.ui
async def test_menu_displays_seeded_items(page, seed_menu_items):
    """Test that menu displays seeded items."""
    # seed_menu_items automatically seeded via MCP
    menu_items = await seed_menu_items
    
    await page.goto("/menu")
    for item in menu_items:
        await expect(page.locator(f"text={item['name']}", )).to_be_visible()
```

### Using Parameterized Fixtures

```python
@pytest.mark.api
async def test_menu_filters_by_dietary_category(http_client, dietary_category):
    """Test menu API filters by dietary category."""
    async with http_client.get(
        f"http://localhost:3001/api/menu?dietary={dietary_category}"
    ) as resp:
        data = await resp.json()
        assert all(item["dietary"] == dietary_category for item in data)
```

### Using Page Objects

```python
@pytest.mark.ui
async def test_contact_form_submission(page, contact_page):
    """Test contact form submission."""
    await contact_page.navigate_to("/contact")
    await contact_page.fill_form({
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Test message"
    })
    await contact_page.submit()
    await contact_page.assert_success_message_visible()
```

### Cleanup Between Tests

Data is automatically cleaned via MCP client in test teardown. The `mcp_client` fixture handles cleanup.

## Environment Configuration

Tests use environment variables with sensible defaults:

| Variable | Default | Purpose |
|----------|---------|---------|
| `API_BASE_URL` | http://localhost:3001 | Backend API URL |
| `FRONTEND_BASE_URL` | http://localhost:3000 | Frontend URL |
| `MCP_API_KEY` | test-key-12345 | MCP authentication key |
| `BROWSER_HEADLESS` | true | Playwright headless mode |
| `BROWSER_TIMEOUT` | 30000 | Playwright timeout (ms) |
| `API_TIMEOUT` | 5000 | HTTP request timeout (ms) |

## Debugging Failed Tests

### View Playwright Traces
```bash
# After a test failure with trace enabled
npx playwright show-trace trace.zip
```

### Check Test Logs
```bash
tail -f tests/test_execution.log
```

### Run Failing Test in Debug Mode
```bash
pytest --pdb tests/ui/test_menu.py::test_name
```

### Capture Screenshots on Failure
Screenshots are automatically captured in Allure reports. For manual capture:

```python
async def test_something(page):
    await page.goto("/")
    # ... test actions ...
    await page.screenshot(path="debug_screenshot.png")
```

## CI/CD Integration

### GitHub Actions
See `.github/workflows/e2e-tests.yml` for CI/CD configuration.

Tests run automatically on:
- Push to `main` or `master`
- Pull requests
- Manual trigger via workflow dispatch

### Test Results
- HTML reports uploaded as artifacts (30-day retention)
- Allure reports generated and published
- PR comments with test summary

## Best Practices

### Page Objects
- Keep selectors in page object classes
- Use descriptive method names
- Implement `assert_page_loaded()` for validation
- Add logging for debugging

### Fixtures
- Session-scoped for expensive setup (browser)
- Function-scoped for data isolation (mcp_client)
- Use fixtures for both setup and cleanup
- Parameterize fixtures for data variation

### Tests
- One assertion per test (or closely related)
- Descriptive test names (test_*)
- Use markers for categorization
- Keep tests independent

### Data Management
- Use MCP client for all database operations
- Leverage seeding fixtures for test data
- Implement cleanup in fixture teardown
- Don't rely on shared test state

## Troubleshooting

### "MCP API Key invalid"
Ensure `MCP_API_KEY` environment variable matches backend `.env`

### "Cannot connect to http://localhost:3001"
Verify backend is running: `npm run dev` in the `backend/` directory

### "Playwright browser not found"
Install Playwright browsers:
```bash
playwright install
```

### Async fixture errors
Ensure test functions use `async def` and fixtures use `@pytest.mark.asyncio`

### Tests hanging
Check if frontend/backend are running and responsive
Increase timeout: `export BROWSER_TIMEOUT=60000`

## Contributing

When adding new tests:

1. Place in appropriate directory (`ui/`, `api/`, or `integration/`)
2. Name file: `test_<feature>.py`
3. Name test: `test_<scenario>`
4. Add appropriate marker: `@pytest.mark.ui`, `@pytest.mark.api`, etc.
5. Use existing fixtures for setup/teardown
6. Add descriptive docstrings
7. Keep tests independent and idempotent

## Resources

- [pytest documentation](https://docs.pytest.org/)
- [pytest-asyncio](https://pytest-asyncio.readthedocs.io/)
- [Playwright Python](https://playwright.dev/python/)
- [Allure Reports](https://docs.qameta.io/allure/)
