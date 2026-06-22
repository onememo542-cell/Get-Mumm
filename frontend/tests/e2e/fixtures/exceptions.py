"""
Custom exception hierarchy for E2E test framework.

Provides specific exception types for different test failure scenarios
to enable precise error handling and debugging.
"""

import logging

logger = logging.getLogger(__name__)


class TestExecutionException(Exception):
    """
    Base exception class for all E2E test execution errors.
    """
    def __init__(self, message: str, context: dict = None):
        """
        Initialize test execution exception.
        
        Args:
            message: Error description
            context: Optional context dictionary with additional info
        """
        super().__init__(message)
        self.message = message
        self.context = context or {}
        logger.error(f"{self.__class__.__name__}: {message}", extra=self.context)


class PageLoadException(TestExecutionException):
    """
    Exception raised when page fails to load or element not found.
    """
    def __init__(self, message: str, selector: str = None, timeout: int = None):
        """
        Initialize page load exception.
        
        Args:
            message: Error description
            selector: CSS selector that failed to load
            timeout: Timeout value used (milliseconds)
        """
        context = {
            "selector": selector,
            "timeout": timeout
        }
        super().__init__(message, context)
        logger.error(f"PageLoadException - Selector: {selector}, Timeout: {timeout}ms")


class APIRequestException(TestExecutionException):
    """
    Exception raised when API request fails.
    """
    def __init__(self, message: str, endpoint: str = None, status_code: int = None, response_body: str = None):
        """
        Initialize API request exception.
        
        Args:
            message: Error description
            endpoint: API endpoint that failed
            status_code: HTTP status code
            response_body: Response body from API
        """
        context = {
            "endpoint": endpoint,
            "status_code": status_code,
            "response_body": response_body[:200] if response_body else None
        }
        super().__init__(message, context)
        logger.error(f"APIRequestException - {endpoint} ({status_code})")


class DatabaseException(TestExecutionException):
    """
    Exception raised when database operation fails.
    """
    def __init__(self, message: str, query: str = None, table: str = None):
        """
        Initialize database exception.
        
        Args:
            message: Error description
            query: SQL query that failed
            table: Database table involved
        """
        context = {
            "query": query[:100] if query else None,
            "table": table
        }
        super().__init__(message, context)
        logger.error(f"DatabaseException - Table: {table}")


class FixtureException(TestExecutionException):
    """
    Exception raised when test fixture setup/teardown fails.
    """
    def __init__(self, message: str, fixture_name: str = None, stage: str = "setup"):
        """
        Initialize fixture exception.
        
        Args:
            message: Error description
            fixture_name: Name of the fixture that failed
            stage: "setup" or "teardown"
        """
        context = {
            "fixture_name": fixture_name,
            "stage": stage
        }
        super().__init__(message, context)
        logger.error(f"FixtureException - {fixture_name} ({stage})")


class ValidationException(TestExecutionException):
    """
    Exception raised when test assertion or validation fails.
    """
    def __init__(self, message: str, expected: any = None, actual: any = None):
        """
        Initialize validation exception.
        
        Args:
            message: Error description
            expected: Expected value
            actual: Actual value
        """
        context = {
            "expected": expected,
            "actual": actual
        }
        super().__init__(message, context)
        logger.error(f"ValidationException - Expected: {expected}, Got: {actual}")


class TimeoutException(TestExecutionException):
    """
    Exception raised when operation times out.
    """
    def __init__(self, message: str, timeout_ms: int = None, operation: str = None):
        """
        Initialize timeout exception.
        
        Args:
            message: Error description
            timeout_ms: Timeout duration in milliseconds
            operation: Operation that timed out
        """
        context = {
            "timeout_ms": timeout_ms,
            "operation": operation
        }
        super().__init__(message, context)
        logger.error(f"TimeoutException - {operation} (timeout={timeout_ms}ms)")
