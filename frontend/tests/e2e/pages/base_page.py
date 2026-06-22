"""
Base page object class providing common methods for all page objects.

This module provides:
- Common navigation and element interaction methods
- Default timeout configuration
- Screenshot capture for debugging
- Wait utilities for element visibility
"""

import logging
from typing import Optional
from playwright.async_api import Page, Locator

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
        logger.info(f"Initialized {self.__class__.__name__} with base URL: {base_url}")

    async def navigate_to(self, path: str = "/") -> None:
        """
        Navigate to a specific path on the application.

        Args:
            path: The path to navigate to (relative to base_url)

        Raises:
            Exception: If navigation fails or times out
        """
        url = f"{self.base_url}{path}"
        await self.page.goto(url, wait_until="networkidle")
        logger.info(f"Navigated to {url}")

    async def find_element(self, selector: str) -> Locator:
        """
        Find and wait for an element by CSS selector.

        Args:
            selector: CSS selector string

        Returns:
            Playwright Locator object

        Raises:
            Exception: If element is not found within timeout
        """
        element = self.page.locator(selector)
        await element.wait_for(state="visible")
        logger.debug(f"Found element: {selector}")
        return element

    async def wait_for_element(self, selector: str, timeout: Optional[int] = None) -> bool:
        """
        Wait for element to appear on page.

        Args:
            selector: CSS selector string
            timeout: Optional custom timeout in milliseconds

        Returns:
            True if element found, False if timeout exceeded
        """
        timeout_ms = timeout if timeout else self.DEFAULT_TIMEOUT
        try:
            await self.page.wait_for_selector(selector, timeout=timeout_ms)
            logger.debug(f"Element appeared: {selector}")
            return True
        except Exception as e:
            logger.warning(f"Element not found within {timeout_ms}ms: {selector} - {str(e)}")
            return False

    async def click(self, selector: str) -> None:
        """
        Click an element identified by selector.

        Args:
            selector: CSS selector string

        Raises:
            Exception: If element not found or click fails
        """
        element = await self.find_element(selector)
        await element.click()
        logger.info(f"Clicked element: {selector}")

    async def fill_text(self, selector: str, text: str) -> None:
        """
        Fill text input field.

        Args:
            selector: CSS selector string
            text: Text to fill

        Raises:
            Exception: If element not found or fill fails
        """
        element = await self.find_element(selector)
        await element.fill(text)
        logger.info(f"Filled text in {selector}: {text[:30]}{'...' if len(text) > 30 else ''}")

    async def get_text(self, selector: str) -> str:
        """
        Get text content from an element.

        Args:
            selector: CSS selector string

        Returns:
            Text content of the element

        Raises:
            Exception: If element not found
        """
        element = await self.find_element(selector)
        text = await element.text_content()
        logger.debug(f"Got text from {selector}: {text[:50] if text else 'None'}...")
        return text or ""

    async def get_attribute(self, selector: str, attribute: str) -> Optional[str]:
        """
        Get attribute value from an element.

        Args:
            selector: CSS selector string
            attribute: Attribute name to retrieve

        Returns:
            Attribute value or None if not found

        Raises:
            Exception: If element not found
        """
        element = await self.find_element(selector)
        value = await element.get_attribute(attribute)
        logger.debug(f"Got {attribute} from {selector}: {value}")
        return value

    async def select_option(self, selector: str, value: str) -> None:
        """
        Select an option in a dropdown.

        Args:
            selector: CSS selector string
            value: Value to select

        Raises:
            Exception: If element not found or selection fails
        """
        element = await self.find_element(selector)
        await element.select_option(value)
        logger.info(f"Selected option {value} in {selector}")

    async def check(self, selector: str) -> None:
        """
        Check a checkbox.

        Args:
            selector: CSS selector string

        Raises:
            Exception: If element not found or check fails
        """
        element = await self.find_element(selector)
        await element.check()
        logger.info(f"Checked checkbox: {selector}")

    async def uncheck(self, selector: str) -> None:
        """
        Uncheck a checkbox.

        Args:
            selector: CSS selector string

        Raises:
            Exception: If element not found or uncheck fails
        """
        element = await self.find_element(selector)
        await element.uncheck()
        logger.info(f"Unchecked checkbox: {selector}")

    async def is_visible(self, selector: str) -> bool:
        """
        Check if element is visible on page.

        Args:
            selector: CSS selector string

        Returns:
            True if element is visible, False otherwise
        """
        try:
            element = self.page.locator(selector)
            is_visible = await element.is_visible()
            logger.debug(f"Element visibility check - {selector}: {is_visible}")
            return is_visible
        except Exception as e:
            logger.warning(f"Visibility check failed for {selector}: {str(e)}")
            return False

    async def is_enabled(self, selector: str) -> bool:
        """
        Check if element is enabled.

        Args:
            selector: CSS selector string

        Returns:
            True if element is enabled, False otherwise
        """
        try:
            element = self.page.locator(selector)
            is_enabled = await element.is_enabled()
            logger.debug(f"Element enabled check - {selector}: {is_enabled}")
            return is_enabled
        except Exception:
            return False

    async def assert_page_loaded(self) -> None:
        """
        Assert that page has fully loaded.
        Override in subclasses to verify page-specific elements.

        Raises:
            AssertionError: If page elements are not found
        """
        pass

    async def take_screenshot(self, name: str) -> str:
        """
        Take screenshot for debugging or verification.

        Args:
            name: Name for screenshot file (without extension)

        Returns:
            Path to saved screenshot

        Raises:
            Exception: If screenshot capture fails
        """
        path = f"screenshots/{name}.png"
        await self.page.screenshot(path=path)
        logger.info(f"Screenshot saved: {path}")
        return path

    async def get_current_url(self) -> str:
        """
        Get current page URL.

        Returns:
            Current URL
        """
        url = self.page.url
        logger.debug(f"Current URL: {url}")
        return url

    async def reload_page(self) -> None:
        """
        Reload current page.
        """
        await self.page.reload()
        logger.info("Page reloaded")

    async def go_back(self) -> None:
        """
        Navigate back to previous page.
        """
        await self.page.go_back()
        logger.info("Navigated back")

    async def go_forward(self) -> None:
        """
        Navigate forward to next page.
        """
        await self.page.go_forward()
        logger.info("Navigated forward")

    async def wait_for_navigation(self) -> None:
        """
        Wait for navigation to complete.
        """
        await self.page.wait_for_load_state("networkidle")
        logger.debug("Navigation completed")

    async def press_key(self, selector: str, key: str) -> None:
        """
        Press a key in an element.

        Args:
            selector: CSS selector string
            key: Key to press (e.g., 'Enter', 'Escape')
        """
        element = await self.find_element(selector)
        await element.press(key)
        logger.info(f"Pressed {key} in {selector}")

    async def focus(self, selector: str) -> None:
        """
        Focus on an element.

        Args:
            selector: CSS selector string
        """
        element = await self.find_element(selector)
        await element.focus()
        logger.info(f"Focused on {selector}")

    async def hover(self, selector: str) -> None:
        """
        Hover over an element.

        Args:
            selector: CSS selector string
        """
        element = await self.find_element(selector)
        await element.hover()
        logger.info(f"Hovered over {selector}")

    async def double_click(self, selector: str) -> None:
        """
        Double-click an element.

        Args:
            selector: CSS selector string
        """
        element = await self.find_element(selector)
        await element.dbl_click()
        logger.info(f"Double-clicked {selector}")

    async def right_click(self, selector: str) -> None:
        """
        Right-click an element.

        Args:
            selector: CSS selector string
        """
        element = await self.find_element(selector)
        await element.click(button="right")
        logger.info(f"Right-clicked {selector}")
