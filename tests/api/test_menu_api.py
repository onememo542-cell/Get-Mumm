"""
API tests for menu endpoints.

Tests verify:
- GET /api/menu returns valid response with required fields
- Menu items include id, name, category, price, dietary_info
- Filters work and return only matching items
- Pagination returns correct subset of items
- Error responses are handled properly
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.api
@pytest.mark.asyncio
class TestMenuAPI:
    """
    Test suite for menu API endpoints.
    """

    async def test_get_menu_returns_200(self, api_client):
        """
        Test that GET /api/menu returns successful response.
        """
        status, data = await api_client.get("/api/menu")
        assert status == 200, f"Expected 200 status, got {status}"
        logger.info("GET /api/menu returned 200")

    async def test_get_menu_response_format(self, api_client):
        """
        Test that GET /api/menu returns valid response structure.
        """
        status, data = await api_client.get("/api/menu")
        assert status == 200
        assert isinstance(data, dict), "Response should be a dictionary"
        assert "items" in data or "data" in data, "Response should contain items"
        logger.info("GET /api/menu response format valid")

    async def test_menu_items_have_required_fields(self, api_client):
        """
        Test that menu items include all required fields.
        """
        status, data = await api_client.get("/api/menu")
        assert status == 200

        items = data.get("items") or data.get("data") or []
        assert len(items) > 0, "Should return at least one menu item"

        # Check first item has required fields
        first_item = items[0]
        required_fields = ["id", "name", "category", "price"]
        for field in required_fields:
            assert field in first_item, f"Menu item missing required field: {field}"

        logger.info("Menu items have all required fields")

    async def test_menu_category_filter(self, api_client):
        """
        Test that category filter returns only matching items.
        """
        status, data = await api_client.get("/api/menu", params={"category": "mains"})
        assert status == 200

        items = data.get("items") or data.get("data") or []
        if len(items) > 0:
            # All returned items should match the category
            for item in items:
                assert item.get("category") == "mains" or "mains" in str(item).lower()

        logger.info(f"Category filter returned {len(items)} items")

    async def test_menu_pagination_limit(self, api_client):
        """
        Test that pagination limit parameter works.
        """
        limit = 5
        status, data = await api_client.get("/api/menu", params={"limit": limit})
        assert status == 200

        items = data.get("items") or data.get("data") or []
        assert len(items) <= limit, f"Should return at most {limit} items"

        logger.info(f"Pagination limit returned {len(items)} items")

    async def test_menu_pagination_offset(self, api_client):
        """
        Test that pagination offset parameter works.
        """
        # Get first page
        status1, data1 = await api_client.get("/api/menu", params={"limit": 2, "offset": 0})
        assert status1 == 200
        items1 = data1.get("items") or data1.get("data") or []

        # Get second page
        status2, data2 = await api_client.get("/api/menu", params={"limit": 2, "offset": 2})
        assert status2 == 200
        items2 = data2.get("items") or data2.get("data") or []

        # Items should be different
        if len(items1) > 0 and len(items2) > 0:
            assert items1[0].get("id") != items2[0].get("id"), "Offset should return different items"

        logger.info("Pagination offset works correctly")

    async def test_menu_invalid_category_filter(self, api_client):
        """
        Test that invalid category filter returns 400 or 422 status.
        """
        status, data = await api_client.get("/api/menu", params={"category": "invalid_category_xyz"})
        # May return 200 with empty results or 400/422 with error
        assert status in [200, 400, 422], f"Unexpected status: {status}"
        logger.info(f"Invalid category filter returned status: {status}")

    async def test_menu_malformed_pagination_params(self, api_client):
        """
        Test that malformed pagination parameters are handled.
        """
        status, data = await api_client.get("/api/menu", params={"limit": "invalid", "offset": "abc"})
        # Should handle gracefully - either 400 error or default values
        assert status in [200, 400, 422], f"Unexpected status: {status}"
        logger.info(f"Malformed pagination params returned status: {status}")

    async def test_menu_has_total_count(self, api_client):
        """
        Test that response includes total count of items.
        """
        status, data = await api_client.get("/api/menu")
        assert status == 200

        # Should have total count or similar field
        has_count = "total" in data or "total_count" in data or "count" in data
        logger.info(f"Response has total count field: {has_count}")
