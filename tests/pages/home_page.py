"""
HomePage object providing methods and selectors for home page interactions.

This module defines the HomePage class which inherits from BasePage and provides:
- Selectors for home page elements (navigation, hero, links)
- Navigation methods for accessing other pages
- Visibility checks for page elements
- Page load verification
"""

import logging
from playwright.async_api import Page
from .base_page import BasePage

logger = logging.getLogger(__name__)


class HomePage(BasePage):
    """
    Page object for the home page.
    Provides methods to interact with home page elements and navigate to other pages.
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
        """
        Initialize HomePage object.

        Args:
            page: Playwright page object
        """
        super().__init__(page)
        logger.info("HomePage initialized")

    async def assert_page_loaded(self) -> None:
        """
        Verify that home page has fully loaded.
        
        Checks for visibility of:
        - Hero section
        - Main navigation menu

        Raises:
            AssertionError: If critical page elements are not visible
        """
        logger.info("Verifying home page has loaded...")
        
        hero_loaded = await self.wait_for_element(self.HERO_SECTION)
        nav_loaded = await self.wait_for_element(self.NAVIGATION_MENU)
        
        assert hero_loaded, "Hero section not visible"
        assert nav_loaded, "Navigation menu not visible"
        
        logger.info("Home page successfully loaded")

    async def click_menu_link(self):
        """
        Click the menu link and navigate to menu page.

        Returns:
            MenuPage: The menu page object for method chaining

        Raises:
            Exception: If menu link not found or click fails
        """
        logger.info("Clicking menu link...")
        await self.click(self.MENU_LINK)
        await self.wait_for_navigation()
        
        # Import here to avoid circular imports
        from .menu_page import MenuPage
        return MenuPage(self.page)

    async def click_chefs_link(self):
        """
        Click the chefs link and navigate to chefs page.

        Returns:
            ChefsPage: The chefs page object for method chaining

        Raises:
            Exception: If chefs link not found or click fails
        """
        logger.info("Clicking chefs link...")
        await self.click(self.CHEFS_LINK)
        await self.wait_for_navigation()
        
        # Import here to avoid circular imports
        from .chefs_page import ChefsPage
        return ChefsPage(self.page)

    async def click_blog_link(self):
        """
        Click the blog link and navigate to blog page.

        Returns:
            BlogPage: The blog page object for method chaining

        Raises:
            Exception: If blog link not found or click fails
        """
        logger.info("Clicking blog link...")
        await self.click(self.BLOG_LINK)
        await self.wait_for_navigation()
        
        # Import here to avoid circular imports
        from .blog_page import BlogPage
        return BlogPage(self.page)

    async def click_contact_button(self):
        """
        Click the contact button and navigate to contact page.

        Returns:
            ContactPage: The contact page object for method chaining

        Raises:
            Exception: If contact button not found or click fails
        """
        logger.info("Clicking contact button...")
        await self.click(self.CONTACT_BUTTON)
        await self.wait_for_navigation()
        
        # Import here to avoid circular imports
        from .contact_page import ContactPage
        return ContactPage(self.page)

    async def is_navigation_visible(self) -> bool:
        """
        Check if main navigation menu is visible.

        Returns:
            bool: True if navigation is visible, False otherwise
        """
        logger.info("Checking if navigation menu is visible...")
        return await self.is_visible(self.NAVIGATION_MENU)

    async def click_logo(self) -> None:
        """
        Click the main logo (typically returns to home).

        Raises:
            Exception: If logo not found or click fails
        """
        logger.info("Clicking main logo...")
        await self.click(self.MAIN_LOGO)
        await self.wait_for_navigation()
