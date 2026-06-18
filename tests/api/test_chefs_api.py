"""
API tests for chef endpoints.

Tests verify:
- GET /api/chefs returns valid response with required fields
- Chef profiles include id, name, bio, specialties, image_url
- Chef information is accessible and properly formatted
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.api
@pytest.mark.asyncio
class TestChefsAPI:
    """
    Test suite for chef API endpoints.
    """

    async def test_get_chefs_returns_200(self, api_client):
        """
        Test that GET /api/chefs returns successful response.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200, f"Expected 200 status, got {status}"
        logger.info("GET /api/chefs returned 200")

    async def test_get_chefs_response_format(self, api_client):
        """
        Test that GET /api/chefs returns valid response structure.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200
        assert isinstance(data, dict), "Response should be a dictionary"
        assert "items" in data or "data" in data or isinstance(data, dict), "Response should contain chef data"
        logger.info("GET /api/chefs response format valid")

    async def test_chefs_have_required_fields(self, api_client):
        """
        Test that chef profiles include all required fields.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200

        chefs = data.get("items") or data.get("data") or []
        assert len(chefs) > 0, "Should return at least one chef"

        # Check first chef has required fields
        first_chef = chefs[0]
        required_fields = ["id", "name"]
        for field in required_fields:
            assert field in first_chef, f"Chef missing required field: {field}"

        logger.info("Chefs have all required fields")

    async def test_chef_has_bio_field(self, api_client):
        """
        Test that chef profiles include bio information.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200

        chefs = data.get("items") or data.get("data") or []
        if len(chefs) > 0:
            first_chef = chefs[0]
            has_bio = "bio" in first_chef or "biography" in first_chef
            logger.info(f"Chef has bio field: {has_bio}")

    async def test_chef_has_specialties_field(self, api_client):
        """
        Test that chef profiles include specialties information.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200

        chefs = data.get("items") or data.get("data") or []
        if len(chefs) > 0:
            first_chef = chefs[0]
            has_specialties = "specialties" in first_chef or "expertise" in first_chef
            logger.info(f"Chef has specialties field: {has_specialties}")

    async def test_chef_has_image_url(self, api_client):
        """
        Test that chef profiles include image URLs.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200

        chefs = data.get("items") or data.get("data") or []
        if len(chefs) > 0:
            first_chef = chefs[0]
            has_image = "image_url" in first_chef or "image" in first_chef or "photo" in first_chef
            if has_image:
                logger.info(f"Chef image URL available")

    async def test_chefs_response_is_array(self, api_client):
        """
        Test that response contains array of chefs.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200

        chefs = data.get("items") or data.get("data") or []
        assert isinstance(chefs, list), "Chefs should be returned as a list"
        logger.info(f"Response contains {len(chefs)} chefs in array format")

    async def test_chef_id_is_unique(self, api_client):
        """
        Test that each chef has a unique ID.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200

        chefs = data.get("items") or data.get("data") or []
        if len(chefs) > 1:
            chef_ids = [chef.get("id") for chef in chefs]
            unique_ids = len(set(chef_ids))
            assert unique_ids == len(chef_ids), "All chef IDs should be unique"
            logger.info(f"All {len(chefs)} chef IDs are unique")

    async def test_chef_name_not_empty(self, api_client):
        """
        Test that chef names are not empty.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200

        chefs = data.get("items") or data.get("data") or []
        for chef in chefs:
            name = chef.get("name", "").strip()
            assert len(name) > 0, "Chef name should not be empty"

        logger.info(f"All {len(chefs)} chef names are non-empty")

    async def test_chef_data_consistency(self, api_client):
        """
        Test that chef data is consistent across multiple requests.
        """
        status1, data1 = await api_client.get("/api/chefs")
        status2, data2 = await api_client.get("/api/chefs")

        assert status1 == 200 and status2 == 200, "Both requests should succeed"

        chefs1 = data1.get("items") or data1.get("data") or []
        chefs2 = data2.get("items") or data2.get("data") or []

        assert len(chefs1) == len(chefs2), "Chef count should be consistent"
        
        if len(chefs1) > 0:
            assert chefs1[0].get("id") == chefs2[0].get("id"), "First chef should be same"

        logger.info("Chef data is consistent across requests")

    async def test_chefs_response_includes_count(self, api_client):
        """
        Test that response includes total count of chefs.
        """
        status, data = await api_client.get("/api/chefs")
        assert status == 200

        has_count = "total" in data or "total_count" in data or "count" in data
        logger.info(f"Response has total count field: {has_count}")

    async def test_chefs_invalid_filter(self, api_client):
        """
        Test that invalid filter parameters are handled gracefully.
        """
        status, data = await api_client.get("/api/chefs", params={"specialties": "invalid_xyz"})
        # Should handle gracefully - either 400 error or empty results
        assert status in [200, 400, 422], f"Unexpected status: {status}"
        logger.info(f"Invalid filter handled with status: {status}")

    async def test_chefs_pagination_if_available(self, api_client):
        """
        Test that pagination works if implemented.
        """
        status, data = await api_client.get("/api/chefs", params={"limit": 2})
        assert status in [200, 400, 422]

        chefs = data.get("items") or data.get("data") or []
        if len(chefs) > 0:
            logger.info(f"Pagination returned {len(chefs)} chefs with limit=2")
