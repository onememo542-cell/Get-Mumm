"""
Playwright browser and page fixtures for UI testing.

This module provides:
- Browser fixture (session-scoped)
- Page fixture (function-scoped)
- Page object fixtures for each application page
"""

import pytest
import logging
from playwright.async_api import async_playwright, Browser, Page

logger = logging.getLogger(__name__)


@pytest.fixture(scope="session")
async def browser():
    """
    Session-scoped fixture for Playwright browser instance.
    Launched once per test session and reused for all tests.
    Uses Chromium browser in headless mode.

    Yields:
        Playwright Browser object
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        logger.info("Browser launched (Chromium, headless mode)")
        yield browser
        await browser.close()
        logger.info("Browser closed")


@pytest.fixture(scope="function")
async def page(browser: Browser, test_env) -> Page:
    """
    Function-scoped fixture creating a new browser page for each test.
    Provides test isolation at the browser context level.
    Sets consistent viewport size for reproducible screenshots.

    Args:
        browser: Session-scoped browser instance
        test_env: Test environment configuration

    Yields:
        Playwright Page object
    """
    context = await browser.new_context(
        viewport={"width": 1280, "height": 720},
        ignore_https_errors=True
    )
    page = await context.new_page()
    logger.info("New browser page created (1280x720 viewport)")

    yield page

    # Cleanup
    try:
        await page.close()
        await context.close()
        logger.info("Browser page and context closed")
    except Exception as e:
        logger.error(f"Error during page cleanup: {str(e)}")


@pytest.fixture(scope="function")
async def home_page(page: Page, test_env):
    """
    Function-scoped fixture for HomePage object.
    Initializes and navigates to homepage, verifies page loaded.

    Args:
        page: Function-scoped page fixture
        test_env: Test environment configuration

    Yields:
        HomePage object ready for testing
    """
    from tests.pages.home_page import HomePage

    home = HomePage(page, base_url=test_env["app_url"])
    await home.navigate_to("/")
    await home.assert_page_loaded()
    logger.info("HomePage fixture ready")
    yield home


@pytest.fixture(scope="function")
async def menu_page(page: Page, test_env):
    """
    Function-scoped fixture for MenuPage object.
    Initializes and navigates to menu page, verifies page loaded.

    Args:
        page: Function-scoped page fixture
        test_env: Test environment configuration

    Yields:
        MenuPage object ready for testing
    """
    from tests.pages.menu_page import MenuPage

    menu = MenuPage(page, base_url=test_env["app_url"])
    await menu.navigate_to("/menu")
    await menu.assert_page_loaded()
    logger.info("MenuPage fixture ready")
    yield menu


@pytest.fixture(scope="function")
async def chefs_page(page: Page, test_env):
    """
    Function-scoped fixture for ChefsPage object.

    Args:
        page: Function-scoped page fixture
        test_env: Test environment configuration

    Yields:
        ChefsPage object ready for testing
    """
    from tests.pages.chefs_page import ChefsPage

    chefs = ChefsPage(page, base_url=test_env["app_url"])
    await chefs.navigate_to("/chefs")
    await chefs.assert_page_loaded()
    logger.info("ChefsPage fixture ready")
    yield chefs


@pytest.fixture(scope="function")
async def blog_page(page: Page, test_env):
    """
    Function-scoped fixture for BlogPage object.

    Args:
        page: Function-scoped page fixture
        test_env: Test environment configuration

    Yields:
        BlogPage object ready for testing
    """
    from tests.pages.blog_page import BlogPage

    blog = BlogPage(page, base_url=test_env["app_url"])
    await blog.navigate_to("/blog")
    await blog.assert_page_loaded()
    logger.info("BlogPage fixture ready")
    yield blog


@pytest.fixture(scope="function")
async def contact_page(page: Page, test_env):
    """
    Function-scoped fixture for ContactPage object.

    Args:
        page: Function-scoped page fixture
        test_env: Test environment configuration

    Yields:
        ContactPage object ready for testing
    """
    from tests.pages.contact_page import ContactPage

    contact = ContactPage(page, base_url=test_env["app_url"])
    await contact.navigate_to("/contact")
    await contact.assert_page_loaded()
    logger.info("ContactPage fixture ready")
    yield contact


@pytest.fixture(scope="function")
async def subscriptions_page(page: Page, test_env):
    """
    Function-scoped fixture for SubscriptionsPage object.

    Args:
        page: Function-scoped page fixture
        test_env: Test environment configuration

    Yields:
        SubscriptionsPage object ready for testing
    """
    from tests.pages.subscriptions_page import SubscriptionsPage

    subscriptions = SubscriptionsPage(page, base_url=test_env["app_url"])
    await subscriptions.navigate_to("/subscriptions")
    await subscriptions.assert_page_loaded()
    logger.info("SubscriptionsPage fixture ready")
    yield subscriptions
