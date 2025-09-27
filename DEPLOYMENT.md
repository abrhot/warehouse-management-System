# Warehouse Management System - Deployment Guide

## Vercel Deployment Steps

### 1. Environment Variables
Set these environment variables in your Vercel dashboard:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-secure-random-string-here
NEXTAUTH_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### 2. Database Setup
Your PostgreSQL database should be accessible from Vercel. Popular options:
- **Neon** (recommended): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com

### 3. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set the environment variables
3. Deploy

### 4. Initialize Database
After deployment, visit these endpoints to set up your database:

1. **Health Check**: `https://your-app.vercel.app/api/health`
   - Check database connection and user count

2. **Create Admin User**: `https://your-app.vercel.app/api/create-admin`
   - Creates admin user if it doesn't exist
   - Returns login credentials

3. **Seed Database** (optional): `https://your-app.vercel.app/api/seed`
   - Adds sample data for testing

### 5. Login Credentials
After running the create-admin endpoint:
- **Email**: admin@warehouse.com
- **Password**: test123

## Troubleshooting

### "User not found" Error
This usually means the database is empty. Follow these steps:

1. Check health endpoint: `/api/health`
2. If userCount is 0, run: `/api/create-admin`
3. Try logging in with the returned credentials

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure database is accessible from Vercel's servers
- Check database provider's connection limits

### Build Failures
- Ensure all environment variables are set
- Check that Prisma migrations are compatible with your database
- Verify Node.js version compatibility

## Production Checklist
- [ ] Environment variables set in Vercel
- [ ] Database accessible and migrations applied
- [ ] Admin user created
- [ ] Login functionality tested
- [ ] Health check endpoint returns success
