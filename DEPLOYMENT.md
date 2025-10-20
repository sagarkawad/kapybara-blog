# Deployment Guide - Vercel

This guide will walk you through deploying your Kapybara Blog to Vercel with a PostgreSQL database.

## Prerequisites

- A GitHub/GitLab/Bitbucket repository with your code
- A PostgreSQL database (we recommend [Neon](https://neon.tech/) for serverless PostgreSQL)
- A Vercel account

## Step 1: Database Setup

### Option A: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech/) and create an account
2. Create a new project
3. Copy your connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

### Option B: Other PostgreSQL Providers

You can also use:

- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [PlanetScale](https://planetscale.com/) (MySQL)
- Any other PostgreSQL provider

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com/) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect it's a Next.js project
5. Configure your environment variables (see below)
6. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts to configure your project
```

## Step 3: Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

| Variable              | Value                                                     | Environment                      |
| --------------------- | --------------------------------------------------------- | -------------------------------- |
| `DATABASE_URL`        | Your PostgreSQL connection string                         | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL (e.g., `https://your-app.vercel.app`) | Production, Preview              |

### Setting Environment Variables via CLI

```bash
# Set production environment variables
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_APP_URL production

# Set preview environment variables (for PR deployments)
vercel env add DATABASE_URL preview
vercel env add NEXT_PUBLIC_APP_URL preview
```

## Step 4: Database Migration

After your first deployment, you need to run the database migrations:

### Option A: Local Migration (Recommended)

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run migrations
npm run drizzle:push

# Optional: Seed with sample data
npm run drizzle:seed
```

### Option B: Vercel Functions (Advanced)

You can create a one-time migration function:

1. Create `pages/api/migrate.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    res.status(200).json({ message: "Migration completed" });
  } catch (error) {
    res.status(500).json({ error: "Migration failed" });
  }
}
```

2. Deploy and call the endpoint once:

```bash
curl -X POST https://your-app.vercel.app/api/migrate
```

3. Delete the migration file after use for security.

## Step 5: Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Navigate to Settings → Domains
3. Add your custom domain
4. Update your DNS records as instructed by Vercel
5. Update `NEXT_PUBLIC_APP_URL` environment variable to your custom domain

## Step 6: Verify Deployment

1. Visit your deployed application
2. Test creating categories and blog posts
3. Verify database connections are working
4. Check that all features function correctly

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify your `DATABASE_URL` is correct
   - Ensure your database allows connections from Vercel's IP ranges
   - Check that SSL is properly configured (`?sslmode=require`)

2. **Build Errors**

   - Check your build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript types are correct

3. **Environment Variable Issues**
   - Ensure variables are set for the correct environments
   - Redeploy after adding new environment variables
   - Check variable names match exactly (case-sensitive)

### Performance Optimization

1. **Database Connection Pooling**

   - Neon automatically handles connection pooling
   - For other providers, consider using connection pooling

2. **Caching**

   - Vercel automatically caches static assets
   - Consider implementing API response caching for better performance

3. **Edge Functions**
   - Consider using Vercel Edge Functions for better global performance

## Monitoring and Maintenance

1. **Analytics**

   - Enable Vercel Analytics in your dashboard
   - Monitor Core Web Vitals and performance metrics

2. **Error Tracking**

   - Consider integrating Sentry or similar error tracking
   - Monitor Vercel function logs

3. **Database Monitoring**
   - Monitor database performance and usage
   - Set up alerts for connection limits or performance issues

## Scaling Considerations

1. **Database Scaling**

   - Neon automatically scales based on usage
   - Monitor connection limits and query performance

2. **Vercel Limits**

   - Be aware of Vercel's function execution limits
   - Consider Pro plan for higher limits if needed

3. **CDN and Caching**
   - Leverage Vercel's global CDN
   - Implement proper caching strategies

## Security Best Practices

1. **Environment Variables**

   - Never commit `.env.local` to version control
   - Rotate database credentials regularly
   - Use different databases for production and preview

2. **Database Security**

   - Enable SSL connections
   - Use strong passwords
   - Regularly update dependencies

3. **Application Security**
   - Keep Next.js and dependencies updated
   - Implement proper input validation
   - Consider rate limiting for API endpoints

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

For project-specific issues, please check the main README.md or open an issue on GitHub.
