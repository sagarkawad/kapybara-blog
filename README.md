# Kapybara Blog

A modern, full-stack blog application built with Next.js 15, tRPC, Drizzle ORM, and PostgreSQL. Features a rich text editor, category management, and a clean, responsive UI.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, React 19, TypeScript
- **Type-Safe API**: tRPC for end-to-end type safety
- **Rich Text Editor**: TipTap editor with formatting capabilities
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Category System**: Organize blogs with multiple categories
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Optimistic updates with React Query
- **SEO Friendly**: Dynamic routing with slug-based URLs

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: tRPC, Drizzle ORM, PostgreSQL
- **Database**: Neon PostgreSQL (serverless)
- **State Management**: Zustand, TanStack Query
- **Rich Text**: TipTap editor
- **Deployment**: Vercel (recommended)
- **Styling**: Tailwind CSS v4

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+
- npm, yarn, or pnpm
- A PostgreSQL database (we recommend [Neon](https://neon.tech) for easy setup)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/kapybara-blog.git
cd kapybara-blog
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Next.js Configuration (optional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Note**: Get your DATABASE_URL from your PostgreSQL provider. For Neon, it looks like:
> `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

### 4. Database Setup

Generate and push the database schema:

```bash
# Generate migration files
npm run drizzle:generate

# Push schema to database
npm run drizzle:push
```

### 5. Seed the Database (Optional)

Populate your database with sample categories:

```bash
npm run drizzle:seed
```

This will create 20 sample categories with random names and descriptions.

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
kapybara-blog/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── blogs/         # Blog API endpoints
│   │   ├── categories/    # Category API endpoints
│   │   └── trpc/          # tRPC API handler
│   ├── blog/              # Blog pages
│   │   └── [slug]/        # Dynamic blog post pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── providers/         # Context providers
│   ├── Blog.tsx           # Blog listing component
│   ├── BlogForm.tsx       # Blog creation/editing form
│   ├── BlogPost.tsx       # Individual blog post
│   ├── Categories.tsx     # Category management
│   ├── CategoryForm.tsx   # Category form
│   └── RichTextEditor.tsx # TipTap rich text editor
├── lib/                   # Utilities and configurations
│   ├── routers/           # tRPC routers
│   │   ├── _app.ts        # Main app router
│   │   ├── blog.ts        # Blog procedures
│   │   └── category.ts    # Category procedures
│   ├── functions.ts       # Database functions
│   ├── schemas.ts         # Zod validation schemas
│   ├── store.ts           # Zustand store
│   ├── trpc.ts            # tRPC server setup
│   └── trpc-client.ts     # tRPC client setup
├── src/                   # Source files
│   ├── schema.ts          # Drizzle database schema
│   └── seed.ts            # Database seeding script
├── types/                 # TypeScript type definitions
└── migrations/            # Database migrations
```

## 🔌 tRPC Router Structure

The application uses tRPC for type-safe API communication. Here's the router structure:

### Main Router (`lib/routers/_app.ts`)

```typescript
export const appRouter = router({
  blog: blogRouter, // Blog-related procedures
  category: categoryRouter, // Category-related procedures
});
```

### Blog Router (`lib/routers/blog.ts`)

- **Queries**:
  - `getAll` - Fetch all blog posts
  - `getByCategory` - Fetch blogs by category ID
  - `getById` - Fetch blog by ID
  - `getBySlug` - Fetch blog by slug (for dynamic routing)
- **Mutations**:
  - `create` - Create new blog post
  - `update` - Update existing blog post
  - `delete` - Delete blog post

### Category Router (`lib/routers/category.ts`)

- **Queries**:
  - `getAll` - Fetch all categories
  - `getById` - Fetch category by ID
- **Mutations**:
  - `create` - Create new category
  - `update` - Update existing category
  - `delete` - Delete category

### Usage Example

```typescript
// In React components
const { data: blogs } = trpc.blog.getAll.useQuery();
const createBlog = trpc.blog.create.useMutation();

// Create a new blog
await createBlog.mutateAsync({
  title: "My Blog Post",
  content: "Blog content...",
  author: "Author Name",
  slug: "my-blog-post",
  categoryIds: [1, 2],
});
```

## 🗃️ Database Schema

The application uses three main tables:

### Posts Table

- `id` - Primary key
- `title` - Blog post title
- `content` - Rich text content
- `author` - Author name
- `slug` - URL-friendly identifier
- `published` - Publication status
- `createdAt` / `updatedAt` - Timestamps

### Categories Table

- `id` - Primary key
- `name` - Category name
- `description` - Category description
- `slug` - URL-friendly identifier
- `createdAt` - Creation timestamp

### Post Categories (Junction Table)

- `postId` - Foreign key to posts
- `categoryId` - Foreign key to categories
- Enables many-to-many relationship between posts and categories

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run drizzle:generate` - Generate database migrations
- `npm run drizzle:push` - Push schema changes to database
- `npm run drizzle:seed` - Seed database with sample data

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

| Variable              | Description                  | Required | Example                               |
| --------------------- | ---------------------------- | -------- | ------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string | Yes      | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_APP_URL` | Application URL              | No       | `http://localhost:3000`               |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Neon](https://neon.tech/) - Serverless PostgreSQL

## 🐛 Issues & Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/kapybara-blog/issues) on GitHub.
