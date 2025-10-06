@echo off
echo ========================================
echo   Warehouse Management System Deploy
echo ========================================
echo.

echo Step 1: Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to Vercel...
echo Please make sure you're logged in to Vercel CLI
echo Run: vercel login (if not already logged in)
echo.
call vercel --prod
if %errorlevel% neq 0 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment completed successfully!
echo ========================================
echo.
echo Your warehouse management system has been deployed with all fixes:
echo - Fixed logout functionality
echo - Fixed unauthorized errors  
echo - Fixed product request creation
echo - Fixed user creation
echo - Improved authentication flow
echo.
echo Working credentials:
echo - Admin: admin@warehouse.com / test123
echo - Test User: test@example.com / test123
echo.
pause
