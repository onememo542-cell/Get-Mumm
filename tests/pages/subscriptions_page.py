"""
Page object for the subscription plans page.

This module provides page object methods for interacting with subscription plans,
including viewing plan details and plan comparisons.
"""

import logging
from typing import List
from playwright.async_api import Page
from .base_page import BasePage

logger = logging.getLogger(__name__)


class SubscriptionsPage(BasePage):
    """
    Page object for the subscription plans page.
    """

    # Selectors
    PAGE_TITLE = "h1:has-text('Subscription'), h1:has-text('Plans'), [data-testid='subscriptions-title']"
    PLANS_CONTAINER = "[data-testid='plans-container'], .plans-grid, .plans-list"
    PLAN_CARD = "[data-testid='plan-card'], .plan-card, .pricing-card"
    PLAN_NAME = ".plan-name, [data-testid='plan-name']"
    PLAN_PRICE = ".plan-price, [data-testid='plan-price']"
    PLAN_BILLING = ".plan-billing, [data-testid='plan-billing']"
    PLAN_DESCRIPTION = ".plan-description, [data-testid='plan-description']"
    PLAN_FEATURES = ".plan-features, [data-testid='plan-features']"
    FEATURE_ITEM = ".feature-item, [data-testid='feature-item']"
    SELECT_PLAN_BUTTON = "button:has-text('Select'), button:has-text('Choose'), button:has-text('Get Started')"
    COMPARE_BUTTON = "button:has-text('Compare'), [data-testid='compare-button']"
    COMPARISON_TABLE = ".comparison-table, [data-testid='comparison-table']"
    FEATURE_COMPARISON = ".feature-comparison, [data-testid='feature-comparison']"

    # Plan types
    STARTER_PLAN = "[data-testid='plan-starter'], .plan-starter"
    PROFESSIONAL_PLAN = "[data-testid='plan-professional'], .plan-professional"
    PREMIUM_PLAN = "[data-testid='plan-premium'], .plan-premium"

    def __init__(self, page: Page):
        """
        Initialize SubscriptionsPage with Playwright page.

        Args:
            page: Playwright page object
        """
        super().__init__(page)

    async def assert_page_loaded(self) -> None:
        """
        Verify subscriptions page has fully loaded.

        Raises:
            AssertionError: If page elements are not visible
        """
        assert await self.wait_for_element(self.PAGE_TITLE), "Subscriptions page title not visible"
        assert await self.wait_for_element(self.PLANS_CONTAINER), "Plans container not visible"
        logger.info("SubscriptionsPage loaded successfully")

    async def get_plans_count(self) -> int:
        """
        Get count of subscription plan cards displayed.

        Returns:
            Number of plan cards
        """
        cards = self.page.locator(self.PLAN_CARD)
        count = await cards.count()
        logger.info(f"Found {count} subscription plans")
        return count

    async def get_first_plan_name(self) -> str:
        """
        Get name of first subscription plan.

        Returns:
            Plan name text
        """
        first_card = self.page.locator(self.PLAN_CARD).first
        name_locator = first_card.locator(self.PLAN_NAME)
        text = await name_locator.text_content()
        logger.info(f"First plan: {text}")
        return text or ""

    async def get_first_plan_price(self) -> str:
        """
        Get price of first subscription plan.

        Returns:
            Plan price text
        """
        first_card = self.page.locator(self.PLAN_CARD).first
        price_locator = first_card.locator(self.PLAN_PRICE)
        text = await price_locator.text_content()
        logger.info(f"First plan price: {text}")
        return text or ""

    async def get_first_plan_billing(self) -> str:
        """
        Get billing cycle of first subscription plan.

        Returns:
            Billing cycle text (e.g., 'monthly', 'annual')
        """
        first_card = self.page.locator(self.PLAN_CARD).first
        billing_locator = first_card.locator(self.PLAN_BILLING)
        text = await billing_locator.text_content()
        logger.info(f"First plan billing: {text}")
        return text or ""

    async def get_plan_features(self, plan_index: int = 0) -> List[str]:
        """
        Get list of features for a plan.

        Args:
            plan_index: Index of plan card (default: 0)

        Returns:
            List of feature descriptions
        """
        cards = self.page.locator(self.PLAN_CARD)
        card = cards.nth(plan_index)
        features = card.locator(self.FEATURE_ITEM)
        count = await features.count()

        feature_list = []
        for i in range(count):
            feature = features.nth(i)
            text = await feature.text_content()
            if text:
                feature_list.append(text.strip())

        logger.info(f"Plan {plan_index} has {len(feature_list)} features")
        return feature_list

    async def get_all_plan_names(self) -> List[str]:
        """
        Get list of all subscription plan names.

        Returns:
            List of plan names
        """
        cards = self.page.locator(self.PLAN_CARD)
        count = await cards.count()
        names = []

        for i in range(count):
            card = cards.nth(i)
            name_locator = card.locator(self.PLAN_NAME)
            text = await name_locator.text_content()
            if text:
                names.append(text.strip())

        logger.info(f"Retrieved {len(names)} plan names")
        return names

    async def select_plan(self, plan_index: int = 0) -> None:
        """
        Select a subscription plan.

        Args:
            plan_index: Index of plan to select (default: 0)
        """
        cards = self.page.locator(self.PLAN_CARD)
        card = cards.nth(plan_index)
        select_button = card.locator(self.SELECT_PLAN_BUTTON)
        await select_button.click()
        await self.wait_for_navigation()
        logger.info(f"Selected plan at index {plan_index}")

    async def open_comparison(self) -> None:
        """
        Open plan comparison view.
        """
        compare_buttons = self.page.locator(self.COMPARE_BUTTON)
        if await compare_buttons.count() > 0:
            await compare_buttons.first.click()
            await self.wait_for_element(self.COMPARISON_TABLE)
            logger.info("Opened plan comparison")

    async def has_comparison_table(self) -> bool:
        """
        Check if plan comparison table is visible.

        Returns:
            True if comparison table is visible
        """
        return await self.is_visible(self.COMPARISON_TABLE)

    async def get_plan_description(self, plan_index: int = 0) -> str:
        """
        Get description of a plan.

        Args:
            plan_index: Index of plan card (default: 0)

        Returns:
            Plan description text
        """
        cards = self.page.locator(self.PLAN_CARD)
        card = cards.nth(plan_index)
        desc_locator = card.locator(self.PLAN_DESCRIPTION)
        text = await desc_locator.text_content()
        logger.info(f"Plan {plan_index} description length: {len(text or '')}")
        return text or ""

    async def verify_all_plans_have_prices(self) -> bool:
        """
        Verify all plans have prices displayed.

        Returns:
            True if all plans have prices
        """
        cards = self.page.locator(self.PLAN_CARD)
        count = await cards.count()

        for i in range(count):
            card = cards.nth(i)
            price_locator = card.locator(self.PLAN_PRICE)
            is_visible = await price_locator.is_visible()
            if not is_visible:
                logger.warning(f"Plan {i} does not have visible price")
                return False

        logger.info(f"All {count} plans have prices displayed")
        return True

    async def verify_all_plans_have_select_button(self) -> bool:
        """
        Verify all plans have select button.

        Returns:
            True if all plans have select button
        """
        cards = self.page.locator(self.PLAN_CARD)
        count = await cards.count()

        for i in range(count):
            card = cards.nth(i)
            button_locator = card.locator(self.SELECT_PLAN_BUTTON)
            is_visible = await button_locator.is_visible()
            if not is_visible:
                logger.warning(f"Plan {i} does not have visible select button")
                return False

        logger.info(f"All {count} plans have select buttons")
        return True
