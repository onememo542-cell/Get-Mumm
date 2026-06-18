"""
Global pytest configuration and fixtures for the E2E test suite.

This module provides:
- Global fixture setup/teardown
- Test session hooks
- Common utilities available to all tests
- Environment configuration
"""

import os
import logging
import pytest
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Register pytest plugins and fixtures
pytest_plugins = [
    "tests.fixtures.pages",
    "tests.fixtures.database",
    "tests.fixtures.api_client",
]

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('test-results/test.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


def pytest_configure(config):
    """
    Pytest hook called after command line options have been parsed
    and all plugins and initial conftest files have been loaded.
    """
    logger.info("=" * 80)
    logger.info("E2E Test Suite Starting")
    logger.info("=" * 80)
    
    # Create test results directory if it doesn't exist
    test_results_dir = Path("test-results")
    test_results_dir.mkdir(exist_ok=True)
    
    # Create allure results directory
    allure_results_dir = Path("allure-results")
    allure_results_dir.mkdir(exist_ok=True)
    
    # Create screenshots directory
    screenshots_dir = Path("screenshots")
    screenshots_dir.mkdir(exist_ok=True)


def pytest_sessionstart(session):
    """
    Called after the Session object has been created and before performing collection
    and entering the run test loop.
    """
    logger.info(f"Test session started with {len(session.config.args)} arguments")


def pytest_sessionfinish(session, exitstatus):
    """
    Called after the whole test run finished, right before returning the exit status
    to the system.
    """
    logger.info("=" * 80)
    logger.info(f"E2E Test Suite Finished - Exit Status: {exitstatus}")
    logger.info("=" * 80)


@pytest.fixture(scope="session")
def test_env():
    """
    Session-scoped fixture providing test environment configuration.
    """
    return {
        "app_url": os.getenv("TEST_APP_URL", "http://localhost:3000"),
        "api_url": os.getenv("TEST_API_URL", "http://localhost:3001"),
        "db_host": os.getenv("TEST_DB_HOST", "localhost"),
        "db_port": int(os.getenv("TEST_DB_PORT", "5433")),
        "db_name": os.getenv("TEST_DB_NAME", "test_db"),
        "db_user": os.getenv("TEST_DB_USER", "test_user"),
        "db_password": os.getenv("TEST_DB_PASSWORD", "test_password"),
    }


@pytest.fixture(autouse=True)
def log_test_execution(request):
    """
    Function-scoped fixture that logs test execution start and completion.
    Applied to all tests automatically.
    """
    logger.info(f"Starting: {request.node.name}")
    yield
    logger.info(f"Completed: {request.node.name}")
