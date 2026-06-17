@echo off
REM Pre-deployment verification script for Windows
REM Run this before deploying to production

setlocal enabledelayedexpansion

echo.
echo Pre-Deployment Verification for Get-Mumm
echo =========================================
echo.

set PASSED=0
set FAILED=0
set WARNINGS=0

REM 1. Check Node version
echo 1. Checking Node version...
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo   Node version: !NODE_VERSION!
set /a PASSED+=1
echo.

REM 2. Check pnpm
echo 2. Checking pnpm...
where pnpm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('pnpm -v') do set PNPM_VERSION=%%i
    echo   [OK] pnpm installed: !PNPM_VERSION!
    set /a PASSED+=1
) else (
    echo   [ERROR] pnpm not installed. Install with: npm install -g pnpm
    set /a FAILED+=1
)
echo.

REM 3. Check backend structure
echo 3. Checking backend structure...
if exist "backend" if exist "backend\package.json" (
    echo   [OK] Backend directory found
    set /a PASSED+=1
) else (
    echo   [ERROR] Backend directory or package.json not found
    set /a FAILED+=1
)

if exist "backend\src\index.ts" (
    echo   [OK] Backend entry point found
    set /a PASSED+=1
) else (
    echo   [ERROR] Backend entry point not found
    set /a FAILED+=1
)

if exist "backend\build.mjs" (
    echo   [OK] Backend build script found
    set /a PASSED+=1
) else (
    echo   [ERROR] Backend build script not found
    set /a FAILED+=1
)
echo.

REM 4. Check frontend structure
echo 4. Checking frontend structure...
if exist "frontend" if exist "frontend\package.json" (
    echo   [OK] Frontend directory found
    set /a PASSED+=1
) else (
    echo   [ERROR] Frontend directory or package.json not found
    set /a FAILED+=1
)

if exist "frontend\vite.config.ts" (
    echo   [OK] Frontend Vite config found
    set /a PASSED+=1
) else (
    echo   [ERROR] Frontend Vite config not found
    set /a FAILED+=1
)
echo.

REM 5. Check deployment configs
echo 5. Checking deployment configurations...
if exist "vercel.json" (
    echo   [OK] vercel.json found
    set /a PASSED+=1
) else (
    echo   [ERROR] vercel.json not found
    set /a FAILED+=1
)

if exist "netlify.toml" (
    echo   [OK] netlify.toml found
    set /a PASSED+=1
) else (
    echo   [ERROR] netlify.toml not found
    set /a FAILED+=1
)

if exist ".nvmrc" (
    for /f "tokens=*" %%i in (.nvmrc) do set NVMRC_VERSION=%%i
    echo   [OK] .nvmrc found (version: !NVMRC_VERSION!)
    set /a PASSED+=1
) else (
    echo   [ERROR] .nvmrc not found
    set /a FAILED+=1
)
echo.

REM 6. Check env files
echo 6. Checking environment templates...
if exist "backend\.env.production" (
    echo   [OK] backend\.env.production template found
    set /a PASSED+=1
) else (
    echo   [WARN] backend\.env.production template not found
    set /a WARNINGS+=1
)

if exist "frontend\.env.production" (
    echo   [OK] frontend\.env.production template found
    set /a PASSED+=1
) else (
    echo   [WARN] frontend\.env.production template not found
    set /a WARNINGS+=1
)
echo.

REM 7. Check .gitignore
echo 7. Checking .gitignore...
findstr /M "\.env" .gitignore >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] .env files in .gitignore
    set /a PASSED+=1
) else (
    echo   [ERROR] .env not in .gitignore
    set /a FAILED+=1
)

findstr /M "node_modules" .gitignore >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] node_modules in .gitignore
    set /a PASSED+=1
) else (
    echo   [ERROR] node_modules not in .gitignore
    set /a FAILED+=1
)
echo.

REM 8. Check directories exist
echo 8. Checking source directories...
if exist "backend\src" (
    echo   [OK] backend\src found
    set /a PASSED+=1
) else (
    echo   [ERROR] backend\src not found
    set /a FAILED+=1
)

if exist "frontend\src" (
    echo   [OK] frontend\src found
    set /a PASSED+=1
) else (
    echo   [ERROR] frontend\src not found
    set /a FAILED+=1
)
echo.

REM 9. Summary
echo =========================================
echo Pre-Deployment Verification Summary
echo =========================================
echo Passed: !PASSED!
if !WARNINGS! GTR 0 (
    echo Warnings: !WARNINGS!
)
if !FAILED! GTR 0 (
    echo Failed: !FAILED!
)
echo.

if !FAILED! EQU 0 (
    echo All basic checks passed!
    echo.
    echo Next steps:
    echo 1. Review QUICK_DEPLOY_GUIDE.md
    echo 2. Set environment variables in Vercel and Netlify
    echo 3. Push to main: git push origin main
    echo 4. Monitor deployments on Vercel and Netlify dashboards
    exit /b 0
) else (
    echo Fix the above errors before deploying.
    exit /b 1
)
