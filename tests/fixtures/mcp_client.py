"""
MCP Client for database operations via backend API.

This module provides a Python async client for interacting with the backend's
MCP (Model Context Protocol) endpoints for database seeding, querying, and cleanup.
Uses the authenticated MCP routes defined in backend/src/routes/mcp.ts.
"""

import logging
import aiohttp
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class MCPClient:
    """
    Async HTTP client for MCP database operations.
    
    Communicates with backend MCP endpoints to perform:
    - SELECT queries with filtering and pagination
    - INSERT operations for data seeding
    - UPSERT operations for data updates
    - DELETE operations for cleanup
    """
    
    def __init__(self, base_url: str, api_key: str):
        """
        Initialize MCP client.
        
        Args:
            base_url: Base URL of the backend API (e.g., http://localhost:3001)
            api_key: MCP API key for authentication (from MCP_API_KEY env var)
        """
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self._session: Optional[aiohttp.ClientSession] = None
        logger.info(f"MCPClient initialized with base URL: {self.base_url}")
    
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session."""
        if self._session is None or self._session.closed:
            connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
            timeout = aiohttp.ClientTimeout(total=30)
            self._session = aiohttp.ClientSession(connector=connector, timeout=timeout)
        return self._session
    
    async def close(self) -> None:
        """Close the HTTP session."""
        if self._session and not self._session.closed:
            await self._session.close()
            logger.info("MCPClient session closed")
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers with MCP authentication."""
        return {
            "Content-Type": "application/json",
            "x-mcp-key": self.api_key,
        }
    
    async def select(
        self,
        table: str,
        columns: str = "*",
        filters: Optional[List[Dict[str, Any]]] = None,
        limit: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Query data from a table with optional filters and limit.
        
        Args:
            table: Table name
            columns: Columns to select (default: "*" for all)
            filters: List of filter objects with {col, op, value}
                     op can be: "eq", "neq", "like", "in"
            limit: Maximum number of rows to return
        
        Returns:
            List of row objects
        
        Raises:
            MCPException: If the request fails
        """
        session = await self._get_session()
        url = f"{self.base_url}/api/mcp/select"
        
        payload = {
            "table": table,
            "columns": columns,
            "filters": filters or [],
            "limit": limit,
        }
        
        logger.info(f"MCP SELECT: {table} (columns: {columns})")
        
        try:
            async with session.post(url, json=payload, headers=self._get_headers()) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise MCPException(f"MCP SELECT failed with status {resp.status}: {error_text}")
                
                result = await resp.json()
                data = result.get("data", [])
                logger.info(f"MCP SELECT returned {len(data)} rows")
                return data
        except aiohttp.ClientError as e:
            raise MCPException(f"MCP SELECT request failed: {str(e)}")
    
    async def insert(
        self,
        table: str,
        rows: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Insert rows into a table.
        
        Args:
            table: Table name
            rows: List of row objects to insert
        
        Returns:
            List of inserted rows (with generated IDs)
        
        Raises:
            MCPException: If the request fails
        """
        session = await self._get_session()
        url = f"{self.base_url}/api/mcp/insert"
        
        payload = {
            "table": table,
            "rows": rows,
        }
        
        logger.info(f"MCP INSERT: {table} ({len(rows)} rows)")
        
        try:
            async with session.post(url, json=payload, headers=self._get_headers()) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise MCPException(f"MCP INSERT failed with status {resp.status}: {error_text}")
                
                result = await resp.json()
                data = result.get("data", [])
                logger.info(f"MCP INSERT completed: {len(data)} rows inserted")
                return data
        except aiohttp.ClientError as e:
            raise MCPException(f"MCP INSERT request failed: {str(e)}")
    
    async def upsert(
        self,
        table: str,
        rows: List[Dict[str, Any]],
        on_conflict: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Upsert rows into a table (insert or update on conflict).
        
        Args:
            table: Table name
            rows: List of row objects to upsert
            on_conflict: Column(s) to use for conflict detection (default: "id")
        
        Returns:
            List of upserted rows
        
        Raises:
            MCPException: If the request fails
        """
        session = await self._get_session()
        url = f"{self.base_url}/api/mcp/upsert"
        
        payload = {
            "table": table,
            "rows": rows,
            "onConflict": on_conflict or "id",
        }
        
        logger.info(f"MCP UPSERT: {table} ({len(rows)} rows, on_conflict={on_conflict})")
        
        try:
            async with session.post(url, json=payload, headers=self._get_headers()) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise MCPException(f"MCP UPSERT failed with status {resp.status}: {error_text}")
                
                result = await resp.json()
                data = result.get("data", [])
                logger.info(f"MCP UPSERT completed: {len(data)} rows affected")
                return data
        except aiohttp.ClientError as e:
            raise MCPException(f"MCP UPSERT request failed: {str(e)}")
    
    async def delete(
        self,
        table: str,
        filters: Optional[List[Dict[str, Any]]] = None,
    ) -> int:
        """
        Delete rows from a table with optional filters.
        
        Args:
            table: Table name
            filters: List of filter objects with {col, op, value}
                     op can be: "eq", "in"
                     If no filters, all rows are deleted!
        
        Returns:
            Number of rows deleted
        
        Raises:
            MCPException: If the request fails
        """
        if not filters:
            logger.warning(f"MCP DELETE: {table} with no filters - deleting all rows!")
        
        session = await self._get_session()
        url = f"{self.base_url}/api/mcp/delete"
        
        payload = {
            "table": table,
            "filters": filters or [],
        }
        
        logger.info(f"MCP DELETE: {table}")
        
        try:
            async with session.post(url, json=payload, headers=self._get_headers()) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise MCPException(f"MCP DELETE failed with status {resp.status}: {error_text}")
                
                result = await resp.json()
                # The count of deleted rows might be in the response
                count = len(result.get("data", []))
                logger.info(f"MCP DELETE completed: {count} rows deleted")
                return count
        except aiohttp.ClientError as e:
            raise MCPException(f"MCP DELETE request failed: {str(e)}")
    
    async def clean_test_data(self) -> None:
        """
        Clean up all test data from tables.
        Deletes all rows from test data tables to reset state between tests.
        """
        tables_to_clean = [
            "menu_items",
            "chefs",
            "blog_posts",
            "contact_submissions",
            "subscriptions",
        ]
        
        logger.info("Starting test data cleanup")
        
        for table in tables_to_clean:
            try:
                await self.delete(table)
                logger.info(f"Cleaned {table}")
            except MCPException as e:
                logger.warning(f"Failed to clean {table}: {str(e)}")
        
        logger.info("Test data cleanup completed")


class MCPException(Exception):
    """Exception raised by MCP client operations."""
    pass
