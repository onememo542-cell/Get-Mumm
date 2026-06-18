@echo off
REM E2E Testing Infrastructure - Local Test Runner for Windows
REM This script runs the test suite locally with proper setup

setlocal enabledelayedexpansion

echo ===============================================
echo E2E Testing Infrastructure - Local Validation
echo ===============================================
echo.

REM Step 1: Check Python installation
echo Step 1: Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed. Please install Python 3.11+
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo OK: Found %PYTHON_VERSION%
echo.

REM Step 2: Install dependencies
echo Step 2: Installing test dependencies...
python -m pip install --upgrade pip >nul 2>&1
python -m pip install -q pytest pytest-asyncio pytest-xdist pytest-timeout playwright aiohttp requests psycopg2-binary allure-pytest python-dotenv 2>nul
if errorlevel 1 (
    echo Creating requirements-test.txt...
    (
        echo pytest==7.4.3
        echo pytest-asyncio==0.21.1
        echo pytest-xdist==3.5.0
        echo pytest-timeout==2.2.0
        echo playwright==1.40.0
        echo aiohttp==3.9.1
        echo requests==2.31.0
        echo psycopg2-binary==2.9.9
        echo allure-pytest==2.13.2
        echo python-dotenv==1.0.0
    ) > requirements-test.txt
    python -m pip install -q -r requirements-test.txt
)
echo OK: Dependencies installed
echo.

REM Step 3: Install Playwright browsers
echo Step 3: Installing Playwright browsers...
python -m playwright install chromium >nul 2>&1
echo OK: Playwright browsers installed
echo.

REM Step 4: Create directories
echo Step 4: Creating test output directories...
if not exist test-results mkdir test-results
if not exist allure-results mkdir allure-results
if not exist screenshots mkdir screenshots
if not exist debug mkdir debug
echo OK: Output directories ready
echo.

REM Step 5: Collect tests
echo Step 5: Collecting tests...
for /f "tokens=*" %%i in ('python -m pytest tests/ --collect-only -q 2^>nul ^| findstr /R "tests selected"') do set COLLECT_OUTPUT=%%i
echo OK: %COLLECT_OUTPUT%
echo.

REM Step 6: Run tests
echo Step 6: Running E2E test suite...
echo Note: Tests will attempt to connect to:
echo   - Frontend: http://localhost:3000 (or TEST_APP_URL env var)
echo   - API: http://localhost:3001 (or TEST_API_URL env var)
echo   - Database: localhost:5433 (or TEST_DB_HOST/PORT env vars)
echo.

python -m pytest tests/ ^
    --junit-xml=test-results/junit.xml ^
    --alluredir=allure-results ^
    -v ^
    -x ^
    --tb=short

set PYTEST_EXIT=%ERRORLEVEL%

echo.
if %PYTEST_EXIT% equ 0 (
    echo ===============================================
    echo OK: All tests passed!
    echo ===============================================
) else (
    echo ===============================================
    echo ERROR: Tests failed. Review output above.
    echo ===============================================
)

echo.
echo Test Results:
echo   - JUnit XML: test-results/junit.xml
echo   - Allure results: allure-results/
echo   - Screenshots: screenshots/
echo   - Test logs: test-results/test.log
echo.
echo To view Allure report:
echo   allure serve allure-results/
echo.

exit /b %PYTEST_EXIT%
