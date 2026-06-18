"""
API client fixtures for test infrastructure.

This module provides:
- API session fixture for HTTP requests
- API client with common methods
- Authenticated API client with mock JWT
- Request/response logging
"""

import pytest
import aiohttp
import logging
from typing import Any, Optional, Dict

logger = logging.getLogger(__name__)


class APIClient:
    """
    Async API client for making HTTP requests in tests.
    """

    def __init__(self, base_url: str, session: aiohttp.ClientSession = None):
        """
        Initialize API client.

        Args:
            base_url: Base URL for API endpoints
            session: Optional aiohttp ClientSession for request pooling
        """
        self.base_url = base_url
        self.session = session
        self.auth_token = None
        logger.info(f"APIClient initialized with base URL: {base_url}")

    async def get(self, endpoint: str, params: Optional[Dict] = None) -> tuple:
        """
        Make GET request.

        Args:
            endpoint: API endpoint path (relative to base_url)
            params: Optional query parameters

        Returns:
            Tuple of (status_code, response_data)
        """
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers()

        try:
            async with self.session.get(url, params=params, headers=headers) as resp:
                status = resp.status
                data = await resp.json()
                logger.info(f"GET {endpoint} - Status: {status}")
                return status, data
        except aiohttp.ClientError as e:
            logger.error(f"GET request failed for {endpoint}: {str(e)}")
            raise

    async def post(self, endpoint: str, data: Optional[Dict] = None, json_data: bool = True) -> tuple:
        """
        Make POST request.

        Args:
            endpoint: API endpoint path (relative to base_url)
            data: Request body data
            json_data: Whether to send as JSON (default: True)

        Returns:
            Tuple of (status_code, response_data)
        """
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers()

        try:
            if json_data:
                async with self.session.post(url, json=data, headers=headers) as resp:
                    status = resp.status
                    response_data = await resp.json()
            else:
                async with self.session.post(url, data=data, headers=headers) as resp:
                    status = resp.status
                    response_data = await resp.json()

            logger.info(f"POST {endpoint} - Status: {status}")
            logger.debug(f"POST request body: {data}")
            return status, response_data

        except aiohttp.ClientError as e:
            logger.error(f"POST request failed for {endpoint}: {str(e)}")
            raise

    async def put(self, endpoint: str, data: Optional[Dict] = None) -> tuple:
        """
        Make PUT request.

        Args:
            endpoint: API endpoint path
            data: Request body data

        Returns:
            Tuple of (status_code, response_data)
        """
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers()

        try:
            async with self.session.put(url, json=data, headers=headers) as resp:
                status = resp.status
                response_data = await resp.json()
                logger.info(f"PUT {endpoint} - Status: {status}")
                return status, response_data
        except aiohttp.ClientError as e:
            logger.error(f"PUT request failed for {endpoint}: {str(e)}")
            raise

    async def delete(self, endpoint: str) -> tuple:
        """
        Make DELETE request.

        Args:
            endpoint: API endpoint path

        Returns:
            Tuple of (status_code, response_data)
        """
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers()

        try:
            async with self.session.delete(url, headers=headers) as resp:
                status = resp.status
                try:
                    response_data = await resp.json()
                except:
                    response_data = {}
                logger.info(f"DELETE {endpoint} - Status: {status}")
                return status, response_data
        except aiohttp.ClientError as e:
            logger.error(f"DELETE request failed for {endpoint}: {str(e)}")
            raise

    def set_auth_token(self, token: str) -> None:
        """
        Set authentication token for subsequent requests.

        Args:
            token: JWT or bearer token
        """
        self.auth_token = token
        logger.info("Authentication token set")

    def clear_auth_token(self) -> None:
        """
        Clear authentication token.
        """
        self.auth_token = None
        logger.info("Authentication token cleared")

    def _get_headers(self) -> Dict[str, str]:
        """
        Get request headers with optional authentication.

        Returns:
            Dictionary of request headers
        """
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "E2E-Test-Client/1.0"
        }

        if self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"

        return headers


@pytest.fixture(scope="session")
async def api_session():
    """
    Session-scoped fixture for aiohttp ClientSession.
    Reused across all API tests for connection pooling.

    Yields:
        aiohttp.ClientSession object
    """
    connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
    timeout = aiohttp.ClientTimeout(total=30)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        logger.info("API session created")
        yield session
        logger.info("API session closed")


@pytest.fixture(scope="function")
def api_client(api_session, test_env):
    """
    Function-scoped fixture for API client.
    Creates new instance for each test with configured base URL.

    Args:
        api_session: Session-scoped aiohttp ClientSession
        test_env: Test environment configuration

    Yields:
        APIClient instance
    """
    base_url = test_env["api_url"]
    client = APIClient(base_url=base_url, session=api_session)
    logger.info(f"API client created for {base_url}")
    yield client


@pytest.fixture(scope="function")
def authenticated_api_client(api_client):
    """
    Function-scoped fixture providing authenticated API client.
    Sets mock JWT token for testing authenticated endpoints.

    Args:
        api_client: Function-scoped API client

    Yields:
        APIClient instance with authentication token
    """
    # Set mock JWT token
    mock_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJpYXQiOjE2OTUwMDAwMDB9.mock-signature-12345"
    api_client.set_auth_token(mock_token)
    logger.info("Authenticated API client configured with mock JWT")
    yield api_client
    api_client.clear_auth_token()
