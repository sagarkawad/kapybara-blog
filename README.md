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

## ✅ Features Implemented

### Priority 1 (Core Features) - ✅ Complete

- [x] **Blog Post Management**

  - Create, read, update, delete blog posts
  - Rich text editor with TipTap
  - Slug-based URLs for SEO
  - Author attribution
  - Publication status

- [x] **Category System**

  - Create and manage categories
  - Many-to-many relationship with posts
  - Category-based filtering
  - URL-friendly category slugs

- [x] **Database Architecture**
  - PostgreSQL with Drizzle ORM
  - Type-safe database operations
  - Proper relationships and constraints
  - Migration system

### Priority 2 (Enhanced Features) - ✅ Complete

- [x] **API Layer**

  - tRPC for end-to-end type safety
  - Structured router organization
  - Input validation with Zod schemas
  - Error handling

- [x] **User Interface**

  - Responsive design with Tailwind CSS
  - Modern, clean UI components
  - Mobile-first approach
  - Intuitive navigation

- [x] **State Management**
  - Client state with Zustand
  - Server state with TanStack Query
  - Optimistic updates
  - Caching and synchronization

### Priority 3 (Advanced Features) - ✅ Complete

- [x] **Developer Experience**

  - Comprehensive documentation
  - Setup and deployment guides
  - API documentation
  - TypeScript throughout
  - ESLint configuration

- [x] **Production Ready**

  - Environment configuration
  - Database seeding
  - Error boundaries
  - Performance optimizations

- [x] **Deployment Support**
  - Vercel deployment ready
  - Environment variable management
  - Database migration scripts
  - Production build optimization

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Rich Text Editor**: TipTap with extensions

### Backend & API

- **API Layer**: tRPC for end-to-end type safety
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon serverless recommended)
- **Runtime**: Node.js 18+

### State Management & Data Fetching

- **Client State**: Zustand
- **Server State**: TanStack Query (React Query)
- **Form Validation**: Zod schemas

### Development & Build Tools

- **Package Manager**: npm/yarn/pnpm
- **Build Tool**: Next.js with Turbopack
- **Database Migrations**: Drizzle Kit
- **Linting**: ESLint
- **Type Checking**: TypeScript

### Deployment & Infrastructure

- **Hosting**: Vercel (recommended)
- **Database**: Neon PostgreSQL
- **Environment**: Serverless

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+
- npm, yarn, or pnpm
- A PostgreSQL database (we recommend [Neon](https://neon.tech) for easy setup)

## 🚀 Setup Steps (How to Run Locally)

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm, yarn, or pnpm** - Package manager (npm comes with Node.js)
- **PostgreSQL database** - We recommend [Neon](https://neon.tech) for easy setup

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

### 3. Database Setup

**Option A: Neon (Recommended)**

1. Sign up at [neon.tech](https://neon.tech/)
2. Create a new project
3. Copy your connection string

**Option B: Local PostgreSQL**

1. Install PostgreSQL locally
2. Create a database: `CREATE DATABASE kapybara_blog;`
3. Create a user with appropriate permissions

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration (Required)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Application URL (Optional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Note**: For Neon, your DATABASE_URL looks like:
> `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

### 5. Database Migration & Seeding

```bash
# Generate migration files
npm run drizzle:generate

# Apply migrations to database
npm run drizzle:push

# (Optional) Populate with sample data
npm run drizzle:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 7. Verify Setup

Test the application by:

1. Creating a new category
2. Writing a blog post with the rich text editor
3. Viewing the blog post on the homepage
4. Testing category filtering

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

## 🤔 Trade-offs & Architectural Decisions

### Technology Choices

**Next.js 15 with App Router**

- ✅ **Pros**: Latest features, improved performance, better developer experience
- ⚠️ **Trade-offs**: Newer API means less community resources, potential edge cases
- **Decision**: Chose for future-proofing and performance benefits

**tRPC over REST/GraphQL**

- ✅ **Pros**: End-to-end type safety, excellent developer experience, smaller bundle
- ⚠️ **Trade-offs**: Less familiar to some developers, tighter coupling between frontend/backend
- **Decision**: Type safety and DX benefits outweigh learning curve

**Drizzle ORM over Prisma**

- ✅ **Pros**: Better TypeScript integration, more SQL-like, smaller runtime
- ⚠️ **Trade-offs**: Smaller ecosystem, less mature tooling
- **Decision**: Preferred for type safety and performance

**PostgreSQL over NoSQL**

- ✅ **Pros**: ACID compliance, complex relationships, mature ecosystem
- ⚠️ **Trade-offs**: More setup complexity, less flexible schema changes
- **Decision**: Blog relationships benefit from relational structure

### Architecture Decisions

**Monolithic Structure**

- ✅ **Pros**: Simpler deployment, shared types, easier development
- ⚠️ **Trade-offs**: Less scalable for large teams, tighter coupling
- **Decision**: Appropriate for blog application scope

**Client-Side State Management (Zustand + TanStack Query)**

- ✅ **Pros**: Lightweight, excellent caching, optimistic updates
- ⚠️ **Trade-offs**: More complex than simple useState for small apps
- **Decision**: Provides better UX with caching and optimistic updates

**Rich Text Editor (TipTap)**

- ✅ **Pros**: Highly customizable, good performance, modern architecture
- ⚠️ **Trade-offs**: More complex than simple textarea, larger bundle
- **Decision**: Essential for good blog writing experience

### Database Design

**Many-to-Many Categories**

- ✅ **Pros**: Flexible categorization, better content organization
- ⚠️ **Trade-offs**: More complex queries, additional junction table
- **Decision**: Blogs often need multiple categories for better discoverability

**Slug-based URLs**

- ✅ **Pros**: SEO-friendly, human-readable, better UX
- ⚠️ **Trade-offs**: Need to handle uniqueness, URL changes on title changes
- **Decision**: SEO benefits essential for blog platform

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

## ⏱️ Development Time (Optional)

This project was built with careful attention to modern development practices and comprehensive documentation. Here's a breakdown of the development process:

### Time Investment

- **Initial Setup & Architecture**: ~4-6 hours
  - Project structure, dependencies, database schema
  - tRPC setup, Drizzle configuration
- **Core Features Development**: ~8-12 hours
  - Blog CRUD operations, category management
  - Rich text editor integration, UI components
- **Polish & Enhancement**: ~4-6 hours
  - Responsive design, error handling
  - Optimistic updates, performance optimization
- **Documentation & Deployment**: ~3-4 hours
  - Comprehensive README, API documentation
  - Setup guides, deployment instructions

**Total Estimated Time**: ~19-28 hours

### Development Approach

- **Test-Driven Development**: Features tested locally before implementation
- **Incremental Development**: Built in logical phases (database → API → UI → polish)
- **Documentation-First**: Comprehensive docs written alongside development
- **Modern Best Practices**: TypeScript, proper error handling, responsive design

### Key Learning Areas

- Next.js 15 App Router patterns
- tRPC integration with React Query
- Drizzle ORM advanced relationships
- TipTap rich text editor customization

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
