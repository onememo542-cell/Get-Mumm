#!/bin/bash

# E2E Testing Infrastructure - Local Test Runner
# This script runs the test suite locally with proper setup

set -e

echo "==============================================="
echo "E2E Testing Infrastructure - Local Validation"
echo "==============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Python installation
echo -e "${YELLOW}Step 1: Checking Python installation...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.11+${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo -e "${GREEN}✓ Found: $PYTHON_VERSION${NC}"
echo ""

# Step 2: Install/upgrade pip and dependencies
echo -e "${YELLOW}Step 2: Installing test dependencies...${NC}"
python3 -m pip install --upgrade pip > /dev/null 2>&1
python3 -m pip install -q -r requirements-test.txt || {
    echo -e "${RED}Failed to install dependencies. Checking if requirements-test.txt exists...${NC}"
    if [ ! -f requirements-test.txt ]; then
        echo -e "${RED}requirements-test.txt not found. Creating it...${NC}"
        cat > requirements-test.txt << 'EOF'
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-xdist==3.5.0
pytest-timeout==2.2.0
playwright==1.40.0
aiohttp==3.9.1
requests==2.31.0
psycopg2-binary==2.9.9
allure-pytest==2.13.2
python-dotenv==1.0.0
EOF
        python3 -m pip install -q -r requirements-test.txt
    fi
}
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Install Playwright browsers
echo -e "${YELLOW}Step 3: Installing Playwright browsers...${NC}"
python3 -m playwright install chromium > /dev/null 2>&1
echo -e "${GREEN}✓ Playwright browsers installed${NC}"
echo ""

# Step 4: Create necessary directories
echo -e "${YELLOW}Step 4: Creating test output directories...${NC}"
mkdir -p test-results allure-results screenshots debug
echo -e "${GREEN}✓ Output directories ready${NC}"
echo ""

# Step 5: Collect tests
echo -e "${YELLOW}Step 5: Collecting tests...${NC}"
TEST_COUNT=$(python3 -m pytest tests/ --collect-only -q 2>/dev/null | tail -1 | grep -oP '\d+(?= tests selected)' || echo "0")
if [ "$TEST_COUNT" -eq 0 ]; then
    echo -e "${RED}✗ No tests found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Found $TEST_COUNT tests${NC}"
echo ""

# Step 6: Run tests
echo -e "${YELLOW}Step 6: Running E2E test suite...${NC}"
echo "Note: Tests will attempt to connect to:"
echo "  - Frontend: ${TEST_APP_URL:-http://localhost:3000}"
echo "  - API: ${TEST_API_URL:-http://localhost:3001}"
echo "  - Database: ${TEST_DB_HOST:-localhost}:${TEST_DB_PORT:-5433}"
echo ""

python3 -m pytest tests/ \
    --junit-xml=test-results/junit.xml \
    --alluredir=allure-results \
    -v \
    -x \
    --tb=short \
    2>&1

PYTEST_EXIT=$?

echo ""
if [ $PYTEST_EXIT -eq 0 ]; then
    echo -e "${GREEN}==============================================="
    echo "✓ All tests passed!"
    echo "===============================================${NC}"
else
    echo -e "${RED}==============================================="
    echo "✗ Tests failed. Review output above for details."
    echo "===============================================${NC}"
fi

echo ""
echo "Test Results:"
echo "  - JUnit XML: test-results/junit.xml"
echo "  - Allure results: allure-results/"
echo "  - Screenshots: screenshots/"
echo "  - Test logs: test-results/test.log"
echo ""
echo "To view Allure report:"
echo "  allure serve allure-results/"
echo ""

exit $PYTEST_EXIT
