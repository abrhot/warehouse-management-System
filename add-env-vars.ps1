# Add Environment Variables to Vercel
# Run this script to add all required environment variables

$DATABASE_URL = "postgresql://neondb_owner:npg_RMf8sEKjeC0H@ep-raspy-dream-ahbq2wfw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
$JWT_SECRET = "wms-sys-jwt-secret-key-2024-production-secure-random-string"
$NODE_ENV = "production"

Write-Host "Adding DATABASE_URL..." -ForegroundColor Green
echo $DATABASE_URL | vercel env add DATABASE_URL production

Write-Host "`nAdding JWT_SECRET..." -ForegroundColor Green
echo $JWT_SECRET | vercel env add JWT_SECRET production

Write-Host "`nAdding NODE_ENV..." -ForegroundColor Green
echo $NODE_ENV | vercel env add NODE_ENV production

Write-Host "`n✅ All environment variables added!" -ForegroundColor Green
Write-Host "`nNow redeploy with: vercel --prod" -ForegroundColor Yellow
