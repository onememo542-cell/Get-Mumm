#!/bin/bash

# Pre-deployment verification script
# Run this before deploying to production to catch issues early

set -e  # Exit on error

echo "🔍 Get-Mumm Pre-Deployment Verification"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# 1. Check Node version
echo "1️⃣  Checking Node version..."
NODE_VERSION=$(node -v)
if [[ $NODE_VERSION == v20* ]]; then
    check_pass "Node version: $NODE_VERSION"
else
    check_warn "Node version $NODE_VERSION detected, recommended: v20.x"
fi
echo ""

# 2. Check pnpm
echo "2️⃣  Checking pnpm..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    check_pass "pnpm installed: $PNPM_VERSION"
else
    check_fail "pnpm not installed. Install with: npm install -g pnpm"
fi
echo ""

# 3. Check backend exists
echo "3️⃣  Checking backend structure..."
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    check_pass "Backend directory found"
else
    check_fail "Backend directory or package.json not found"
fi

if [ -f "backend/src/index.ts" ]; then
    check_pass "Backend entry point found"
else
    check_fail "Backend entry point (src/index.ts) not found"
fi

if [ -f "backend/build.mjs" ]; then
    check_pass "Backend build script found"
else
    check_fail "Backend build script (build.mjs) not found"
fi
echo ""

# 4. Check frontend exists
echo "4️⃣  Checking frontend structure..."
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    check_pass "Frontend directory found"
else
    check_fail "Frontend directory or package.json not found"
fi

if [ -f "frontend/vite.config.ts" ]; then
    check_pass "Frontend Vite config found"
else
    check_fail "Frontend Vite config not found"
fi
echo ""

# 5. Check deployment configs
echo "5️⃣  Checking deployment configurations..."
if [ -f "vercel.json" ]; then
    check_pass "vercel.json found"
else
    check_fail "vercel.json not found. Run: cp vercel.json.example vercel.json"
fi

if [ -f "netlify.toml" ]; then
    check_pass "netlify.toml found"
else
    check_fail "netlify.toml not found. Run: cp netlify.toml.example netlify.toml"
fi

if [ -f ".nvmrc" ]; then
    NVMRC_VERSION=$(cat .nvmrc)
    check_pass ".nvmrc found (version: $NVMRC_VERSION)"
else
    check_fail ".nvmrc not found"
fi
echo ""

# 6. Check env files
echo "6️⃣  Checking environment files..."
if [ -f "backend/.env.production" ]; then
    check_pass "backend/.env.production template found"
else
    check_warn "backend/.env.production template not found"
fi

if [ -f "frontend/.env.production" ]; then
    check_pass "frontend/.env.production template found"
else
    check_warn "frontend/.env.production template not found"
fi

if [ -f ".env.example" ]; then
    check_pass ".env.example found"
else
    check_warn ".env.example not found"
fi
echo ""

# 7. Check .env files are not committed
echo "7️⃣  Checking for committed .env files..."
if git ls-files | grep -q "\.env$"; then
    check_fail ".env file is committed to git - remove it!"
else
    check_pass ".env file not committed"
fi

if git ls-files | grep -q "backend/\.env$"; then
    check_fail "backend/.env file is committed to git - remove it!"
else
    check_pass "backend/.env not committed"
fi
echo ""

# 8. Check .gitignore
echo "8️⃣  Checking .gitignore..."
if grep -q "\.env" .gitignore 2>/dev/null; then
    check_pass ".env files in .gitignore"
else
    check_fail ".env not in .gitignore"
fi

if grep -q "node_modules" .gitignore 2>/dev/null; then
    check_pass "node_modules in .gitignore"
else
    check_fail "node_modules not in .gitignore"
fi
echo ""

# 9. Check TypeScript
echo "9️⃣  Checking TypeScript files..."
if find backend/src -name "*.ts" | head -1 | grep -q .; then
    check_pass "Backend TypeScript files found"
else
    check_fail "No backend TypeScript files found"
fi

if find frontend/src -name "*.ts*" | head -1 | grep -q .; then
    check_pass "Frontend TypeScript files found"
else
    check_fail "No frontend TypeScript files found"
fi
echo ""

# 10. Check git status
echo "🔟 Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
    check_pass "Git working directory clean"
else
    check_warn "Uncommitted changes detected:"
    git status --short | sed 's/^/    /'
fi
echo ""

# 11. Try building locally
echo "1️⃣1️⃣  Attempting builds (this may take a minute)..."

# Backend build
if cd backend 2>/dev/null; then
    if pnpm build 2>/dev/null; then
        if [ -f "dist/index.mjs" ]; then
            check_pass "Backend builds successfully"
        else
            check_fail "Backend build succeeded but dist/index.mjs not found"
        fi
    else
        check_fail "Backend build failed - fix errors before deploying"
    fi
    cd - >/dev/null
else
    check_fail "Cannot navigate to backend directory"
fi

# Frontend build
if cd frontend 2>/dev/null; then
    if pnpm build 2>/dev/null; then
        if [ -d "dist/public" ]; then
            check_pass "Frontend builds successfully"
        else
            check_fail "Frontend build succeeded but dist/public not found"
        fi
    else
        check_fail "Frontend build failed - fix errors before deploying"
    fi
    cd - >/dev/null
else
    check_fail "Cannot navigate to frontend directory"
fi
echo ""

# 12. Summary
echo "========================================"
echo "📊 Pre-Deployment Verification Summary"
echo "========================================"
echo -e "${GREEN}Passed:${NC} $PASSED"
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
fi
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed:${NC} $FAILED"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✅ All checks passed! Ready to deploy."
    echo ""
    echo "📝 Next steps:"
    echo "1. Review QUICK_DEPLOY_GUIDE.md for deployment steps"
    echo "2. Set environment variables in Vercel and Netlify"
    echo "3. Push to main branch: git push origin main"
    echo "4. Monitor deployments on Vercel and Netlify dashboards"
    exit 0
else
    echo "❌ Fix the above errors before deploying."
    exit 1
fi
