"""
Global pytest configuration and fixtures for E2E testing.

This module provides:
- pytest configuration for test discovery and execution
- Global fixtures for database, API client, and page objects
- Test markers and filtering
- Logging and debugging utilities
- Allure reporting integration
"""

import pytest
import logging
import sys
import os
from pathlib import Path
import asyncio

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(Path(__file__).parent / 'test_execution.log')
    ]
)

logger = logging.getLogger(__name__)

# Pytest markers
def pytest_configure(config):
    """Configure pytest markers."""
    config.addinivalue_line("markers", "ui: mark test as UI test")
    config.addinivalue_line("markers", "api: mark test as API test")
    config.addinivalue_line("markers", "database: mark test as database test")
    config.addinivalue_line("markers", "smoke: mark test as smoke test")
    config.addinivalue_line("markers", "flaky: mark test as flaky/unreliable")
    config.addinivalue_line("markers", "slow: mark test as slow running")


# Hook for test collection
def pytest_collection_modifyitems(config, items):
    """Add markers to tests based on file location."""
    for item in items:
        # Add markers based on test file location
        if "ui" in str(item.fspath):
            item.add_marker(pytest.mark.ui)
        elif "api" in str(item.fspath):
            item.add_marker(pytest.mark.api)
        elif "database" in str(item.fspath):
            item.add_marker(pytest.mark.database)


# Hook for Allure reporting
def pytest_runtest_setup(item):
    """Setup for each test - add test metadata."""
    if hasattr(item, 'module'):
        test_module = item.module.__name__
        pytest.test_module = test_module
        
        # Allure title and description
        if item.docstring:
            item.add_marker(pytest.mark.description(item.docstring))


# Event listeners for Allure
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Capture test results for reporting."""
    outcome = yield
    rep = outcome.get_result()
    
    # Add test outcome to report
    if rep.when == "call":
        if hasattr(item, 'obj') and item.obj.__doc__:
            rep.description = item.obj.__doc__


# Database fixtures
@pytest.fixture(scope="session")
def db_connection_pool():
    """
    Session-scoped database connection pool.
    Provides connection pooling for all tests in session.
    """
    from tests.fixtures.database import get_connection_pool
    
    pool = get_connection_pool()
    logger.info("Database connection pool created")
    
    yield pool
    
    # Cleanup
    if hasattr(pool, 'close'):
        pool.close()
    logger.info("Database connection pool closed")


@pytest.fixture(scope="function")
async def db_transaction(db_connection_pool):
    """
    Function-scoped database transaction.
    Creates a new transaction for each test and rolls back automatically.
    """
    from tests.fixtures.database import get_transaction
    
    transaction = get_transaction(db_connection_pool)
    logger.info("Database transaction started")
    
    yield transaction
    
    # Cleanup - rollback to restore state
    try:
        transaction.rollback()
        logger.info("Database transaction rolled back")
    except Exception as e:
        logger.error(f"Error rolling back transaction: {str(e)}")


# API client fixtures
@pytest.fixture(scope="function")
async def api_client():
    """
    Function-scoped API client.
    Provides HTTP client for API testing with base URL and headers.
    """
    from tests.fixtures.api_client import APIClient
    
    base_url = os.getenv("API_BASE_URL", "http://localhost:3001")
    client = APIClient(base_url=base_url)
    
    logger.info(f"API client initialized with base URL: {base_url}")
    
    yield client
    
    # Cleanup
    if hasattr(client, 'close'):
        await client.close()
    logger.info("API client closed")


# Playwright page object fixtures
@pytest.fixture(scope="function")
async def home_page(page):
    """HomePage page object fixture."""
    from tests.pages.home_page import HomePage
    return HomePage(page)


@pytest.fixture(scope="function")
async def menu_page(page):
    """MenuPage page object fixture."""
    from tests.pages.menu_page import MenuPage
    return MenuPage(page)


@pytest.fixture(scope="function")
async def chefs_page(page):
    """ChefsPage page object fixture."""
    from tests.pages.chefs_page import ChefsPage
    return ChefsPage(page)


@pytest.fixture(scope="function")
async def blog_page(page):
    """BlogPage page object fixture."""
    from tests.pages.blog_page import BlogPage
    return BlogPage(page)


@pytest.fixture(scope="function")
async def contact_page(page):
    """ContactPage page object fixture."""
    from tests.pages.contact_page import ContactPage
    return ContactPage(page)


@pytest.fixture(scope="function")
async def subscriptions_page(page):
    """SubscriptionsPage page object fixture."""
    from tests.pages.subscriptions_page import SubscriptionsPage
    return SubscriptionsPage(page)


# Playwright browser and page fixtures
@pytest.fixture(scope="session")
def event_loop():
    """Event loop for async tests."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def browser():
    """Session-scoped Playwright browser."""
    from playwright.async_api import async_playwright
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        logger.info("Browser launched")
        
        yield browser
        
        await browser.close()
        logger.info("Browser closed")


@pytest.fixture(scope="function")
async def page(browser):
    """Function-scoped Playwright page with viewport."""
    context = await browser.new_context(viewport={"width": 1280, "height": 720})
    page = await context.new_page()
    
    # Set base URL
    base_url = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")
    
    logger.info(f"Page created for base URL: {base_url}")
    
    yield page
    
    # Cleanup
    await page.close()
    await context.close()
    logger.info("Page and context closed")


# Seeding fixtures
@pytest.fixture(scope="function")
async def seed_menu_items(db_transaction):
    """Seed menu items into database."""
    from tests.fixtures.database import seed_menu_items
    
    items = await seed_menu_items(db_transaction)
    logger.info(f"Seeded {len(items)} menu items")
    
    return items


@pytest.fixture(scope="function")
async def seed_chefs(db_transaction):
    """Seed chefs into database."""
    from tests.fixtures.database import seed_chefs
    
    chefs = await seed_chefs(db_transaction)
    logger.info(f"Seeded {len(chefs)} chefs")
    
    return chefs


@pytest.fixture(scope="function")
async def seed_blog_posts(db_transaction):
    """Seed blog posts into database."""
    from tests.fixtures.database import seed_blog_posts
    
    posts = await seed_blog_posts(db_transaction)
    logger.info(f"Seeded {len(posts)} blog posts")
    
    return posts


# Parameterized fixtures
@pytest.fixture(params=["vegetarian", "vegan", "gluten-free"])
def dietary_categories(request):
    """Parameterized dietary category fixture."""
    return request.param


@pytest.fixture(params=["breakfast", "lunch", "dinner"])
def meal_categories(request):
    """Parameterized meal category fixture."""
    return request.param


@pytest.fixture(params=["basic", "premium", "enterprise"])
def subscription_tiers(request):
    """Parameterized subscription tier fixture."""
    return request.param


# Utility fixtures
@pytest.fixture
def test_data_factory():
    """Factory for generating test data."""
    from tests.fixtures.data_factory import TestDataFactory
    return TestDataFactory()


# Test execution hooks
def pytest_sessionstart(session):
    """Called at test session start."""
    logger.info("=" * 80)
    logger.info("TEST SESSION STARTED")
    logger.info("=" * 80)


def pytest_sessionfinish(session, exitstatus):
    """Called at test session end."""
    logger.info("=" * 80)
    logger.info(f"TEST SESSION FINISHED - Exit Status: {exitstatus}")
    logger.info("=" * 80)


# Pytest-asyncio plugin configuration
pytestmark = pytest.mark.asyncio


# ============================================================================
# ALLURE REPORTING INTEGRATION
# ============================================================================

try:
    import allure
    ALLURE_AVAILABLE = True
except ImportError:
    ALLURE_AVAILABLE = False
    logger.warning("Allure not available - skipping Allure reporting")


def pytest_configure_allure(config):
    """Configure Allure reporting."""
    if not ALLURE_AVAILABLE:
        return
    
    # Create allure results directory
    allure_dir = Path("allure-results")
    allure_dir.mkdir(exist_ok=True)
    
    # Create environment.properties for Allure report
    from datetime import datetime
    environment_properties = allure_dir / "environment.properties"
    with open(environment_properties, "w") as f:
        f.write("Browser=Chromium\n")
        f.write("BrowserVersion=Latest\n")
        f.write("OS=Linux\n")
        f.write("Environment=Test\n")
        f.write(f"Timestamp={datetime.now().isoformat()}\n")
        f.write(f"Python Version={sys.version.split()[0]}\n")
    
    logger.info(f"Allure environment file created: {environment_properties}")


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport_allure(item, call):
    """Hook to capture test outcomes and attach artifacts to Allure."""
    if not ALLURE_AVAILABLE:
        yield
        return
    
    outcome = yield
    report = outcome.get_result()
    
    # Attach markers as labels
    for marker in item.iter_markers():
        if marker.name in ["ui", "api", "database"]:
            try:
                allure.dynamic.label(marker.name, marker.name.upper())
            except Exception as e:
                logger.debug(f"Could not add Allure label: {str(e)}")
    
    if report.when == "call":
        # Test passed
        if report.outcome == "passed":
            try:
                allure.dynamic.label("status", "passed")
            except:
                pass
        
        # Test failed
        elif report.outcome == "failed":
            try:
                allure.dynamic.label("status", "failed")
            except:
                pass
        
        # Test skipped
        elif report.outcome == "skipped":
            try:
                allure.dynamic.label("status", "skipped")
            except:
                pass


@pytest.fixture(scope="session")
def allure_report():
    """Fixture to provide Allure report utilities."""
    if not ALLURE_AVAILABLE:
        return None
    
    class AllureReporting:
        @staticmethod
        def attach_screenshot(image_bytes, name="Screenshot"):
            """Attach screenshot to Allure report."""
            try:
                allure.attach(
                    image_bytes,
                    name=name,
                    attachment_type=allure.attachment_type.PNG
                )
            except Exception as e:
                logger.debug(f"Could not attach screenshot: {str(e)}")
        
        @staticmethod
        def attach_text(text, name="Log"):
            """Attach text content to Allure report."""
            try:
                allure.attach(
                    text,
                    name=name,
                    attachment_type=allure.attachment_type.TEXT
                )
            except Exception as e:
                logger.debug(f"Could not attach text: {str(e)}")
        
        @staticmethod
        def attach_json(json_obj, name="Data"):
            """Attach JSON to Allure report."""
            try:
                import json
                json_str = json.dumps(json_obj, indent=2)
                allure.attach(
                    json_str,
                    name=name,
                    attachment_type=allure.attachment_type.JSON
                )
            except Exception as e:
                logger.debug(f"Could not attach JSON: {str(e)}")
        
        @staticmethod
        def add_description(text):
            """Add description to current test."""
            try:
                allure.dynamic.description(text)
            except Exception as e:
                logger.debug(f"Could not add description: {str(e)}")
    
    return AllureReporting()

