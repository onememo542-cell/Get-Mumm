# E2E Testing

## Running Tests

### Prerequisites
- Python 3.11+ installed
- Dependencies installed: `pip install -r tests/requirements-test.txt`
- Playwright browsers: `playwright install chromium`
- Test environment running: `docker-compose -f tests/docker-compose.test.yml up -d`

### Run All Tests
```bash
pytest tests/ -v
```

### Run by Category
```bash
pytest -m ui tests/       # UI tests only
pytest -m api tests/      # API tests only
pytest -m database tests/ # Database tests only
```

### Parallel Execution
```bash
pytest -n 4 tests/  # Run with 4 workers
```

### Skip Unreliable Tests
```bash
pytest -m "not flaky" tests/
```

### Single Test
```bash
pytest tests/ui/test_home_page.py::TestHomePage::test_home_page_loads -v -s
```

## Test Organization

```
tests/
├── ui/          # Playwright page tests (244+ tests)
├── api/         # HTTP endpoint tests
├── database/    # Schema & isolation tests
├── fixtures/    # Shared setup (DB, API, Pages)
├── pages/       # Page objects for UI
└── conftest.py  # Global configuration
```

## Test Markers

- `@pytest.mark.ui` - UI tests
- `@pytest.mark.api` - API tests
- `@pytest.mark.database` - Database tests
- `@pytest.mark.smoke` - Quick validation
- `@pytest.mark.flaky` - Unreliable tests (skip with `not flaky`)

## Fixtures

Key fixtures in `conftest.py`:
- `db_transaction` - Database with auto-rollback
- `api_client` - HTTP client for API testing
- `home_page`, `menu_page`, etc - Page objects
- `seed_menu_items`, `seed_chefs` - Test data

## Debugging Failed Tests

### View Test Output
```bash
pytest tests/ui/test_home_page.py -s  # Show print statements
```

### View Logs
```bash
tail -f tests/test_execution.log
```

### Screenshot on Failure
UI test screenshots saved to: `tests/debug/screenshots/`

### Debug Single Test
```bash
pytest tests/ui/test_home_page.py::TestHomePage::test_home_page_loads -vv --tb=short
```

## Test Reports

### Allure Reports
```bash
# Run with Allure collection
pytest tests/ --alluredir=allure-results

# Generate HTML report
allure generate allure-results -o allure-report

# View report
allure serve allure-results
```

### JUnit XML
```bash
pytest tests/ --junit-xml=test-results/junit.xml
```

## CI/CD

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests
- Manual trigger via Actions tab

View results: GitHub → Actions → E2E Tests workflow

## Writing Tests

### UI Test Example
```python
@pytest.mark.ui
async def test_menu_displays_items(self, menu_page):
    """Test that menu shows all items."""
    await menu_page.assert_page_loaded()
    count = await menu_page.get_menu_item_count()
    assert count > 0
```

### API Test Example
```python
@pytest.mark.api
async def test_get_menu_endpoint(self, api_client):
    """Test GET /api/menu returns items."""
    status, data = await api_client.get("/api/menu")
    assert status == 200
    assert "items" in data
```

### Database Test Example
```python
@pytest.mark.database
async def test_transaction_rollback(self, db_transaction):
    """Test transaction isolation."""
    cursor = db_transaction.cursor()
    cursor.execute("SELECT COUNT(*) FROM menu_items")
    count = cursor.fetchone()[0]
    assert count >= 0
```

## Test Statistics

- Total tests: 244+
- UI tests: ~105
- API tests: ~83
- Database tests: ~56
- Execution time: ~3-5 minutes (parallel)

## Troubleshooting

**Docker won't start:**
```bash
docker-compose -f tests/docker-compose.test.yml down -v
docker-compose -f tests/docker-compose.test.yml up -d
```

**Playwright issues:**
```bash
playwright install chromium --with-deps
```

**Tests timeout:**
```bash
pytest --timeout=600 tests/  # Increase timeout to 10 min
```

**Connection refused:**
```bash
# Verify services are running
docker ps | grep get-mumm
```
