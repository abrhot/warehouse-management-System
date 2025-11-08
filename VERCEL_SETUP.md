# Vercel Deployment - Final Steps

## Environment Variables Added Locally ✅

Your `.env.local` file now contains:
```
DATABASE_URL=postgresql://neondb_owner:npg_RMf8sEKjeC0H@ep-raspy-dream-ahbq2wfw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=wms-sys-jwt-secret-key-2024
NODE_ENV=production
```

## Add to Vercel Dashboard NOW:

1. Go to: https://vercel.com/abrishyekifle-3661s-projects/warehouse-management/settings/environment-variables

2. Add these 3 variables (click "Add" button for each):

### Variable 1: DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://neondb_owner:npg_RMf8sEKjeC0H@ep-raspy-dream-ahbq2wfw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 2: JWT_SECRET
```
Key: JWT_SECRET
Value: wms-sys-jwt-secret-key-2024
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 3: NODE_ENV
```
Key: NODE_ENV
Value: production
Environments: ✅ Production only
```

3. Click "Save" after adding each variable

4. Go to Deployments tab

5. Click the ⋯ menu on the latest failed deployment

6. Click "Redeploy"

7. Your site will be live at: **https://warehouse-management-xi-seven.vercel.app**

## After Successful Deploy:

Visit: https://warehouse-management-xi-seven.vercel.app/api/seed-production

This will create demo users:
- Admin: admin@warehouse.com / 123123
- User: user@warehouse.com / 123123
