"""
ChefsPage object providing methods and selectors for chefs page interactions.

This module defines the ChefsPage class which inherits from BasePage and provides:
- Selectors for chef cards and information
- Methods for retrieving chef information
- Methods for interacting with chef cards
"""

import logging
from typing import List, Dict, Any
from playwright.async_api import Page
from .base_page import BasePage

logger = logging.getLogger(__name__)


class ChefsPage(BasePage):
    """
    Page object for the chefs page.
    Provides methods to interact with chef profiles and information.
    """

    # Selectors
    CHEFS_CONTAINER = "div.chefs-container"
    CHEF_CARD = "div.chef-card"
    CHEF_NAME = "h3.chef-name"
    CHEF_BIO = "p.chef-bio"
    CHEF_SPECIALTIES = "div.chef-specialties"
    CHEF_IMAGE = "img.chef-image"

    def __init__(self, page: Page):
        """
        Initialize ChefsPage object.

        Args:
            page: Playwright page object
        """
        super().__init__(page)
        logger.info("ChefsPage initialized")

    async def assert_page_loaded(self) -> None:
        """
        Verify that chefs page has fully loaded.
        
        Checks for visibility of:
        - Chefs container with chef cards

        Raises:
            AssertionError: If critical page elements are not visible
        """
        logger.info("Verifying chefs page has loaded...")
        
        container_loaded = await self.wait_for_element(self.CHEFS_CONTAINER)
        
        assert container_loaded, "Chefs container not visible"
        
        logger.info("Chefs page successfully loaded")

    async def get_chef_cards(self) -> List[Dict[str, Any]]:
        """
        Get all chef cards currently displayed on the page.

        Returns:
            List of dictionaries containing basic chef information
            Each dict includes: name, bio, specialties

        Raises:
            Exception: If chef cards not found
        """
        logger.info("Retrieving chef cards...")
        
        chefs = []
        chef_elements = self.page.locator(self.CHEF_CARD)
        count = await chef_elements.count()
        
        for i in range(count):
            element = chef_elements.nth(i)
            
            # Get chef details
            name_element = element.locator(self.CHEF_NAME)
            bio_element = element.locator(self.CHEF_BIO)
            specialties_element = element.locator(self.CHEF_SPECIALTIES)
            
            name_text = await name_element.text_content()
            bio_text = await bio_element.text_content() if await bio_element.is_visible() else ""
            specialties_text = await specialties_element.text_content() if await specialties_element.is_visible() else ""
            
            chefs.append({
                "name": (name_text or "").strip(),
                "bio": (bio_text or "").strip() if bio_text else None,
                "specialties": (specialties_text or "").strip() if specialties_text else None
            })
        
        logger.info(f"Retrieved {len(chefs)} chef cards")
        return chefs

    async def get_chef_info(self, chef_name: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific chef.

        Args:
            chef_name: Name of the chef to find

        Returns:
            Dictionary containing chef information:
            - name: Chef's name
            - bio: Chef's biography
            - specialties: Chef's specialties
            - image_url: Chef's image URL (if available)

        Raises:
            Exception: If chef not found
        """
        logger.info(f"Retrieving information for chef: {chef_name}")
        
        # Find the chef card by name
        chef_card = self.page.locator(self.CHEF_CARD).filter(has_text=chef_name)
        
        if not await chef_card.is_visible():
            logger.error(f"Chef not found: {chef_name}")
            raise ValueError(f"Chef '{chef_name}' not found on page")
        
        # Extract chef details
        name_text = await chef_card.locator(self.CHEF_NAME).text_content()
        bio_text = await chef_card.locator(self.CHEF_BIO).text_content() if await chef_card.locator(self.CHEF_BIO).is_visible() else ""
        specialties_text = await chef_card.locator(self.CHEF_SPECIALTIES).text_content() if await chef_card.locator(self.CHEF_SPECIALTIES).is_visible() else ""
        
        # Try to get image URL
        image_url = None
        try:
            image_element = chef_card.locator(self.CHEF_IMAGE)
            if await image_element.is_visible():
                image_url = await image_element.get_attribute("src")
        except Exception as e:
            logger.debug(f"Could not retrieve image URL: {str(e)}")
        
        chef_info = {
            "name": (name_text or "").strip(),
            "bio": (bio_text or "").strip() if bio_text else None,
            "specialties": (specialties_text or "").strip() if specialties_text else None,
            "image_url": image_url
        }
        
        logger.info(f"Retrieved detailed info for chef: {chef_name}")
        return chef_info

    async def click_chef_card(self, chef_name: str) -> None:
        """
        Click on a specific chef card to view detailed profile.

        Args:
            chef_name: Name of the chef to click

        Raises:
            Exception: If chef card not found or click fails
        """
        logger.info(f"Clicking chef card for: {chef_name}")
        
        # Find and click the chef card by name
        chef_card = self.page.locator(self.CHEF_CARD).filter(has_text=chef_name)
        
        if not await chef_card.is_visible():
            logger.error(f"Chef card not found: {chef_name}")
            raise ValueError(f"Chef card '{chef_name}' not found on page")
        
        await chef_card.click()
        await self.wait_for_navigation()
        logger.info(f"Clicked chef card: {chef_name}")

    async def get_chef_count(self) -> int:
        """
        Get the total number of chef cards on the page.

        Returns:
            int: Number of chef cards displayed

        Raises:
            Exception: If unable to count cards
        """
        logger.info("Getting chef card count...")
        
        chef_elements = self.page.locator(self.CHEF_CARD)
        count = await chef_elements.count()
        
        logger.info(f"Total chef cards: {count}")
        return count

    async def is_chef_visible(self, chef_name: str) -> bool:
        """
        Check if a specific chef card is visible on the page.

        Args:
            chef_name: Name of the chef to check

        Returns:
            bool: True if chef card is visible, False otherwise
        """
        logger.info(f"Checking if chef is visible: {chef_name}")
        
        chef_card = self.page.locator(self.CHEF_CARD).filter(has_text=chef_name)
        is_visible = await chef_card.is_visible()
        
        logger.debug(f"Chef visibility for '{chef_name}': {is_visible}")
        return is_visible
