# Design Document: E2E Testing Infrastructure

## Overview

This design document outlines the technical architecture for a comprehensive end-to-end testing infrastructure for the Get-Mumm platform. The infrastructure leverages Docker Compose for isolated test environments, pytest as the test orchestration framework, Playwright for UI automation, Python for API testing, and Allure for detailed test reporting integrated with GitHub Actions CI/CD.

### Design Principles

1. **Isolation**: Each test runs in a containerized, isolated environment with its own database
2. **Repeatability**: Tests are deterministic and produce consistent results across environments
3. **Maintainability**: Page Object Model abstractions reduce coupling and enable selector reuse
4. **Scalability**: Parallel execution across workers reduces test suite runtime
5. **Observability**: Comprehensive logging, screenshots, and Allure reporting provide debugging context
6. **Efficiency**: Database transaction rollback provides fast cleanup without container rebuilding

---

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Actions Workflow                       │
│  Triggered on: PR open/update, manual trigger                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────────┐  ┌────────────┐  ┌──────────────┐
   │ Setup Env   │  │  Docker    │  │  Dependency  │
   │ (Python,    │  │  Compose   │  │  Install     │
   │  Node.js)   │  │  Services  │  │  (pytest,    │
   └─────────────┘  └─────┬──────┘  │  Playwright) │
                          │         └──────────────┘
                          ▼
        ┌─────────────────────────────────────┐
        │    Docker Compose Test Network      │
        │                                     │
        │  ┌──────────────┐   ┌────────────┐ │
        │  │ PostgreSQL   │   │ Application│ │
        │  │ Test DB      │   │ Container  │ │
        │  └──────────────┘   └────────────┘ │
        │                                     │
        │  Network: test-network (isolated)   │
        └──────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────────────┐  ┌──────────────────┐
   │  Test Runner    │  │  Allure Result   │
   │  (pytest)       │  │  Collector       │
   │                 │  │                  │
   │ • UI Tests      │  │ • Test results   │
   │ • API Tests     │  │ • Screenshots    │
   │ • DB Tests      │  │ • Logs           │
   │ • Fixtures      │  │ • Timings        │
   │ • Parallel (4)  │  │                  │
   └──────┬──────────┘  └────────┬─────────┘
          │                      │
          └──────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Allure Report HTML    │
        │  • Test breakdown      │
        │  • Trends & history    │
        │  • Categorization      │
        └────────────┬───────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
        ▼                           ▼
   ┌─────────────┐        ┌──────────────────┐
   │  Artifact   │        │  PR Comment      │
   │  Storage    │        │  (GitHub)        │
   │  (30 days)  │        │  Pass/Fail,Link  │
   └─────────────┘        └──────────────────┘
```

---

## Architecture

The E2E testing infrastructure follows a layered, modular architecture:

**Layer 1: Test Orchestration** (pytest) - Core test discovery, execution, and result collection
**Layer 2: Environment Isolation** (Docker Compose) - Containerized test database and application server
**Layer 3: Test Automation** (Playwright, Python) - UI and API test implementation
**Layer 4: Page Abstraction** (Page Object Model) - Centralized element selectors and interactions
**Layer 5: Fixture Management** (pytest fixtures) - Test data and resource management
**Layer 6: Reporting and CI/CD** (Allure, GitHub Actions) - Test result visualization and workflow integration

---

## Components and Interfaces

### Component 1: Test Runner (pytest)

**Purpose**: Orchestrate test discovery, execution, and result collection
**Responsibilities**:
- Discover test files matching patterns
- Initialize and manage fixtures
- Execute tests (serial or parallel)
- Collect and format results

**Interfaces**:
- Input: Test files (test_*.py)
- Output: JUnit XML, Allure results
- Configuration: pytest.ini

### Component 2: Docker Compose Test Environment

**Purpose**: Provide isolated, reproducible test environments
**Responsibilities**:
- Launch PostgreSQL database container
- Launch application server container
- Manage network isolation
- Execute database initialization scripts
- Health checks and service readiness

**Interfaces**:
- Configuration: docker-compose.test.yml
- Input: Environment variables, initialization scripts
- Output: Running services accessible on test network

### Component 3: Page Object Framework

**Purpose**: Provide abstraction layer for UI interactions
**Responsibilities**:
- BasePage class with common methods
- Page-specific objects for each page/feature
- Selector management
- Element waits and interactions
- Screenshot capture on failure

**Interfaces**:
- Input: Playwright page context
- Methods: navigate_to(), click(), fill_text(), get_text(), etc.
- Output: Interaction results, screenshots

### Component 4: Fixture Management System

**Purpose**: Manage test data and resource lifecycle
**Responsibilities**:
- Database connection pooling
- Transaction management and rollback
- Test data seeding
- API client initialization
- Page object setup

**Interfaces**:
- Session-scoped fixtures: database pool, browser
- Function-scoped fixtures: database transactions, page objects
- Parameterized fixtures: test data variation

### Component 5: Allure Reporting System

**Purpose**: Collect and visualize test results
**Responsibilities**:
- Attach evidence (screenshots, logs)
- Categorize tests
- Generate HTML reports
- Track trends and flaky tests
- Support filtering and search

**Interfaces**:
- Input: Test results, attachments
- Output: allure-report/ HTML directory
- Configuration: allure-pytest.ini

### Component 6: GitHub Actions Integration

**Purpose**: Integrate testing into CI/CD pipeline
**Responsibilities**:
- Trigger on PR/push events
- Set up environments
- Run Docker Compose services
- Execute tests in parallel
- Generate and publish reports
- Comment on PRs

**Interfaces**:
- Trigger: Pull requests, push events
- Environment: Python, Node.js setup
- Output: Artifacts, PR comments
- Configuration: .github/workflows/e2e-tests.yml

---

## Component Architecture

### 1. Test Runner (pytest)

The test runner orchestrates all test execution using pytest as the core framework.

#### Configuration File: `pytest.ini`

```ini
[pytest]
# Test discovery patterns
python_files = test_*.py
python_classes = Test*
python_functions = test_*

# Markers for test categorization
markers =
    ui: UI tests using Playwright
    api: API tests using requests
    database: Database tests using fixtures
    smoke: Smoke tests for quick validation
    flaky: Tests that may be flaky and should retry

# Output and reporting
addopts = 
    --junit-xml=test-results/junit.xml
    --alluredir=allure-results
    --verbose
    --strict-markers
    -n auto

# Timeout
timeout = 300

# Test paths
testpaths = tests
```

#### Supported Markers

- `@pytest.mark.ui`: UI automation tests using Playwright
- `@pytest.mark.api`: API integration tests
- `@pytest.mark.database`: Database-focused tests with fixtures
- `@pytest.mark.smoke`: Quick validation tests
- `@pytest.mark.flaky`: Tests with known flakiness, retry enabled

#### Test Execution Flow

1. **Test Discovery**: pytest discovers all test files matching `test_*.py` pattern
2. **Fixture Setup**: Session, module, and function-scoped fixtures initialize
3. **Parallel Execution**: Tests distributed across 4 workers by default
4. **Result Collection**: Results collected in JUnit XML and Allure formats
5. **Report Generation**: Allure processes results into HTML report

---

### 2. Docker Compose Environment

The Docker Compose configuration provides an isolated, reproducible test environment.

#### File Structure: `docker-compose.test.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL test database
  postgres-test:
    image: postgres:15-alpine
    container_name: get-mumm-test-db
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    ports:
      - "5433:5432"
    volumes:
      - ./migrations:/docker-entrypoint-initdb.d
      - test-db-data:/var/lib/postgresql/data
    networks:
      - test-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test_user -d test_db"]
      interval: 2s
      timeout: 5s
      retries: 10
    restart: always

  # Application backend server
  app-server:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: get-mumm-app-server
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ASPNETCORE_URLS: http://+:5000
      ConnectionStrings__DefaultConnection: Host=postgres-test;Database=test_db;Username=test_user;Password=test_password
    ports:
      - "5000:5000"
    depends_on:
      postgres-test:
        condition: service_healthy
    networks:
      - test-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 2s
      timeout: 5s
      retries: 10

  # Playwright browser container (optional, for headless execution)
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-focal
    container_name: get-mumm-playwright
    networks:
      - test-network
    depends_on:
      - app-server

networks:
  test-network:
    driver: bridge
    name: get-mumm-test-network

volumes:
  test-db-data:
    name: get-mumm-test-db-volume
```

#### Database Initialization

Database initialization scripts are mounted and executed on container startup:

- **`migrations/001_init.sql`**: Creates schema, tables, indexes
- **`migrations/002_seed_data.sql`**: Pre-populates test data
- **Health Check**: Ensures database is ready before tests start

#### Service Dependencies

- `app-server` depends on `postgres-test` with health check
- Tests wait for all services to report healthy before starting
- Network isolation prevents external access to test database

---

### 3. Page Object Model Framework

The Page Object Model provides abstraction for UI interactions.

#### BasePage Class

```python
# src/tests/pages/base_page.py

from playwright.async_api import Page, Locator
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

class BasePage:
    """
    Base class for all page objects.
    Provides common methods for navigation, element finding, waits, and interactions.
    """
    
    DEFAULT_TIMEOUT = 10000  # 10 seconds in milliseconds
    
    def __init__(self, page: Page, base_url: str = "http://localhost:3000"):
        """
        Initialize page object with Playwright page context.
        
        Args:
            page: Playwright page object
            base_url: Base URL for navigation (defaults to localhost:3000)
        """
        self.page = page
        self.base_url = base_url
        page.set_default_timeout(self.DEFAULT_TIMEOUT)
        logger.info(f"Initialized {self.__class__.__name__} for {base_url}")
    
    async def navigate_to(self, path: str = "/") -> None:
        """Navigate to a specific path."""
        url = f"{self.base_url}{path}"
        await self.page.goto(url, wait_until="networkidle")
        logger.info(f"Navigated to {url}")
    
    async def find_element(self, selector: str) -> Locator:
        """Find element by selector."""
        element = self.page.locator(selector)
        await element.wait_for(state="visible")
        return element
    
    async def wait_for_element(self, selector: str, timeout: int = None) -> bool:
        """Wait for element to appear."""
        timeout_ms = timeout if timeout else self.DEFAULT_TIMEOUT
        try:
            await self.page.wait_for_selector(selector, timeout=timeout_ms)
            return True
        except Exception as e:
            logger.error(f"Element not found: {selector} - {str(e)}")
            return False
    
    async def click(self, selector: str) -> None:
        """Click an element."""
        element = await self.find_element(selector)
        await element.click()
        logger.info(f"Clicked element: {selector}")
    
    async def fill_text(self, selector: str, text: str) -> None:
        """Fill text input."""
        element = await self.find_element(selector)
        await element.fill(text)
        logger.info(f"Filled text in {selector}: {text[:20]}...")
    
    async def get_text(self, selector: str) -> str:
        """Get text from element."""
        element = await self.find_element(selector)
        text = await element.text_content()
        logger.info(f"Got text from {selector}: {text[:50]}...")
        return text or ""
    
    async def assert_page_loaded(self) -> None:
        """Assert that page has loaded (override in subclasses)."""
        pass
    
    async def take_screenshot(self, name: str) -> str:
        """Take screenshot for debugging."""
        path = f"screenshots/{name}.png"
        await self.page.screenshot(path=path)
        logger.info(f"Screenshot saved: {path}")
        return path
```

#### Page Object Implementation Example: HomePage

```python
# src/tests/pages/home_page.py

from .base_page import BasePage
from playwright.async_api import Page

class HomePage(BasePage):
    """
    Page object for the home page.
    """
    
    # Selectors
    NAVIGATION_MENU = "nav.main-navigation"
    MENU_LINK = "a[href='/menu']"
    CHEFS_LINK = "a[href='/chefs']"
    BLOG_LINK = "a[href='/blog']"
    CONTACT_BUTTON = "button:has-text('Contact')"
    HERO_SECTION = "section.hero"
    MAIN_LOGO = "a.logo"
    
    def __init__(self, page: Page):
        super().__init__(page)
    
    async def assert_page_loaded(self) -> None:
        """Verify home page has loaded."""
        assert await self.wait_for_element(self.HERO_SECTION)
        assert await self.wait_for_element(self.NAVIGATION_MENU)
    
    async def click_menu_link(self) -> "MenuPage":
        """Click menu link and navigate to menu page."""
        await self.click(self.MENU_LINK)
        return MenuPage(self.page)
    
    async def click_chefs_link(self) -> "ChefsPage":
        """Click chefs link and navigate to chefs page."""
        await self.click(self.CHEFS_LINK)
        return ChefsPage(self.page)
    
    async def click_blog_link(self) -> "BlogPage":
        """Click blog link and navigate to blog page."""
        await self.click(self.BLOG_LINK)
        return BlogPage(self.page)
    
    async def click_contact_button(self) -> "ContactPage":
        """Click contact button and navigate to contact page."""
        await self.click(self.CONTACT_BUTTON)
        return ContactPage(self.page)
    
    async def is_navigation_visible(self) -> bool:
        """Check if main navigation is visible."""
        return await self.wait_for_element(self.NAVIGATION_MENU)
```

---

## Data Models

### Test Data Structures

#### MenuItem
```
{
  id: integer (primary key)
  name: string (non-empty, max 255)
  category: string (enum: mains, sides, salads, desserts, beverages)
  price: decimal (positive)
  dietary_info: string (nullable, enum: vegetarian, vegan, gluten-free, dairy-free)
  description: string (nullable)
  image_url: string (nullable)
  available: boolean (default: true)
  created_at: timestamp
  updated_at: timestamp
}
```

#### Chef
```
{
  id: integer (primary key)
  name: string (non-empty, max 255)
  bio: string (nullable)
  specialties: array of strings (nullable)
  image_url: string (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

#### BlogPost
```
{
  id: integer (primary key)
  title: string (non-empty, max 500)
  content: string (non-empty)
  author: string (non-empty)
  category: string (enum: recipes, techniques, ingredients, news)
  publish_date: timestamp
  image_url: string (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

#### ContactSubmission
```
{
  id: integer (primary key)
  name: string (non-empty, max 255)
  email: string (valid email, max 255)
  subject: string (non-empty, max 500)
  message: string (non-empty)
  phone: string (nullable)
  created_at: timestamp
}
```

#### SubscriptionPlan
```
{
  id: integer (primary key)
  name: string (non-empty, max 255)
  price: decimal (positive)
  billing_cycle: string (enum: monthly, annual)
  features: array of strings
  created_at: timestamp
  updated_at: timestamp
}
```

---

## Error Handling

### Exception Hierarchy

```
TestExecutionException (base)
├── PageLoadException
├── APIRequestException
├── DatabaseException
├── FixtureException
└── TimeoutException
```

### Error Handling Patterns

#### Page Load Errors
- **Symptom**: Element not found within timeout
- **Handling**: Capture screenshot, log page state, retry if flaky marker applied
- **Logging**: Log selector, timeout value, and current page URL

#### API Errors
- **Symptom**: Unexpected status code or malformed response
- **Handling**: Log request/response bodies, retry on transient errors (5xx)
- **Logging**: Include headers, body, and timing information

#### Database Errors
- **Symptom**: Connection failure, query failure, transaction conflict
- **Handling**: Rollback transaction, log error details, fail test with diagnostics
- **Logging**: Include SQL query, error message, and connection details

#### Fixture Setup Errors
- **Symptom**: Fixture initialization fails
- **Handling**: Log error, cleanup partial state, mark test as error (not failure)
- **Logging**: Include fixture name, phase (setup/teardown), and error traceback

---

## Fixture Management System

### Database Fixtures

```python
# src/tests/fixtures/database.py

import pytest
import psycopg2
from psycopg2 import sql
import logging

logger = logging.getLogger(__name__)

@pytest.fixture(scope="session")
def db_connection_pool():
    """
    Session-scoped fixture for database connection pool.
    Established once per test session, shared across all tests.
    """
    conn = psycopg2.connect(
        dbname="test_db",
        user="test_user",
        password="test_password",
        host="postgres-test",
        port=5432
    )
    logger.info("Database connection pool established")
    yield conn
    conn.close()
    logger.info("Database connection pool closed")

@pytest.fixture(scope="function")
def db_transaction(db_connection_pool):
    """
    Function-scoped fixture for transaction management.
    Creates a new transaction for each test, rolls back after test completes.
    """
    cursor = db_connection_pool.cursor()
    db_connection_pool.begin()
    logger.info("Transaction started")
    
    yield cursor
    
    # Rollback on completion
    db_connection_pool.rollback()
    cursor.close()
    logger.info("Transaction rolled back")

@pytest.fixture(scope="function")
def seed_menu_items(db_transaction):
    """
    Function-scoped fixture for seeding test menu items.
    Creates diverse menu items with various dietary restrictions.
    """
    seed_sql = """
    INSERT INTO menu_items (name, category, price, dietary_info, description)
    VALUES 
        ('Vegetable Risotto', 'mains', 14.99, 'vegetarian', 'Creamy risotto with seasonal vegetables'),
        ('Grilled Salmon', 'mains', 22.99, 'gluten-free', 'Atlantic salmon with lemon butter'),
        ('Vegan Buddha Bowl', 'bowls', 12.99, 'vegan', 'Mixed grains with roasted vegetables'),
        ('Classic Burger', 'sandwiches', 10.99, NULL, 'Grass-fed beef with homemade aioli');
    """
    db_transaction.execute(seed_sql)
    logger.info("Menu items seeded")
    yield db_transaction

@pytest.fixture(scope="function", params=[
    {"category": "vegetarian", "count": 3},
    {"category": "vegan", "count": 2},
    {"category": "gluten-free", "count": 4}
])
def parameterized_dietary_items(db_transaction, request):
    """
    Parameterized fixture generating multiple test instances with different dietary categories.
    """
    category = request.param["category"]
    count = request.param["count"]
    
    for i in range(count):
        insert_sql = sql.SQL(
            "INSERT INTO menu_items (name, category, price, dietary_info) VALUES ({}, {}, {}, {})"
        ).format(
            sql.Literal(f"{category.title()} Item {i}"),
            sql.Literal("mains"),
            sql.Literal(9.99 + i),
            sql.Literal(category)
        )
        db_transaction.execute(insert_sql)
    
    logger.info(f"Seeded {count} {category} items")
    yield {"category": category, "count": count}
```

### API Client Fixtures

```python
# src/tests/fixtures/api_client.py

import pytest
import aiohttp
import logging

logger = logging.getLogger(__name__)

@pytest.fixture(scope="session")
async def api_session():
    """
    Session-scoped fixture for HTTP client session.
    Reused across all API tests.
    """
    async with aiohttp.ClientSession() as session:
        logger.info("API session created")
        yield session
        logger.info("API session closed")

@pytest.fixture(scope="function")
async def api_client(api_session):
    """
    Function-scoped fixture for API client with authentication.
    """
    class APIClient:
        def __init__(self, base_url="http://app-server:3001", session=None):
            self.base_url = base_url
            self.session = session
            self.auth_token = None
        
        async def get(self, endpoint: str, params=None):
            url = f"{self.base_url}{endpoint}"
            headers = self._get_headers()
            async with self.session.get(url, params=params, headers=headers) as resp:
                logger.info(f"GET {endpoint} - Status: {resp.status}")
                return resp.status, await resp.json()
        
        async def post(self, endpoint: str, data=None):
            url = f"{self.base_url}{endpoint}"
            headers = self._get_headers()
            async with self.session.post(url, json=data, headers=headers) as resp:
                logger.info(f"POST {endpoint} - Status: {resp.status}")
                return resp.status, await resp.json()
        
        def _get_headers(self):
            headers = {"Content-Type": "application/json"}
            if self.auth_token:
                headers["Authorization"] = f"Bearer {self.auth_token}"
            return headers
        
        def set_auth_token(self, token: str):
            self.auth_token = token
            logger.info("Auth token set")
    
    client = APIClient(session=api_session)
    yield client

@pytest.fixture(scope="function")
async def authenticated_api_client(api_client):
    """
    Fixture providing API client with mock authentication token.
    """
    api_client.set_auth_token("mock-jwt-token-12345")
    return api_client
```

### Page Object Fixtures

```python
# src/tests/fixtures/pages.py

import pytest
from playwright.async_api import async_playwright, Browser, Page
from src.tests.pages.home_page import HomePage
from src.tests.pages.menu_page import MenuPage
import logging

logger = logging.getLogger(__name__)

@pytest.fixture(scope="session")
async def browser():
    """
    Session-scoped fixture for Playwright browser instance.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        logger.info("Browser launched (Chromium)")
        yield browser
        await browser.close()
        logger.info("Browser closed")

@pytest.fixture(scope="function")
async def page(browser: Browser) -> Page:
    """
    Function-scoped fixture creating a new browser context and page for each test.
    Ensures test isolation at the browser level.
    """
    context = await browser.new_context()
    page = await context.new_page()
    logger.info("New browser page created")
    
    # Set viewport for consistent screenshots
    await page.set_viewport_size({"width": 1280, "height": 720})
    
    yield page
    
    # Cleanup
    await page.close()
    await context.close()
    logger.info("Browser page and context closed")

@pytest.fixture(scope="function")
async def home_page(page: Page) -> HomePage:
    """
    Function-scoped fixture for HomePage object.
    """
    home = HomePage(page)
    await home.navigate_to("/")
    await home.assert_page_loaded()
    logger.info("HomePage ready")
    return home

@pytest.fixture(scope="function")
async def menu_page(page: Page) -> MenuPage:
    """
    Function-scoped fixture for MenuPage object.
    """
    menu = MenuPage(page)
    await menu.navigate_to("/menu")
    await menu.assert_page_loaded()
    logger.info("MenuPage ready")
    return menu
```

---

## Test Suites and Categories

### UI Test Suite

```python
# src/tests/ui/test_home_page.py

import pytest
from src.tests.pages.home_page import HomePage

@pytest.mark.ui
class TestHomePage:
    """UI tests for the home page."""
    
    async def test_navigation_menu_visible(self, home_page: HomePage):
        """
        Property: For any valid homepage load, the main navigation menu
        shall be visible and clickable.
        """
        assert await home_page.is_navigation_visible()
    
    async def test_navigation_links_present(self, home_page: HomePage):
        """Verify all navigation links are present."""
        assert await home_page.wait_for_element(home_page.MENU_LINK)
        assert await home_page.wait_for_element(home_page.CHEFS_LINK)
        assert await home_page.wait_for_element(home_page.BLOG_LINK)
    
    @pytest.mark.flaky
    async def test_hero_section_loads(self, home_page: HomePage):
        """Verify hero section loads and is visible."""
        assert await home_page.wait_for_element(home_page.HERO_SECTION)
```

### API Test Suite

```python
# src/tests/api/test_menu_api.py

import pytest

@pytest.mark.api
class TestMenuAPI:
    """API tests for menu endpoints."""
    
    async def test_get_menu_returns_valid_response(self, api_client):
        """
        Property: For any GET /api/menu request, the response shall include
        menu items with all required fields (id, name, category, price, dietary_info).
        """
        status, data = await api_client.get("/api/menu")
        assert status == 200
        assert "items" in data
        
        for item in data["items"]:
            assert "id" in item
            assert "name" in item
            assert "category" in item
            assert "price" in item
    
    async def test_menu_filters_work(self, api_client):
        """
        Property: For any valid filter parameter (e.g., category, dietary),
        the response shall contain only matching items.
        """
        status, data = await api_client.get("/api/menu", params={"category": "vegetarian"})
        assert status == 200
        
        for item in data["items"]:
            assert item.get("category") == "vegetarian"
    
    async def test_menu_pagination(self, api_client):
        """
        Property: For any pagination parameters (limit, offset),
        the response shall return the correct subset of items.
        """
        status, data = await api_client.get("/api/menu", params={"limit": 5, "offset": 0})
        assert status == 200
        assert len(data["items"]) <= 5
        assert "total_count" in data
```

### Database Test Suite

```python
# src/tests/database/test_data_isolation.py

import pytest

@pytest.mark.database
class TestDataIsolation:
    """Tests for database transaction and data isolation."""
    
    async def test_transaction_rollback_restores_state(self, db_connection_pool, db_transaction, seed_menu_items):
        """
        Round-trip property: For any database modifications within a transaction,
        a rollback shall restore the database to its original state.
        """
        # Count items before
        db_transaction.execute("SELECT COUNT(*) FROM menu_items")
        count_before = db_transaction.fetchone()[0]
        
        # Insert new item
        db_transaction.execute(
            "INSERT INTO menu_items (name, category, price) VALUES (%s, %s, %s)",
            ("Test Item", "mains", 9.99)
        )
        
        # Count items after insert
        db_transaction.execute("SELECT COUNT(*) FROM menu_items")
        count_after = db_transaction.fetchone()[0]
        
        assert count_after == count_before + 1
        
        # Transaction will rollback after test, restoring original state
```

---

## GitHub Actions Workflow Integration

### Workflow File: `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]
  workflow_dispatch:

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install Python dependencies
        run: |
          pip install -r requirements-test.txt
          playwright install chromium firefox
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      
      - name: Restore backend dependencies
        run: cd backend && dotnet restore
      
      - name: Start Docker Compose services
        run: docker-compose -f docker-compose.test.yml up -d
      
      - name: Wait for services to be healthy
        run: |
          for i in {1..30}; do
            if curl -f http://localhost:3001/health > /dev/null 2>&1; then
              echo "Services are healthy"
              exit 0
            fi
            echo "Waiting for services... ($i/30)"
            sleep 2
          done
          exit 1
      
      - name: Run E2E tests
        run: |
          pytest tests/ \
            --junit-xml=test-results/junit.xml \
            --alluredir=allure-results \
            -n 4 \
            --verbose
      
      - name: Generate Allure report
        if: always()
        run: |
          npm install -g allure-commandline
          allure generate allure-results -o allure-report
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            test-results/
            allure-results/
            allure-report/
          retention-days: 30
      
      - name: Publish Allure report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: allure-report
          path: allure-report/
      
      - name: Comment on PR
        if: always() && github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const resultsPath = './test-results/junit.xml';
            const xml = fs.readFileSync(resultsPath, 'utf8');
            
            // Parse XML to extract summary
            const testCount = xml.match(/tests="(\d+)"/)?.[1] || '0';
            const failureCount = xml.match(/failures="(\d+)"/)?.[1] || '0';
            
            const body = `
            ## E2E Test Results
            
            - Total Tests: ${testCount}
            - Failed: ${failureCount}
            - Status: ${failureCount === '0' ? '✅ PASSED' : '❌ FAILED'}
            
            [View Allure Report](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
      
      - name: Stop Docker services
        if: always()
        run: docker-compose -f docker-compose.test.yml down -v
```

### Workflow Features

- **Trigger**: Pull requests, pushes to main/develop, manual trigger
- **Parallel Execution**: 4 workers distribute tests concurrently
- **Service Health Checks**: Waits for database and app server readiness
- **Artifact Retention**: 30 days for historical analysis
- **PR Comments**: Automatic failure/success comments with links
- **Screenshot Capture**: Failed tests include screenshots in Allure
- **Cleanup**: Docker services stopped and volumes removed after tests

---

## Allure Reporting System

### Allure Configuration: `allure-pytest.ini`

```ini
[allure]
# Report title and description
title = Get-Mumm E2E Test Report
description = Comprehensive end-to-end test execution report

# Test categorization
epic_prefix = Epic:
feature_prefix = Feature:
story_prefix = Story:

# History and trends
history_trend_days = 30
show_flaky_tests = true
```

### Allure Report Structure

The Allure report generates:

1. **Overview Dashboard**
   - Total test count and pass rate
   - Execution timeline
   - Test statistics by status
   - Environment information

2. **Test Categories**
   - By marker: UI, API, Database
   - By feature: Menu, Chefs, Blog, Contact, Subscriptions
   - By status: Passed, Failed, Skipped

3. **Detailed Test Information**
   - Execution time (duration)
   - Pass/fail status with error traces
   - Stack traces and log output
   - Screenshots (for failed UI tests)
   - API request/response bodies
   - Database query logs

4. **Trend Analysis**
   - Pass rate trends over last 30 days
   - Test duration trends
   - Flaky test identification (retry counts)

5. **Filtering and Search**
   - Filter by status, duration, category
   - Search by test name or feature
   - Export to PDF/HTML

### Attaching Evidence to Reports

```python
# src/tests/conftest.py

import allure
import logging

def pytest_runtest_makereport(item, call):
    """Hook to attach evidence after test execution."""
    if call.excinfo is not None:
        # Test failed
        if hasattr(item, "page"):
            # Attach screenshot
            screenshot = item.funcargs["page"].screenshot()
            allure.attach.file(
                screenshot,
                name="failure-screenshot",
                attachment_type=allure.attachment_type.PNG
            )

@pytest.fixture(autouse=True)
def allure_attach_logs(request):
    """Attach logs to allure report after each test."""
    yield
    
    # Get test logs
    log_handler = request.config.option.log_file
    if log_handler:
        with open(log_handler, 'r') as f:
            allure.attach(
                f.read(),
                name="test-logs",
                attachment_type=allure.attachment_type.TEXT
            )
```

---

## Error Handling and Debugging

### Exception Handling Strategy

```python
# src/tests/exceptions.py

class TestExecutionException(Exception):
    """Base exception for test execution errors."""
    pass

class PageLoadException(TestExecutionException):
    """Raised when a page fails to load within timeout."""
    def __init__(self, selector: str, timeout: int):
        self.message = f"Page element '{selector}' not found within {timeout}ms"
        super().__init__(self.message)

class APIRequestException(TestExecutionException):
    """Raised when an API request fails or returns unexpected status."""
    def __init__(self, endpoint: str, status_code: int, expected: int):
        self.message = f"API {endpoint} returned {status_code}, expected {expected}"
        super().__init__(self.message)

class DatabaseException(TestExecutionException):
    """Raised when database operations fail."""
    def __init__(self, operation: str, error: str):
        self.message = f"Database operation '{operation}' failed: {error}"
        super().__init__(self.message)

class FixtureException(TestExecutionException):
    """Raised when fixture setup/teardown fails."""
    def __init__(self, fixture_name: str, phase: str, error: str):
        self.message = f"Fixture '{fixture_name}' {phase} failed: {error}"
        super().__init__(self.message)
```

### Logging Configuration

```python
# src/tests/logging_config.py

import logging
import logging.handlers
from datetime import datetime

def configure_logging():
    """Configure comprehensive logging for tests."""
    
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    
    # File handler for detailed logs
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_handler = logging.FileHandler(f"logs/test_{timestamp}.log")
    file_handler.setLevel(logging.DEBUG)
    
    # Console handler for summary
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger
```

### Debugging Utilities

```python
# src/tests/debug_utils.py

import asyncio
from datetime import datetime

class DebugHelper:
    """Helper utilities for test debugging."""
    
    @staticmethod
    async def dump_page_state(page, test_name: str):
        """Dump page state for debugging."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Get page content
        content = await page.content()
        with open(f"debug/{test_name}_{timestamp}_page.html", "w") as f:
            f.write(content)
        
        # Take screenshot
        await page.screenshot(path=f"debug/{test_name}_{timestamp}.png")
        
        # Get console logs
        logs = await page.evaluate("() => window.logs || []")
        with open(f"debug/{test_name}_{timestamp}_logs.json", "w") as f:
            import json
            json.dump(logs, f, indent=2)
    
    @staticmethod
    async def dump_network_activity(page, test_name: str):
        """Capture network requests/responses."""
        requests = []
        
        def handle_response(response):
            requests.append({
                "url": response.url,
                "status": response.status,
                "method": response.request.method
            })
        
        page.on("response", handle_response)
        
        yield  # Test runs here
        
        page.remove_listener("response", handle_response)
        
        # Save network log
        with open(f"debug/{test_name}_network.json", "w") as f:
            import json
            json.dump(requests, f, indent=2)
```

---

## Data Models and Test Data Structures

### Menu Item Test Data

```python
# src/tests/data/menu_items.py

from dataclasses import dataclass
from typing import Optional, List

@dataclass
class MenuItem:
    """Test data model for menu items."""
    id: Optional[int] = None
    name: str = ""
    category: str = "mains"
    price: float = 9.99
    dietary_info: Optional[str] = None
    description: str = ""
    image_url: Optional[str] = None
    available: bool = True
    
    def to_dict(self) -> dict:
        """Convert to dictionary for API requests."""
        return {
            k: v for k, v in self.__dict__.items() 
            if v is not None and k != 'id'
        }

# Test data generators
def generate_test_menu_items(count: int = 5) -> List[MenuItem]:
    """Generate diverse test menu items."""
    items = [
        MenuItem(name="Vegetable Risotto", category="mains", price=14.99, dietary_info="vegetarian"),
        MenuItem(name="Grilled Salmon", category="mains", price=22.99, dietary_info="gluten-free"),
        MenuItem(name="Vegan Buddha Bowl", category="bowls", price=12.99, dietary_info="vegan"),
        MenuItem(name="Classic Burger", category="sandwiches", price=10.99),
        MenuItem(name="Caesar Salad", category="salads", price=8.99, dietary_info="vegetarian"),
    ]
    return items[:count]
```

### Contact Form Test Data

```python
# src/tests/data/contact_forms.py

from dataclasses import dataclass

@dataclass
class ContactFormData:
    """Test data for contact form submissions."""
    name: str = ""
    email: str = ""
    subject: str = ""
    message: str = ""
    phone: str = ""
    
    def is_valid(self) -> bool:
        """Check if form data is valid."""
        return bool(self.name and self.email and self.message)
    
    def to_dict(self) -> dict:
        """Convert to dictionary for form submission."""
        return {k: v for k, v in self.__dict__.items() if v}

# Valid test data
VALID_CONTACT_DATA = ContactFormData(
    name="John Doe",
    email="john@example.com",
    subject="Menu Inquiry",
    message="I would like to know more about your vegetarian options."
)

# Invalid test data
INVALID_CONTACT_DATA = [
    ContactFormData(name="", email="test@example.com", subject="Test", message="Test"),  # Missing name
    ContactFormData(name="Test", email="invalid-email", subject="Test", message="Test"),  # Invalid email
    ContactFormData(name="Test", email="test@example.com", subject="", message=""),  # Missing message
]
```

---

## Testing Strategy

### Test Coverage Matrix

| Layer | Test Type | Tool | Coverage |
|-------|-----------|------|----------|
| UI/Frontend | Playwright tests | Playwright | Navigation, forms, interactions, visual layout |
| API | Integration tests | Python requests | Endpoints, status codes, response format, error cases |
| Database | Unit/integration tests | pytest + psycopg2 | Transactions, data isolation, fixtures, seeding |
| Configuration | Smoke tests | pytest | Service startup, environment setup, health checks |

### Test Execution Strategy

**Parallel Execution**:
- Default: 4 workers
- Configuration: Adjustable via pytest CLI
- Isolation: Each worker has isolated database transaction

**Retry Strategy**:
- Standard tests: 0 retries
- Flaky tests: 1 retry on failure
- Transient API errors: Automatic retry with exponential backoff

**Timeout Configuration**:
- Page loads: 10 seconds
- API requests: 5 seconds
- Database queries: 30 seconds
- Test execution: 5 minutes per test

### Test Data Strategy

**Seeding**:
- Database initialized with migrations on container startup
- Pre-seeded reference data (chefs, subscription plans)
- Per-test data generation via fixtures

**Cleanup**:
- Transaction rollback after each test
- Implicit cleanup (no manual teardown needed)
- Log retention for failed tests

### Evidence Collection

**Screenshots**:
- Captured on every UI test failure
- Stored in debug/ directory
- Attached to Allure report

**Logs**:
- Detailed logs for all test operations
- API request/response bodies
- Database query logs
- Stored in logs/ directory

**Network Activity**:
- HTTP request/response capture
- Stored for debugging network issues

### Flaky Test Handling

1. **Identification**: Tests with high retry rates flagged
2. **Analysis**: Review logs, screenshots, timing patterns
3. **Mitigation**: Increase timeouts, add waits, reduce test scope
4. **Configuration**: Mark with @pytest.mark.flaky for increased retries

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Test Suite Execution and Reporting

*For any set of discovered tests, the TestRunner SHALL execute all tests and generate JUnit XML reports containing test count, pass/fail counts, and execution times.*

**Validates: Requirements 1.3, 1.5**

### Property 2: Test Marker Categorization

*For any test decorated with a marker (ui, api, database, flaky), that marker SHALL be applied consistently, allowing tests to be filtered and executed by category.*

**Validates: Requirements 1.4**

### Property 3: Database Reset Mechanism

*For any database state modified during a test execution, invoking a reset mechanism SHALL restore the database to its pre-test state without requiring container rebuilds.*

**Validates: Requirements 2.3**

### Property 4: Network Isolation

*For any test database container, when network isolation is enabled, connections from outside the test network SHALL be rejected, while connections from containers within the network SHALL be allowed.*

**Validates: Requirements 2.4**

### Property 5: Service Dependency Resolution

*For any Docker Compose configuration with service dependencies, dependent services SHALL only become available after their dependencies report healthy status.*

**Validates: Requirements 2.6**

### Property 6: Environment Variable Configuration

*For any environment variables defined in Docker Compose or overrides, those variables SHALL be accessible to containers and affect service behavior as specified.*

**Validates: Requirements 2.7**

### Property 7: Fixture Execution and Isolation

*For any test marked with a function-scoped fixture, each test execution SHALL receive a fresh fixture instance, ensuring no state contamination between tests.*

**Validates: Requirements 3.2, 3.5**

### Property 8: Session-Scoped Fixture Reuse

*For any fixture marked as session-scoped, that fixture SHALL be initialized once at session start and reused across all test functions without re-initialization.*

**Validates: Requirements 3.4**

### Property 9: Fixture Setup and Teardown Order

*For any dependent fixtures, setup SHALL execute in dependency order, and teardown SHALL execute in reverse order, ensuring all dependencies are available when needed.*

**Validates: Requirements 3.6**

### Property 10: Parameterized Fixture Generation

*For any fixture with parameterization, multiple test instances SHALL be generated—one per parameter set—with each instance receiving the correct parameter values.*

**Validates: Requirements 3.7**

### Property 11: Page Navigation and Element Wait

*For any UI test navigating to a page, navigation SHALL complete successfully and all expected page elements SHALL become visible within the specified timeout.*

**Validates: Requirements 4.1**

### Property 12: Page Object Instantiation

*For any page object instantiated with a Playwright page context, that page object SHALL store the context and make it available for subsequent interactions.*

**Validates: Requirements 4.3**

### Property 13: Page Element Abstraction

*For any page object method interacting with page elements, that method SHALL use CSS selectors or data-testid attributes, abstracted into named methods to hide implementation details.*

**Validates: Requirements 4.5**

### Property 14: Menu Item Filtering

*For any filter applied to menu items (by category, dietary restriction), all returned items SHALL match the filter criteria, and items not matching SHALL be excluded.*

**Validates: Requirements 4.7, 5.2**

### Property 15: Contact Form Validation

*For any form submission with valid data, the form SHALL accept the submission and persist the data in the database; for any submission with invalid data, the form SHALL reject it and maintain current state.*

**Validates: Requirements 4.10, 5.6, 5.7**

### Property 16: UI Test Failure Screenshot

*For any UI test that fails, a screenshot SHALL be automatically captured and attached to the test result with a unique identifier.*

**Validates: Requirements 4.12**

### Property 17: API Response Format Compliance

*For any API GET request to a menu/chef/blog/subscription endpoint, the response SHALL be valid JSON containing all required fields for each item in the response.*

**Validates: Requirements 5.1, 5.4, 5.5, 5.8**

### Property 18: API Pagination Correctness

*For any GET request with pagination parameters (limit, offset), the response SHALL return the correct subset of items matching the requested offset and limit.*

**Validates: Requirements 5.3**

### Property 19: API Error Handling

*For any malformed request (invalid JSON, missing required fields, invalid filter values), the API SHALL respond with an appropriate error status code (400 or 422) and descriptive error messages.*

**Validates: Requirements 5.9, 5.10**

### Property 20: API Request/Response Logging

*For any API test completion, request and response details (headers, body, timing) SHALL be logged for debugging purposes.*

**Validates: Requirements 5.13**

### Property 21: Database Transaction Rollback (Round Trip)

*For any database modifications made within a transaction, invoking rollback after modifications SHALL restore the database to its exact pre-modification state.*

**Validates: Requirements 6.4**

### Property 22: Database Data Seeding

*For any parameterized dataset, seeding SHALL insert all specified records into the test database, making them available for test execution.*

**Validates: Requirements 6.2, 6.6**

### Property 23: Concurrent Test Data Isolation

*For any multiple concurrent test functions using database transactions, modifications made by one test SHALL not be visible to other concurrent tests.*

**Validates: Requirements 6.5**

### Property 24: Database Query Error Handling

*For any database query that fails during test setup, the fixture SHALL log the error, roll back any partial changes, and fail the test with diagnostic information.*

**Validates: Requirements 6.10**

### Property 25: Parallel Test Distribution

*For any test suite execution with N workers, tests SHALL be distributed across N workers such that test execution time is reduced relative to serial execution.*

**Validates: Requirements 7.4**

### Property 26: Test Report Generation and Artifacts

*For any test execution, an Allure report SHALL be generated from test results and stored as a workflow artifact for at least 30 days.*

**Validates: Requirements 7.5, 7.7**

### Property 27: Failure Report Attachments

*For any failed test, screenshots and error traces SHALL be included in the Allure report as attachments for debugging.*

**Validates: Requirements 7.8**

### Property 28: Workflow Completion Status

*For any test execution, when all tests pass, the workflow SHALL mark as successful; when any test fails, the workflow SHALL mark as failed.*

**Validates: Requirements 7.10**

### Property 29: Allure Result Collection

*For any test execution, Allure SHALL collect test results including pass/fail status, execution time, error details, and categorization metadata.*

**Validates: Requirements 8.1**

### Property 30: Allure Report Generation and Content

*For any completed test execution, Allure SHALL generate an HTML report containing test categorization, execution timeline, environment details, and summary statistics.*

**Validates: Requirements 8.3, 8.7**

### Property 31: Test Categorization and Filtering

*For any tests categorized by feature, marker, or endpoint, the Allure report SHALL organize tests accordingly and allow filtering by these categories.*

**Validates: Requirements 8.4, 8.9**

### Property 32: Flaky Test Aggregation

*For any test that fails and is retried, Allure SHALL aggregate all retry attempts and display the overall pass rate and retry count.*

**Validates: Requirements 8.6**

### Property 33: BasePage Timeout Application

*For any BasePage method invocation, the default timeout value of 10 seconds SHALL be applied to element waits, allowing configurable override.*

**Validates: Requirements 9.2**

### Property 34: Page Object Context Storage

*For any page object instantiation with a Playwright page context, that context SHALL be stored and accessible for all subsequent page interactions.*

**Validates: Requirements 9.4**

### Property 35: Page Element Validation

*For any page object interaction, expected page elements SHALL be validated for presence before interaction execution, raising descriptive exceptions if not found.*

**Validates: Requirements 9.6, 9.9**

### Property 36: Page Load Assertion

*For any page object, the assert_page_loaded method SHALL verify that key page elements are visible, confirming the page has loaded successfully.*

**Validates: Requirements 9.7**

### Property 37: Page Navigation Method Chaining

*For any page object method that navigates to another page, that method SHALL return a new page object instance for the destination page, enabling fluent test composition.*

**Validates: Requirements 9.8**

### Property 38: Test Retry Logic

*For any test marked as failing unexpectedly, retry logic SHALL automatically retry that test up to the configured retry count before marking it as failed.*

**Validates: Requirements 10.2**

### Property 39: Flaky Test Retry Increase

*For any test marked as flaky, the retry count SHALL be increased to accommodate transient failures, allowing tests to pass after retries.*

**Validates: Requirements 10.4**

### Property 40: JUnit XML Report Generation

*For any test execution, a JUnit XML report SHALL be generated containing all test results in a format compatible with GitHub Actions and Jenkins CI systems.*

**Validates: Requirements 10.5**

### Property 41: Test Filtering by Marker

*For any test filtering by marker (e.g., `pytest -m ui`), only tests decorated with that marker SHALL be executed.*

**Validates: Requirements 10.6**

### Property 42: Test Filtering by Pattern

*For any test filtering by regex pattern (e.g., `pytest -k menu`), only tests matching that pattern SHALL be executed.*

**Validates: Requirements 10.6**

### Property 43: Verbose Logging Capture

*For any test execution with verbose logging enabled, detailed logs SHALL be captured for page interactions, API calls, and database operations, accessible in test artifacts.*

**Validates: Requirements 10.7**

### Property 44: Code Coverage Report Generation

*For any test execution with coverage enabled, a coverage report SHALL be generated detailing code paths exercised during test execution.*

**Validates: Requirements 10.8**

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- Set up pytest configuration and markers
- Create Docker Compose environment with PostgreSQL and app server
- Implement BasePage class and basic page objects
- Create database fixtures and transaction management

### Phase 2: Test Suites (Week 3-4)
- Develop UI test suite with Playwright
- Develop API test suite with requests library
- Implement database test suite
- Create test data generators

### Phase 3: Reporting and CI/CD (Week 5-6)
- Integrate Allure reporting
- Configure GitHub Actions workflow
- Implement PR commenting and artifact storage
- Create debugging utilities and logging

### Phase 4: Optimization and Polish (Week 7-8)
- Performance optimization and parallel execution tuning
- Flaky test identification and handling
- Test coverage analysis
- Documentation and examples

---

## Conclusion

This design provides a comprehensive, production-ready E2E testing infrastructure for the Get-Mumm platform. By combining pytest orchestration, Docker isolation, Playwright automation, and Allure reporting, the infrastructure enables fast, reliable, and maintainable test coverage across UI, API, and database layers. The Page Object Model pattern ensures tests remain maintainable as the application evolves, while GitHub Actions integration brings test results and visibility directly into the development workflow.

The correctness properties formalized in this design serve as executable specifications, enabling property-based testing that validates system behavior across a wide range of inputs and scenarios, moving beyond traditional example-based testing to provide stronger confidence in software correctness.
