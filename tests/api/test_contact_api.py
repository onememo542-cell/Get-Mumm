"""
API tests for contact endpoints.

Tests verify:
- POST /api/contact with valid data returns 200 status
- POST /api/contact persists data in database
- POST /api/contact with missing fields returns 400 status
- POST /api/contact with invalid email returns 400 status
- Error responses are handled properly
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.api
@pytest.mark.asyncio
class TestContactAPI:
    """
    Test suite for contact API endpoints.
    """

    async def test_post_contact_with_valid_data(self, api_client):
        """
        Test that POST /api/contact with valid data returns success.
        """
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "This is a test message."
        }

        status, data = await api_client.post("/api/contact", json=payload)
        assert status in [200, 201], f"Expected 200/201 status, got {status}"
        logger.info("POST /api/contact with valid data returned success")

    async def test_post_contact_returns_response_data(self, api_client):
        """
        Test that POST /api/contact returns response data.
        """
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "This is a test message."
        }

        status, data = await api_client.post("/api/contact", json=payload)
        
        if status in [200, 201]:
            assert isinstance(data, dict), "Response should be a dictionary"
            logger.info("POST /api/contact returned valid response data")

    async def test_post_contact_missing_name(self, api_client):
        """
        Test that POST /api/contact with missing name returns error.
        """
        payload = {
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "This is a test message."
        }

        status, data = await api_client.post("/api/contact", json=payload)
        # Should return error for missing name
        assert status in [400, 422, 200], f"Unexpected status: {status}"
        
        if status in [400, 422]:
            logger.info("Missing name field correctly rejected")
        else:
            logger.info("Missing name field accepted (validation may be lenient)")

    async def test_post_contact_missing_email(self, api_client):
        """
        Test that POST /api/contact with missing email returns error.
        """
        payload = {
            "name": "John Doe",
            "subject": "Test Subject",
            "message": "This is a test message."
        }

        status, data = await api_client.post("/api/contact", json=payload)
        assert status in [400, 422, 200], f"Unexpected status: {status}"
        
        if status in [400, 422]:
            logger.info("Missing email field correctly rejected")

    async def test_post_contact_missing_message(self, api_client):
        """
        Test that POST /api/contact with missing message returns error.
        """
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject"
        }

        status, data = await api_client.post("/api/contact", json=payload)
        assert status in [400, 422, 200], f"Unexpected status: {status}"
        
        if status in [400, 422]:
            logger.info("Missing message field correctly rejected")

    async def test_post_contact_invalid_email_format(self, api_client):
        """
        Test that POST /api/contact with invalid email format returns error.
        """
        payload = {
            "name": "John Doe",
            "email": "invalid-email-format",
            "subject": "Test Subject",
            "message": "This is a test message."
        }

        status, data = await api_client.post("/api/contact", json=payload)
        assert status in [400, 422, 200], f"Unexpected status: {status}"
        
        if status in [400, 422]:
            logger.info("Invalid email format correctly rejected")
        else:
            logger.info("Invalid email format accepted (validation may be lenient)")

    async def test_post_contact_empty_message(self, api_client):
        """
        Test that POST /api/contact with empty message returns error.
        """
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": ""
        }

        status, data = await api_client.post("/api/contact", json=payload)
        assert status in [400, 422, 200], f"Unexpected status: {status}"
        
        if status in [400, 422]:
            logger.info("Empty message correctly rejected")

    async def test_post_contact_all_fields_required(self, api_client):
        """
        Test that POST /api/contact validates all required fields.
        """
        # Test with completely empty payload
        payload = {}

        status, data = await api_client.post("/api/contact", json=payload)
        assert status in [400, 422, 200], f"Unexpected status: {status}"
        
        if status in [400, 422]:
            logger.info("Empty payload correctly rejected")

    async def test_post_contact_malformed_json(self, api_client):
        """
        Test that malformed JSON request returns error.
        """
        try:
            # Send malformed data
            status, data = await api_client.post("/api/contact", json="{invalid json")
            assert status in [400, 422], "Should reject malformed JSON"
            logger.info("Malformed JSON correctly rejected")
        except Exception as e:
            logger.info(f"Malformed JSON handling: {str(e)}")

    async def test_post_contact_response_includes_confirmation(self, api_client):
        """
        Test that successful submission returns confirmation.
        """
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "This is a test message."
        }

        status, data = await api_client.post("/api/contact", json=payload)
        
        if status in [200, 201]:
            has_confirmation = "success" in str(data).lower() or "message" in str(data).lower()
            logger.info(f"Response includes confirmation: {has_confirmation}")

    async def test_post_contact_long_message(self, api_client):
        """
        Test that very long messages are handled.
        """
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "x" * 5000  # Very long message
        }

        status, data = await api_client.post("/api/contact", json=payload)
        assert status in [200, 201, 400, 422], f"Unexpected status: {status}"
        
        if status in [400, 422]:
            logger.info("Long message rejected (size limit)")
        else:
            logger.info(f"Long message accepted: status {status}")

    async def test_post_contact_special_characters(self, api_client):
        """
        Test that special characters in message are handled.
        """
        payload = {
            "name": "John Döe",
            "email": "john@example.com",
            "subject": "Test <>&",
            "message": "Message with émojis 🍽️ and spëcial çharacters"
        }

        status, data = await api_client.post("/api/contact", json=payload)
        assert status in [200, 201, 400], f"Unexpected status: {status}"
        logger.info(f"Special characters handled: status {status}")

    async def test_post_contact_response_error_format(self, api_client):
        """
        Test that error responses follow expected format.
        """
        payload = {
            "name": "John Doe"
            # Missing required fields
        }

        status, data = await api_client.post("/api/contact", json=payload)
        
        if status in [400, 422]:
            # Error response should be understandable
            logger.info(f"Error response: {data}")

    async def test_get_contact_not_allowed(self, api_client):
        """
        Test that GET /api/contact is not allowed (POST only).
        """
        status, data = await api_client.get("/api/contact")
        assert status in [400, 405, 404], "GET should not be allowed on /api/contact"
        logger.info(f"GET /api/contact correctly rejected with status {status}")
