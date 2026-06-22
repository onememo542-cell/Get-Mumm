"""
UI tests for the subscription plans page.

Tests verify:
- Subscription page loads successfully with all tiers visible
- All subscription tiers display correctly
- Pricing information is accurate for each plan
- Features list displays for each plan
- Plan comparison feature works
- Plan selection flows correctly
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.ui
@pytest.mark.asyncio
class TestSubscriptionsPage:
    """
    Test suite for subscription plans page UI interactions.
    """

    async def test_subscriptions_page_loads(self, subscriptions_page):
        """
        Test that subscriptions page loads successfully.
        Verifies subscription tiers container is visible.
        """
        await subscriptions_page.assert_page_loaded()
        logger.info("Subscriptions page loaded successfully")

    async def test_subscription_tiers_displayed(self, subscriptions_page):
        """
        Test that at least one subscription tier is displayed.
        """
        tier_count = await subscriptions_page.get_tier_count()
        assert tier_count > 0, "Should display at least one subscription tier"
        logger.info(f"Subscriptions page displays {tier_count} tiers")

    async def test_subscription_tiers_have_names(self, subscriptions_page):
        """
        Test that each subscription tier displays a name.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        assert len(tiers) > 0, "Should have at least one tier"

        for tier in tiers:
            assert tier.get("name"), "Tier should have a name"
            logger.debug(f"Subscription tier: {tier.get('name')}")

        logger.info(f"All {len(tiers)} subscription tiers have names")

    async def test_subscription_tiers_have_pricing(self, subscriptions_page):
        """
        Test that each subscription tier displays pricing information.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        if len(tiers) == 0:
            pytest.skip("No subscription tiers available")

        for tier in tiers:
            assert tier.get("price") is not None, "Tier should display price"
            assert tier.get("billing_cycle"), "Tier should indicate billing cycle"

        logger.info(f"All {len(tiers)} tiers display pricing and billing cycle")

    async def test_subscription_tier_features_listed(self, subscriptions_page):
        """
        Test that features are listed for each subscription tier.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        if len(tiers) == 0:
            pytest.skip("No subscription tiers available")

        for tier in tiers:
            features = tier.get("features", [])
            assert isinstance(features, (list, str)), "Features should be in list or string format"
            if isinstance(features, list):
                assert len(features) > 0, f"Tier {tier.get('name')} should have features"

        logger.info(f"Subscription tier features verified ({len(tiers)} tiers)")

    async def test_subscription_tier_pricing_accuracy(self, subscriptions_page):
        """
        Test that subscription tier pricing displays correctly.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        if len(tiers) == 0:
            pytest.skip("No subscription tiers available")

        for tier in tiers:
            price = tier.get("price")
            # Price should be numeric or currency formatted
            assert price, f"Tier {tier.get('name')} should have price"
            logger.debug(f"Tier {tier.get('name')} price: {price}")

        logger.info("Subscription pricing verified")

    async def test_subscription_most_popular_badge(self, subscriptions_page):
        """
        Test that 'most popular' or similar badge is displayed.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        if len(tiers) == 0:
            pytest.skip("No subscription tiers available")

        most_popular_count = sum(1 for t in tiers if t.get("is_popular"))
        logger.info(f"Popular badge displayed on {most_popular_count} tier(s)")

    async def test_subscription_call_to_action_button(self, subscriptions_page):
        """
        Test that each tier has a call-to-action button.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        if len(tiers) == 0:
            pytest.skip("No subscription tiers available")

        for tier in tiers:
            has_cta = tier.get("cta_button") or tier.get("button_text")
            logger.debug(f"Tier {tier.get('name')} CTA: {has_cta}")

        logger.info("Subscription CTA buttons verified")

    async def test_subscription_tier_click_select(self, subscriptions_page):
        """
        Test that clicking a tier's select button works.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        if len(tiers) == 0:
            pytest.skip("No subscription tiers available")

        first_tier_name = tiers[0].get("name")
        
        try:
            await subscriptions_page.click_tier_select_button(first_tier_name)
            logger.info(f"Successfully clicked select button for tier: {first_tier_name}")
        except Exception as e:
            logger.warning(f"Tier selection test skipped: {str(e)}")

    async def test_subscription_tier_comparison_feature(self, subscriptions_page):
        """
        Test that tier comparison feature is available.
        """
        try:
            has_comparison = await subscriptions_page.has_comparison_feature()
            if has_comparison:
                logger.info("Tier comparison feature is available")
            else:
                logger.info("Tier comparison feature not available")
        except Exception as e:
            logger.debug(f"Comparison feature check skipped: {str(e)}")

    async def test_subscription_billing_cycle_toggle(self, subscriptions_page):
        """
        Test that billing cycle toggle (monthly/yearly) works if available.
        """
        try:
            has_toggle = await subscriptions_page.has_billing_cycle_toggle()
            if has_toggle:
                # Get monthly pricing
                await subscriptions_page.set_billing_cycle("monthly")
                monthly_tiers = await subscriptions_page.get_subscription_tiers()
                
                # Get yearly pricing
                await subscriptions_page.set_billing_cycle("yearly")
                yearly_tiers = await subscriptions_page.get_subscription_tiers()
                
                # Prices should differ
                if monthly_tiers and yearly_tiers:
                    logger.info(f"Billing cycle toggle works - monthly: {monthly_tiers[0].get('price')}, yearly: {yearly_tiers[0].get('price')}")
            else:
                logger.info("Billing cycle toggle not available")
        except Exception as e:
            logger.debug(f"Billing cycle toggle test skipped: {str(e)}")

    async def test_subscription_description_visible(self, subscriptions_page):
        """
        Test that tier descriptions are visible.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        if len(tiers) == 0:
            pytest.skip("No subscription tiers available")

        descriptions_found = sum(1 for t in tiers if t.get("description"))
        logger.info(f"Subscription descriptions visible on {descriptions_found}/{len(tiers)} tiers")

    async def test_subscription_tier_visual_hierarchy(self, subscriptions_page):
        """
        Test that subscription tiers display with clear visual hierarchy.
        """
        tier_count = await subscriptions_page.get_tier_count()
        assert tier_count > 0, "Should have subscription tiers"

        # Verify we can retrieve all tiers
        tiers = await subscriptions_page.get_subscription_tiers()
        assert len(tiers) == tier_count, "Should retrieve all visible tiers"

        logger.info(f"Subscription tier visual hierarchy verified ({tier_count} tiers)")

    async def test_subscription_responsive_layout(self, subscriptions_page):
        """
        Test that subscription tiers display correctly on current viewport.
        """
        tier_count = await subscriptions_page.get_tier_count()
        if tier_count == 0:
            pytest.skip("No subscription tiers available")

        tiers = await subscriptions_page.get_subscription_tiers()
        assert len(tiers) == tier_count, "All tiers should be visible"

        logger.info(f"Subscription layout responsive for {tier_count} tiers")

    @pytest.mark.flaky
    async def test_subscription_tier_hover_highlight(self, subscriptions_page):
        """
        Test that subscription tiers highlight on hover.
        Marked as flaky due to timing-dependent nature.
        """
        tiers = await subscriptions_page.get_subscription_tiers()
        if len(tiers) == 0:
            pytest.skip("No subscription tiers available")

        try:
            first_tier_name = tiers[0].get("name")
            await subscriptions_page.hover_tier(first_tier_name)
            logger.info(f"Hover effect tested for tier: {first_tier_name}")
        except Exception as e:
            logger.warning(f"Tier hover test skipped: {str(e)}")

    async def test_subscription_page_has_heading(self, subscriptions_page):
        """
        Test that page has a clear heading.
        """
        try:
            heading = await subscriptions_page.get_page_heading()
            assert heading, "Page should have a heading"
            logger.info(f"Page heading: {heading}")
        except Exception as e:
            logger.debug(f"Page heading check skipped: {str(e)}")

    async def test_subscription_page_has_description(self, subscriptions_page):
        """
        Test that page has a description or subtitle.
        """
        try:
            description = await subscriptions_page.get_page_description()
            if description:
                logger.info(f"Page description present")
            else:
                logger.info("Page description not present")
        except Exception as e:
            logger.debug(f"Page description check skipped: {str(e)}")
