# Contributing to Get-Mumm

## Testing Requirements

All pull requests must pass E2E testing before merge.

### Running Tests Locally

```bash
# Setup (first time)
pip install -r tests/requirements-test.txt
playwright install chromium

# Start test environment
docker-compose -f tests/docker-compose.test.yml up -d

# Run tests
pytest tests/ -v

# Run specific category
pytest -m ui tests/       # UI tests only
pytest -m api tests/      # API tests only
pytest -m database tests/ # Database tests only
```

### Test Organization

- **UI Tests** (`tests/ui/`) - Page object tests with Playwright
- **API Tests** (`tests/api/`) - Endpoint testing with async HTTP
- **Database Tests** (`tests/database/`) - Schema, isolation, seeding

### Markers

```bash
pytest -m "not flaky" tests/  # Skip unreliable tests
pytest -m smoke tests/        # Quick validation
```

### Parallel Execution

```bash
pytest -n 4 tests/  # Run with 4 workers
```

## CI/CD Pipeline

Tests run automatically on:
- Push to `main` / `develop`
- Pull requests to `main` / `develop`
- Manual trigger via Actions tab

View results in **Actions** tab → **E2E Tests** workflow.

## Debugging

### View Logs
```bash
tail -f tests/test_execution.log
```

### Run Single Test
```bash
pytest tests/ui/test_home_page.py::TestHomePage::test_home_page_loads -v -s
```

### Capture Screenshots
Failed UI tests auto-save screenshots to `tests/debug/screenshots/`

## Code Style

- Follow existing test patterns in `tests/ui/test_*.py`
- Use page objects for UI interactions
- Add docstrings to test methods
- Mark unreliable tests with `@pytest.mark.flaky`

## Adding New Tests

1. Create test file in appropriate folder: `tests/ui/`, `tests/api/`, or `tests/database/`
2. Use existing fixtures from `conftest.py`
3. Follow naming: `test_*.py` with `Test*` classes
4. Add marker: `@pytest.mark.ui` or `@pytest.mark.api`
5. Run locally before pushing

## Questions?

Check test logs or workflow artifacts for details.
