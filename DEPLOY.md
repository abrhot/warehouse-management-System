# Deploy to Vercel - WMS-sys.vercel.app

## Quick Deployment Steps

### 1. Push to GitHub (if not done already)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository for this project
4. **Project Settings:**
   - **Project Name**: `wms-sys` (this will be your URL: wms-sys.vercel.app)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run vercel-build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. **Environment Variables** - Click "Add" for each:
   ```
   DATABASE_URL = [Your Neon PostgreSQL URL]
   JWT_SECRET = [Any long random string, e.g., "your-super-secret-jwt-key-123456"]
   NODE_ENV = production
   ```

6. Click **"Deploy"**

7. Wait 2-3 minutes for build to complete

8. Your app will be live at: **https://wms-sys.vercel.app**

### 3. After First Deploy - Seed Database

Visit: `https://wms-sys.vercel.app/api/seed-production`

This will create:
- Admin user: admin@warehouse.com / 123123 (Sarah Johnson)
- Regular user: user@warehouse.com / 123123 (John Smith)
- Sample categories and products

### 4. Login and Test

Go to: `https://wms-sys.vercel.app`

**Demo Credentials:**
- Admin: `admin@warehouse.com` / `123123`
- User: `user@warehouse.com` / `123123`

---

## Environment Variables Needed

### DATABASE_URL (Neon/PostgreSQL)
Get from: https://console.neon.tech
Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

### JWT_SECRET
Any random string. Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use: `wms-sys-super-secret-jwt-key-2024-production`

---

## Troubleshooting

### Build Failed?
- Check DATABASE_URL is correctly set
- Check all environment variables are added
- Look at build logs in Vercel dashboard

### Database Empty?
- Visit `/api/seed-production` to create demo data
- Or manually create users via `/api/create-admin`

### 404 Errors?
- Check build output directory is `.next`
- Ensure framework preset is Next.js
- Redeploy if needed

---

## Your Links

- **Live App**: https://wms-sys.vercel.app
- **GitHub**: https://github.com/abrhot
- **Email**: abrihott@gmail.com

---

## Alternative: Vercel CLI

If you prefer CLI:

```bash
vercel login
vercel link
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel --prod
```

When prompted for project name, enter: `wms-sys`
