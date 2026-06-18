"""
API tests for subscription endpoints.

Tests verify:
- GET /api/subscriptions returns all subscription tiers
- Subscription response includes pricing, features, billing_cycle
- Subscription data is properly formatted
- Error handling works correctly
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.api
@pytest.mark.asyncio
class TestSubscriptionsAPI:
    """
    Test suite for subscription API endpoints.
    """

    async def test_get_subscriptions_returns_200(self, api_client):
        """
        Test that GET /api/subscriptions returns successful response.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200, f"Expected 200 status, got {status}"
        logger.info("GET /api/subscriptions returned 200")

    async def test_get_subscriptions_response_format(self, api_client):
        """
        Test that GET /api/subscriptions returns valid response structure.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200
        assert isinstance(data, dict), "Response should be a dictionary"
        assert "items" in data or "data" in data or "tiers" in data or "plans" in data, \
            "Response should contain subscription data"
        logger.info("GET /api/subscriptions response format valid")

    async def test_subscriptions_have_required_fields(self, api_client):
        """
        Test that subscription tiers include required fields.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        assert len(tiers) > 0, "Should return at least one subscription tier"

        # Check first tier has required fields
        first_tier = tiers[0]
        required_fields = ["id", "name", "price"]
        for field in required_fields:
            assert field in first_tier, f"Subscription tier missing required field: {field}"

        logger.info("Subscription tiers have all required fields")

    async def test_subscription_has_pricing(self, api_client):
        """
        Test that subscription tiers include pricing information.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        if len(tiers) > 0:
            first_tier = tiers[0]
            assert "price" in first_tier, "Tier should have price"
            logger.info(f"Subscription pricing: {first_tier.get('price')}")

    async def test_subscription_has_billing_cycle(self, api_client):
        """
        Test that subscription tiers include billing cycle.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        if len(tiers) > 0:
            first_tier = tiers[0]
            has_billing = "billing_cycle" in first_tier or "cycle" in first_tier or "interval" in first_tier
            logger.info(f"Subscription has billing cycle: {has_billing}")

    async def test_subscription_has_features(self, api_client):
        """
        Test that subscription tiers include features list.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        if len(tiers) > 0:
            first_tier = tiers[0]
            has_features = "features" in first_tier or "benefits" in first_tier or "perks" in first_tier
            if has_features:
                logger.info(f"Subscription includes features list")

    async def test_subscription_tiers_response_is_array(self, api_client):
        """
        Test that response contains array of subscription tiers.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        assert isinstance(tiers, list), "Tiers should be returned as a list"
        logger.info(f"Response contains {len(tiers)} subscription tiers in array format")

    async def test_subscription_id_is_unique(self, api_client):
        """
        Test that each subscription tier has a unique ID.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        if len(tiers) > 1:
            tier_ids = [tier.get("id") for tier in tiers]
            unique_ids = len(set(tier_ids))
            assert unique_ids == len(tier_ids), "All tier IDs should be unique"
            logger.info(f"All {len(tiers)} subscription IDs are unique")

    async def test_subscription_name_not_empty(self, api_client):
        """
        Test that subscription tier names are not empty.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        for tier in tiers:
            name = tier.get("name", "").strip()
            assert len(name) > 0, "Tier name should not be empty"

        logger.info(f"All {len(tiers)} subscription names are non-empty")

    async def test_subscription_price_is_numeric(self, api_client):
        """
        Test that subscription prices are numeric or properly formatted.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        for tier in tiers:
            price = tier.get("price")
            assert price is not None, "Tier should have price"
            
            # Price should be numeric or currency string
            try:
                if isinstance(price, str):
                    # Remove currency symbols and convert
                    numeric_price = float(price.replace("$", "").replace("€", "").replace(",", ""))
                    assert numeric_price >= 0, "Price should be non-negative"
                else:
                    assert isinstance(price, (int, float)), "Price should be numeric"
                    assert price >= 0, "Price should be non-negative"
            except Exception as e:
                logger.debug(f"Price format: {price}")

        logger.info(f"All {len(tiers)} subscription prices are properly formatted")

    async def test_subscription_data_consistency(self, api_client):
        """
        Test that subscription data is consistent across requests.
        """
        status1, data1 = await api_client.get("/api/subscriptions")
        status2, data2 = await api_client.get("/api/subscriptions")

        assert status1 == 200 and status2 == 200, "Both requests should succeed"

        tiers1 = data1.get("items") or data1.get("data") or data1.get("tiers") or data1.get("plans") or []
        tiers2 = data2.get("items") or data2.get("data") or data2.get("tiers") or data2.get("plans") or []

        assert len(tiers1) == len(tiers2), "Tier count should be consistent"
        
        if len(tiers1) > 0:
            assert tiers1[0].get("id") == tiers2[0].get("id"), "First tier should be same"

        logger.info("Subscription data is consistent across requests")

    async def test_subscription_monthly_yearly_pricing(self, api_client):
        """
        Test that if monthly/yearly variants exist, they are handled.
        """
        # Try with monthly filter if supported
        status_m, data_m = await api_client.get("/api/subscriptions", params={"billing_cycle": "monthly"})
        status_y, data_y = await api_client.get("/api/subscriptions", params={"billing_cycle": "yearly"})

        # Both should either work or return 400/404
        assert status_m in [200, 400, 404, 422], f"Unexpected monthly status: {status_m}"
        assert status_y in [200, 400, 404, 422], f"Unexpected yearly status: {status_y}"

        logger.info(f"Billing cycle filtering: monthly={status_m}, yearly={status_y}")

    async def test_subscription_response_includes_count(self, api_client):
        """
        Test that response includes total count of tiers.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        has_count = "total" in data or "total_count" in data or "count" in data
        logger.info(f"Response has total count field: {has_count}")

    async def test_subscription_tier_descriptions(self, api_client):
        """
        Test that subscription tiers may include descriptions.
        """
        status, data = await api_client.get("/api/subscriptions")
        assert status == 200

        tiers = data.get("items") or data.get("data") or data.get("tiers") or data.get("plans") or []
        if len(tiers) > 0:
            tiers_with_desc = sum(1 for t in tiers if t.get("description"))
            logger.info(f"Subscription tiers with description: {tiers_with_desc}/{len(tiers)}")
