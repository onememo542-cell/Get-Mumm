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
import aiohttp

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
    skip_database = pytest.mark.skip(reason="Database schema tests skipped - run separately")
    
    for item in items:
        # Add markers based on test file location
        if "ui" in str(item.fspath):
            item.add_marker(pytest.mark.ui)
        elif "api" in str(item.fspath):
            item.add_marker(pytest.mark.api)
        elif "database" in str(item.fspath):
            item.add_marker(pytest.mark.database)
            # Skip all database tests
            item.add_marker(skip_database)


# Hook for Allure reporting
def pytest_runtest_setup(item):
    """Setup for each test - add test metadata."""
    if hasattr(item, 'obj') and item.obj and hasattr(item.obj, '__doc__'):
        test_module = item.module.__name__
        pytest.test_module = test_module


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


# Environment configuration fixture
@pytest.fixture(scope="session")
def test_env():
    """
    Provides test environment configuration.
    Loads from environment variables with sensible defaults.
    """
    return {
        "db_host": os.getenv("DB_HOST", "localhost"),
        "db_port": int(os.getenv("DB_PORT", "5433")),
        "db_name": os.getenv("DB_NAME", "test_db"),
        "db_user": os.getenv("DB_USER", "test_user"),
        "db_password": os.getenv("DB_PASSWORD", "test_password"),
        "api_url": os.getenv("API_BASE_URL", "http://localhost:3001"),
        "frontend_url": os.getenv("FRONTEND_BASE_URL", "http://localhost:3000"),
    }


# Import database fixtures from fixtures module
from tests.fixtures.database import db_connection_pool, db_transaction


# API client fixtures - import from fixtures module
from tests.fixtures.api_client import APIClient, api_session, api_client as api_client_fixture, authenticated_api_client

# Override api_client to work with environment
@pytest.fixture(scope="function")
async def api_client():
    """
    Function-scoped API client.
    Provides HTTP client for API testing with base URL and headers.
    """
    base_url = os.getenv("API_BASE_URL", "http://localhost:3001")
    
    connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
    timeout = aiohttp.ClientTimeout(total=30)
    
    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        client = APIClient(base_url=base_url, session=session)
        logger.info(f"API client initialized with base URL: {base_url}")
        
        yield client
        
        # Session cleanup is automatic with context manager


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


# Seeding fixtures - import from fixtures module
from tests.fixtures.database import seed_menu_items as _seed_menu_items, seed_chefs as _seed_chefs, seed_blog_posts as _seed_blog_posts

@pytest.fixture(scope="function")
async def seed_menu_items(db_transaction):
    """Seed menu items into database."""
    items = await _seed_menu_items(db_transaction)
    logger.info(f"Seeded {len(items) if items else 0} menu items")
    return items


@pytest.fixture(scope="function")
async def seed_chefs(db_transaction):
    """Seed chefs into database."""
    chefs = await _seed_chefs(db_transaction)
    logger.info(f"Seeded {len(chefs) if chefs else 0} chefs")
    return chefs


@pytest.fixture(scope="function")
async def seed_blog_posts(db_transaction):
    """Seed blog posts into database."""
    posts = await _seed_blog_posts(db_transaction)
    logger.info(f"Seeded {len(posts) if posts else 0} blog posts")
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


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook to capture test outcomes and attach artifacts to Allure."""
    outcome = yield
    report = outcome.get_result()
    
    if not ALLURE_AVAILABLE:
        return
    
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

