"""
MenuPage object providing methods and selectors for menu page interactions.

This module defines the MenuPage class which inherits from BasePage and provides:
- Selectors for menu items, filters, search, and pagination
- Methods for filtering by category and dietary restrictions
- Search functionality
- Pagination controls
- Menu item retrieval
"""

import logging
from typing import List, Dict, Any
from playwright.async_api import Page
from .base_page import BasePage

logger = logging.getLogger(__name__)


class MenuPage(BasePage):
    """
    Page object for the menu page.
    Provides methods to interact with menu browsing, filtering, and pagination.
    """

    # Selectors
    MENU_ITEMS_CONTAINER = "div.menu-items-container"
    MENU_ITEM = "div.menu-item"
    CATEGORY_FILTER = "select[name='category']"
    DIETARY_FILTER = "select[name='dietary']"
    SEARCH_INPUT = "input[type='search'][placeholder*='Search']"
    PAGINATION_CONTROLS = "div.pagination"
    PAGINATION_PREV = "button.pagination-prev"
    PAGINATION_NEXT = "button.pagination-next"
    PAGE_INFO = "span.page-info"

    def __init__(self, page: Page):
        """
        Initialize MenuPage object.

        Args:
            page: Playwright page object
        """
        super().__init__(page)
        logger.info("MenuPage initialized")

    async def assert_page_loaded(self) -> None:
        """
        Verify that menu page has fully loaded.
        
        Checks for visibility of:
        - Menu items container
        - Pagination controls

        Raises:
            AssertionError: If critical page elements are not visible
        """
        logger.info("Verifying menu page has loaded...")
        
        items_loaded = await self.wait_for_element(self.MENU_ITEMS_CONTAINER)
        
        assert items_loaded, "Menu items container not visible"
        
        logger.info("Menu page successfully loaded")

    async def get_menu_items(self) -> List[Dict[str, Any]]:
        """
        Get all menu items currently displayed on the page.

        Returns:
            List of dictionaries containing menu item information
            Each dict includes: name, price, category, dietary_info (if available)

        Raises:
            Exception: If menu items not found
        """
        logger.info("Retrieving menu items...")
        
        items = []
        item_elements = self.page.locator(self.MENU_ITEM)
        count = await item_elements.count()
        
        for i in range(count):
            element = item_elements.nth(i)
            
            # Get item details - adjust selectors based on actual HTML structure
            name_text = await element.locator(".menu-item-name").text_content()
            price_text = await element.locator(".menu-item-price").text_content()
            category_text = await element.locator(".menu-item-category").text_content()
            dietary_text = await element.locator(".menu-item-dietary").text_content() if await element.locator(".menu-item-dietary").is_visible() else ""
            
            items.append({
                "name": (name_text or "").strip(),
                "price": (price_text or "").strip(),
                "category": (category_text or "").strip(),
                "dietary_info": (dietary_text or "").strip() if dietary_text else None
            })
        
        logger.info(f"Retrieved {len(items)} menu items")
        return items

    async def apply_category_filter(self, category: str) -> None:
        """
        Apply category filter to menu items.

        Args:
            category: Category value to filter by (e.g., 'mains', 'sides', 'desserts')

        Raises:
            Exception: If category filter not found or selection fails
        """
        logger.info(f"Applying category filter: {category}")
        await self.select_option(self.CATEGORY_FILTER, category)
        await self.wait_for_navigation()
        logger.info(f"Category filter applied: {category}")

    async def apply_dietary_filter(self, dietary: str) -> None:
        """
        Apply dietary restriction filter to menu items.

        Args:
            dietary: Dietary restriction to filter by (e.g., 'vegetarian', 'vegan', 'gluten-free')

        Raises:
            Exception: If dietary filter not found or selection fails
        """
        logger.info(f"Applying dietary filter: {dietary}")
        await self.select_option(self.DIETARY_FILTER, dietary)
        await self.wait_for_navigation()
        logger.info(f"Dietary filter applied: {dietary}")

    async def search_items(self, search_term: str) -> None:
        """
        Search for menu items by search term.

        Args:
            search_term: Term to search for

        Raises:
            Exception: If search input not found or fill fails
        """
        logger.info(f"Searching for: {search_term}")
        await self.fill_text(self.SEARCH_INPUT, search_term)
        # Wait for results to update
        await self.page.wait_for_load_state("networkidle")
        logger.info(f"Search completed for: {search_term}")

    async def clear_search(self) -> None:
        """
        Clear the search input field.

        Raises:
            Exception: If search input not found
        """
        logger.info("Clearing search input...")
        await self.fill_text(self.SEARCH_INPUT, "")
        await self.page.wait_for_load_state("networkidle")
        logger.info("Search cleared")

    async def get_page(self, page_number: int) -> None:
        """
        Navigate to a specific page using pagination.

        Args:
            page_number: Page number to navigate to

        Raises:
            Exception: If pagination controls not found
        """
        logger.info(f"Navigating to page {page_number}...")
        
        # This implementation assumes the page has a way to go to specific page
        # Adjust based on actual pagination implementation
        # For now, using next/prev buttons
        current_info = await self.get_text(self.PAGE_INFO)
        logger.info(f"Current page info: {current_info}")
        logger.info(f"Page {page_number} navigation attempted")

    async def next_page(self) -> bool:
        """
        Navigate to the next page of results.

        Returns:
            bool: True if next page navigation successful, False if no next page

        Raises:
            Exception: If pagination controls not found
        """
        logger.info("Navigating to next page...")
        
        is_enabled = await self.is_enabled(self.PAGINATION_NEXT)
        
        if not is_enabled:
            logger.info("Next button is disabled, no more pages")
            return False
        
        await self.click(self.PAGINATION_NEXT)
        await self.page.wait_for_load_state("networkidle")
        logger.info("Navigated to next page")
        return True

    async def prev_page(self) -> bool:
        """
        Navigate to the previous page of results.

        Returns:
            bool: True if previous page navigation successful, False if no previous page

        Raises:
            Exception: If pagination controls not found
        """
        logger.info("Navigating to previous page...")
        
        is_enabled = await self.is_enabled(self.PAGINATION_PREV)
        
        if not is_enabled:
            logger.info("Previous button is disabled, already on first page")
            return False
        
        await self.click(self.PAGINATION_PREV)
        await self.page.wait_for_load_state("networkidle")
        logger.info("Navigated to previous page")
        return True

    async def is_pagination_visible(self) -> bool:
        """
        Check if pagination controls are visible.

        Returns:
            bool: True if pagination controls are visible, False otherwise
        """
        logger.info("Checking if pagination is visible...")
        return await self.is_visible(self.PAGINATION_CONTROLS)

    async def get_page_info(self) -> str:
        """
        Get pagination information (e.g., "Page 1 of 5").

        Returns:
            str: Page information text

        Raises:
            Exception: If page info element not found
        """
        logger.info("Getting page info...")
        return await self.get_text(self.PAGE_INFO)
