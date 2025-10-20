# Complete Setup Guide

This guide provides detailed instructions for setting up the Kapybara Blog application from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Database Migration & Seeding](#database-migration--seeding)
6. [Development Server](#development-server)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

- **Node.js** (version 18 or higher)

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm, yarn, or pnpm** (package manager)

  - npm comes with Node.js
  - For yarn: `npm install -g yarn`
  - For pnpm: `npm install -g pnpm`

- **Git** (for version control)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Recommended Tools

- **VS Code** with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

## Local Development Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/kapybara-blog.git

# Navigate to the project directory
cd kapybara-blog

# Verify you're in the correct directory
ls -la
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

This will install all dependencies listed in `package.json`, including:

- Next.js 15 with React 19
- tRPC for API layer
- Drizzle ORM for database operations
- TipTap for rich text editing
- Tailwind CSS for styling

## Database Configuration

### Option 1: Neon (Recommended for beginners)

Neon provides serverless PostgreSQL with a generous free tier.

1. **Create Account**

   - Go to [neon.tech](https://neon.tech/)
   - Sign up with GitHub, Google, or email

2. **Create Project**

   - Click "Create Project"
   - Choose a project name (e.g., "kapybara-blog")
   - Select a region close to your users
   - Choose PostgreSQL version (latest recommended)

3. **Get Connection String**
   - After project creation, copy the connection string
   - It looks like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

### Option 2: Local PostgreSQL

If you prefer running PostgreSQL locally:

1. **Install PostgreSQL**

   ```bash
   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**

   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database and user
   CREATE DATABASE kapybara_blog;
   CREATE USER blog_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE kapybara_blog TO blog_user;
   \q
   ```

3. **Connection String**
   ```
   postgresql://blog_user:your_password@localhost:5432/kapybara_blog
   ```

### Option 3: Other Cloud Providers

- **Supabase**: [supabase.com](https://supabase.com/) - Free tier with additional features
- **Railway**: [railway.app](https://railway.app/) - Simple deployment platform
- **Heroku Postgres**: [heroku.com](https://www.heroku.com/postgres) - Reliable managed PostgreSQL

## Environment Variables

### 1. Create Environment File

```bash
# Copy the example file
cp .env.example .env.local

# Or create manually
touch .env.local
```

### 2. Configure Variables

Edit `.env.local` with your preferred text editor:

```env
# Database Configuration (Required)
DATABASE_URL="your_postgresql_connection_string_here"

# Application URL (Optional - for development)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Example Configurations

**For Neon:**

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**For Local PostgreSQL:**

```env
DATABASE_URL="postgresql://blog_user:your_password@localhost:5432/kapybara_blog"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Verify Configuration

Test your database connection:

```bash
# This should not throw any errors
npm run drizzle:generate
```

## Database Migration & Seeding

### 1. Generate Migration Files

```bash
# Generate migration files based on schema
npm run drizzle:generate
```

This creates migration files in the `migrations/` directory based on your schema definition.

### 2. Apply Migrations

```bash
# Push schema changes to your database
npm run drizzle:push
```

This command:

- Creates the necessary tables (`posts`, `categories`, `post_categories`)
- Sets up relationships and constraints
- Applies any schema changes

### 3. Seed Database (Optional)

Populate your database with sample data:

```bash
# Add sample categories
npm run drizzle:seed
```

This creates 20 sample categories with:

- Random category names
- Sample descriptions
- URL-friendly slugs

### 4. Verify Database Setup

You can verify the setup by checking your database:

**For Neon:**

- Use the Neon dashboard SQL editor
- Run: `SELECT * FROM categories;`

**For Local PostgreSQL:**

```bash
psql postgresql://blog_user:your_password@localhost:5432/kapybara_blog
\dt  # List tables
SELECT * FROM categories LIMIT 5;
\q
```

## Development Server

### 1. Start Development Server

```bash
# Start the development server
npm run dev

# The server will start on http://localhost:3000
```

### 2. Verify Application

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

You should see:

- The Kapybara Blog homepage
- Category management interface
- Blog creation form
- Sample categories (if you ran the seed command)

### 3. Test Features

Try the following to ensure everything works:

1. **Create a Category**

   - Click "Manage Categories"
   - Add a new category with name, description, and slug

2. **Create a Blog Post**

   - Click "Create New Blog"
   - Fill in title, content, author, and slug
   - Select categories
   - Save the post

3. **View Blog Posts**
   - Navigate back to the homepage
   - See your created blog posts
   - Filter by categories

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:

- Vercel deployment
- Environment variable configuration
- Database setup in production
- Custom domain configuration

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Errors

**Error**: `Connection refused` or `Database connection failed`

**Solutions**:

- Verify your `DATABASE_URL` is correct
- Check if your database server is running
- Ensure firewall allows connections
- For cloud databases, check IP whitelist settings

#### 2. Migration Errors

**Error**: `Migration failed` or `Table already exists`

**Solutions**:

```bash
# Reset migrations (WARNING: This will delete all data)
rm -rf migrations/
npm run drizzle:generate
npm run drizzle:push

# Or manually drop tables and re-run migrations
```

#### 3. Dependency Issues

**Error**: `Module not found` or `Package not installed`

**Solutions**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or clear npm cache
npm cache clean --force
npm install
```

#### 4. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

#### 5. TypeScript Errors

**Error**: Type errors during development

**Solutions**:

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Restart TypeScript server in VS Code
# Command Palette > "TypeScript: Restart TS Server"
```

#### 6. Environment Variable Issues

**Error**: `Environment variable not found`

**Solutions**:

- Ensure `.env.local` exists in project root
- Check variable names match exactly (case-sensitive)
- Restart development server after adding variables
- Verify no extra spaces or quotes in variable values

### Getting Help

If you encounter issues not covered here:

1. **Check the logs**: Look at terminal output for specific error messages
2. **Verify prerequisites**: Ensure all required software is installed
3. **Check GitHub Issues**: Look for similar problems in the repository
4. **Create an Issue**: If you find a bug, please report it on GitHub

### Development Tips

1. **Hot Reloading**: The development server supports hot reloading for most changes
2. **Database Changes**: After schema changes, run `npm run drizzle:generate` and `npm run drizzle:push`
3. **Type Safety**: Take advantage of TypeScript - it will catch many errors at compile time
4. **Debugging**: Use browser developer tools and VS Code debugger for troubleshooting

## Next Steps

After successful setup:

1. **Customize the Application**

   - Modify components in `components/`
   - Update styling in `app/globals.css`
   - Add new features as needed

2. **Learn the Codebase**

   - Read [API.md](./API.md) for tRPC documentation
   - Explore the database schema in `src/schema.ts`
   - Understand the component structure

3. **Deploy to Production**

   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment
   - Set up monitoring and analytics
   - Configure custom domain

4. **Contribute**
   - Fork the repository
   - Make improvements
   - Submit pull requests

Happy coding! 🚀
