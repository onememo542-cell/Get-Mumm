"""
Global pytest configuration and fixtures for E2E testing (Python-based).

This module provides:
- pytest configuration for test discovery and execution
- Global fixtures for API clients and data management
- Test markers and filtering
- Logging and debugging utilities
- Allure reporting integration
- MCP client for database operations via backend API
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


# ============================================================================
# PYTEST CONFIGURATION
# ============================================================================

def pytest_configure(config):
    """Configure pytest markers and settings."""
    config.addinivalue_line("markers", "ui: UI tests with Playwright")
    config.addinivalue_line("markers", "api: API tests using HTTP client")
    config.addinivalue_line("markers", "integration: Integration tests")
    config.addinivalue_line("markers", "smoke: Smoke tests for quick validation")
    config.addinivalue_line("markers", "flaky: Flaky/unreliable tests")
    config.addinivalue_line("markers", "slow: Slow running tests")


def pytest_collection_modifyitems(config, items):
    """Add markers to tests based on file location."""
    for item in items:
        # Auto-mark tests based on directory location
        if "ui" in str(item.fspath):
            item.add_marker(pytest.mark.ui)
        elif "api" in str(item.fspath):
            item.add_marker(pytest.mark.api)
        elif "integration" in str(item.fspath):
            item.add_marker(pytest.mark.integration)


# ============================================================================
# TEST SESSION HOOKS
# ============================================================================

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


# ============================================================================
# ENVIRONMENT CONFIGURATION
# ============================================================================

@pytest.fixture(scope="session")
def test_config():
    """
    Session-scoped test configuration from environment variables.
    Returns a dict with all required test URLs and credentials.
    """
    config = {
        "api_base_url": os.getenv("API_BASE_URL", "http://localhost:3001"),
        "frontend_base_url": os.getenv("FRONTEND_BASE_URL", "http://localhost:3000"),
        "mcp_api_key": os.getenv("MCP_API_KEY", "test-key-12345"),
        "browser_headless": os.getenv("BROWSER_HEADLESS", "true").lower() == "true",
        "browser_timeout": int(os.getenv("BROWSER_TIMEOUT", "30000")),
        "api_timeout": int(os.getenv("API_TIMEOUT", "5000")),
    }
    
    logger.info(f"Test configuration loaded: API={config['api_base_url']}, Frontend={config['frontend_base_url']}")
    return config


# ============================================================================
# MCP CLIENT FIXTURE
# ============================================================================

@pytest.fixture(scope="function")
async def mcp_client(test_config):
    """
    Function-scoped MCP client for database operations via backend API.
    Uses aiohttp for async HTTP requests to backend MCP endpoints.
    """
    from tests.fixtures.mcp_client import MCPClient
    
    client = MCPClient(
        base_url=test_config["api_base_url"],
        api_key=test_config["mcp_api_key"]
    )
    
    logger.info(f"MCP client initialized with base URL: {test_config['api_base_url']}")
    
    yield client
    
    # Cleanup (connection pool cleanup is automatic)
    await client.close()


# ============================================================================
# HTTP API CLIENT FIXTURE
# ============================================================================

@pytest.fixture(scope="function")
async def http_client(test_config):
    """
    Function-scoped HTTP client for direct API testing.
    Provides aiohttp session with configured timeout and connection pool.
    """
    connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
    timeout = aiohttp.ClientTimeout(total=test_config["api_timeout"] / 1000)
    
    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        logger.info(f"HTTP client session created")
        yield session
    
    logger.info(f"HTTP client session closed")


# ============================================================================
# PLAYWRIGHT FIXTURES
# ============================================================================

@pytest.fixture(scope="function")
async def browser(test_config):
    """
    Function-scoped Playwright browser instance.
    Launches Chromium browser with configured headless mode.
    """
    from playwright.async_api import async_playwright
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=test_config["browser_headless"]
        )
        logger.info("Playwright browser launched")
        
        yield browser
        
        await browser.close()
        logger.info("Playwright browser closed")


@pytest.fixture(scope="function")
async def page(browser, test_config):
    """
    Function-scoped Playwright page with viewport and base URL.
    Provides a single page instance for UI tests.
    """
    context = await browser.new_context(
        viewport={"width": 1280, "height": 720}
    )
    page = await context.new_page()
    
    # Configure base URL for navigation
    page.base_url = test_config["frontend_base_url"]
    
    logger.info(f"Page created with base URL: {test_config['frontend_base_url']}")
    
    yield page
    
    # Cleanup
    await page.close()
    await context.close()
    logger.info("Page and context closed")


# ============================================================================
# PAGE OBJECT FIXTURES
# ============================================================================

@pytest.fixture(scope="function")
def home_page(page):
    """HomePage page object."""
    from tests.pages.home_page import HomePage
    return HomePage(page)


@pytest.fixture(scope="function")
def menu_page(page):
    """MenuPage page object."""
    from tests.pages.menu_page import MenuPage
    return MenuPage(page)


@pytest.fixture(scope="function")
def chefs_page(page):
    """ChefsPage page object."""
    from tests.pages.chefs_page import ChefsPage
    return ChefsPage(page)


@pytest.fixture(scope="function")
def blog_page(page):
    """BlogPage page object."""
    from tests.pages.blog_page import BlogPage
    return BlogPage(page)


@pytest.fixture(scope="function")
def contact_page(page):
    """ContactPage page object."""
    from tests.pages.contact_page import ContactPage
    return ContactPage(page)


@pytest.fixture(scope="function")
def subscriptions_page(page):
    """SubscriptionsPage page object."""
    from tests.pages.subscriptions_page import SubscriptionsPage
    return SubscriptionsPage(page)


# ============================================================================
# DATA SEEDING FIXTURES
# ============================================================================

@pytest.fixture(scope="function")
async def seed_menu_items(mcp_client, http_client, test_config):
    """
    Seed menu items into database via MCP client.
    Creates test menu items and returns them.
    """
    from tests.fixtures.data_factory import TestDataFactory
    
    factory = TestDataFactory()
    items = factory.create_menu_items(count=5)
    
    await mcp_client.insert("menu_items", items)
    logger.info(f"Seeded {len(items)} menu items")
    
    return items


@pytest.fixture(scope="function")
async def seed_chefs(mcp_client, http_client, test_config):
    """
    Seed chefs into database via MCP client.
    Creates test chef profiles and returns them.
    """
    from tests.fixtures.data_factory import TestDataFactory
    
    factory = TestDataFactory()
    chefs = factory.create_chefs(count=3)
    
    await mcp_client.insert("chefs", chefs)
    logger.info(f"Seeded {len(chefs)} chefs")
    
    return chefs


@pytest.fixture(scope="function")
async def seed_blog_posts(mcp_client, http_client, test_config):
    """
    Seed blog posts into database via MCP client.
    Creates test blog posts and returns them.
    """
    from tests.fixtures.data_factory import TestDataFactory
    
    factory = TestDataFactory()
    posts = factory.create_blog_posts(count=4)
    
    await mcp_client.insert("blog_posts", posts)
    logger.info(f"Seeded {len(posts)} blog posts")
    
    return posts


# ============================================================================
# PARAMETERIZED FIXTURES
# ============================================================================

@pytest.fixture(params=["vegetarian", "vegan", "gluten-free", "keto"])
def dietary_category(request):
    """Parameterized dietary category for data variation testing."""
    return request.param


@pytest.fixture(params=["breakfast", "lunch", "dinner", "dessert"])
def meal_category(request):
    """Parameterized meal category for data variation testing."""
    return request.param


@pytest.fixture(params=["basic", "premium", "enterprise"])
def subscription_tier(request):
    """Parameterized subscription tier for data variation testing."""
    return request.param


# ============================================================================
# TEST DATA FACTORY FIXTURE
# ============================================================================

@pytest.fixture(scope="function")
def test_data_factory():
    """Fixture providing test data factory for creating test objects."""
    from tests.fixtures.data_factory import TestDataFactory
    return TestDataFactory()


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
    
    # Attach test markers as Allure labels
    for marker in item.iter_markers():
        if marker.name in ["ui", "api", "integration", "smoke"]:
            try:
                allure.dynamic.label("type", marker.name)
            except Exception as e:
                logger.debug(f"Could not add Allure label: {str(e)}")
    
    # Mark test status in Allure
    if report.when == "call":
        if report.outcome == "passed":
            try:
                allure.dynamic.label("status", "passed")
            except Exception:
                pass
        elif report.outcome == "failed":
            try:
                allure.dynamic.label("status", "failed")
            except Exception:
                pass
        elif report.outcome == "skipped":
            try:
                allure.dynamic.label("status", "skipped")
            except Exception:
                pass


@pytest.fixture(scope="session")
def allure_utils():
    """Fixture providing Allure reporting utilities."""
    if not ALLURE_AVAILABLE:
        return None
    
    class AllureUtils:
        """Helper class for Allure report attachments."""
        
        @staticmethod
        def attach_screenshot(image_bytes, name="Screenshot"):
            """Attach PNG screenshot to Allure report."""
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
            """Attach plain text to Allure report."""
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
            """Attach JSON data to Allure report."""
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
    
    return AllureUtils()

