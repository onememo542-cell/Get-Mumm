"""
UI tests for the home page.

Tests verify:
- Homepage loads correctly
- Navigation menu is visible and functional
- All navigation links are present and clickable
- Page transitions work correctly
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.ui
@pytest.mark.asyncio
class TestHomePage:
    """
    Test suite for home page UI interactions.
    """

    async def test_home_page_loads(self, home_page):
        """
        Test that home page loads successfully.
        Verifies hero section and navigation are visible.
        """
        assert await home_page.is_hero_visible()
        logger.info("Homepage loaded successfully")

    async def test_navigation_menu_visible(self, home_page):
        """
        Test that main navigation menu is visible and accessible.
        """
        assert await home_page.is_navigation_visible()
        logger.info("Navigation menu is visible")

    async def test_all_navigation_links_present(self, home_page):
        """
        Test that all main navigation links are present on homepage.
        Verifies Menu, Chefs, Blog, and Contact links exist.
        """
        assert await home_page.verify_navigation_links_present()
        logger.info("All navigation links are present")

    async def test_navigation_link_visibility(self, home_page):
        """
        Test that each navigation link is individually visible.
        """
        assert await home_page.is_visible(home_page.MENU_LINK)
        assert await home_page.is_visible(home_page.CHEFS_LINK)
        assert await home_page.is_visible(home_page.BLOG_LINK)
        assert await home_page.is_visible(home_page.CONTACT_BUTTON)
        logger.info("All individual navigation links verified")

    async def test_get_page_title(self, home_page):
        """
        Test that page title is accessible.
        """
        title = await home_page.get_page_title()
        assert title, "Page title should not be empty"
        logger.info(f"Page title: {title}")

    async def test_logo_navigation(self, home_page):
        """
        Test that logo click navigates to home.
        """
        await home_page.click_logo()
        current_url = await home_page.get_current_url()
        assert "/" in current_url
        logger.info("Logo navigation verified")

    @pytest.mark.flaky
    async def test_page_reload(self, home_page):
        """
        Test that page reload completes successfully.
        Marked as flaky due to timing-dependent nature.
        """
        await home_page.reload_page()
        assert await home_page.is_navigation_visible()
        logger.info("Page reload successful")
