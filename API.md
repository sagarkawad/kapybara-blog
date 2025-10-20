# API Documentation - tRPC Routes

This document provides comprehensive documentation for all tRPC procedures available in the Kapybara Blog application.

## Overview

The API is built using tRPC, providing end-to-end type safety between the client and server. All procedures are organized into two main routers:

- **Blog Router** (`blog.*`) - Handles blog post operations
- **Category Router** (`category.*`) - Handles category operations

## Base URL Structure

```typescript
// Client usage
import { trpc } from "@/lib/trpc-client";

// Example usage
const blogs = trpc.blog.getAll.useQuery();
const createBlog = trpc.blog.create.useMutation();
```

## Blog Router (`blog.*`)

### Queries

#### `blog.getAll`

Fetches all blog posts with their associated categories.

```typescript
// Usage
const { data, isLoading, error } = trpc.blog.getAll.useQuery();

// Response Type
type BlogWithCategories = {
  id: number;
  title: string;
  content: string;
  author: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
}[];
```

#### `blog.getByCategory`

Fetches all blog posts belonging to a specific category.

```typescript
// Usage
const { data } = trpc.blog.getByCategory.useQuery({
  categoryId: 1,
});

// Input Schema
{
  categoryId: number; // Required
}

// Response: Same as getAll but filtered by category
```

#### `blog.getById`

Fetches a single blog post by its ID.

```typescript
// Usage
const { data } = trpc.blog.getById.useQuery({
  id: 1,
});

// Input Schema
{
  id: number; // Required
}

// Response: Single BlogWithCategories object or null
```

#### `blog.getBySlug`

Fetches a single blog post by its slug (used for dynamic routing).

```typescript
// Usage
const { data } = trpc.blog.getBySlug.useQuery({
  slug: "my-blog-post",
});

// Input Schema
{
  slug: string; // Required, URL-friendly identifier
}

// Response: Single BlogWithCategories object or null
```

### Mutations

#### `blog.create`

Creates a new blog post with associated categories.

```typescript
// Usage
const createBlog = trpc.blog.create.useMutation({
  onSuccess: (data) => {
    console.log('Blog created:', data);
  }
});

await createBlog.mutateAsync({
  title: "My New Blog Post",
  content: "<p>Rich text content...</p>",
  author: "John Doe",
  slug: "my-new-blog-post",
  published: true,
  categoryIds: [1, 2, 3]
});

// Input Schema
{
  title: string;        // Required, 1-255 characters
  content: string;      // Required, rich text HTML
  author: string;       // Required, 1-255 characters
  slug: string;         // Required, URL-friendly, unique
  published?: boolean;  // Optional, defaults to false
  categoryIds: number[]; // Required, array of category IDs
}

// Response: Created blog post with categories
```

#### `blog.update`

Updates an existing blog post and its categories.

```typescript
// Usage
const updateBlog = trpc.blog.update.useMutation();

await updateBlog.mutateAsync({
  id: 1,
  title: "Updated Title",
  content: "<p>Updated content...</p>",
  categoryIds: [2, 3]
});

// Input Schema
{
  id: number;           // Required, blog post ID
  title?: string;       // Optional, 1-255 characters
  content?: string;     // Optional, rich text HTML
  author?: string;      // Optional, 1-255 characters
  slug?: string;        // Optional, URL-friendly, unique
  published?: boolean;  // Optional
  categoryIds?: number[]; // Optional, replaces all categories
}

// Response: Updated blog post with categories
```

#### `blog.delete`

Deletes a blog post and all its category associations.

```typescript
// Usage
const deleteBlog = trpc.blog.delete.useMutation();

await deleteBlog.mutateAsync({
  id: 1,
});

// Input Schema
{
  id: number; // Required, blog post ID to delete
}

// Response
{
  success: boolean; // Always true if successful
}
```

## Category Router (`category.*`)

### Queries

#### `category.getAll`

Fetches all categories.

```typescript
// Usage
const { data } = trpc.category.getAll.useQuery();

// Response Type
type Category = {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  createdAt: Date;
}[];
```

#### `category.getById`

Fetches a single category by its ID.

```typescript
// Usage
const { data } = trpc.category.getById.useQuery({
  id: 1,
});

// Input Schema
{
  id: number; // Required
}

// Response: Single Category object or null
```

### Mutations

#### `category.create`

Creates a new category.

```typescript
// Usage
const createCategory = trpc.category.create.useMutation();

await createCategory.mutateAsync({
  name: "Technology",
  description: "Posts about technology and programming",
  slug: "technology"
});

// Input Schema
{
  name: string;         // Required, 1-100 characters
  description?: string; // Optional, category description
  slug: string;         // Required, URL-friendly, unique
}

// Response: Created category object
```

#### `category.update`

Updates an existing category.

```typescript
// Usage
const updateCategory = trpc.category.update.useMutation();

await updateCategory.mutateAsync({
  id: 1,
  name: "Updated Technology",
  description: "Updated description"
});

// Input Schema
{
  id: number;           // Required, category ID
  name?: string;        // Optional, 1-100 characters
  description?: string; // Optional, category description
  slug?: string;        // Optional, URL-friendly, unique
}

// Response: Updated category object
```

#### `category.delete`

Deletes a category and removes it from all associated blog posts.

```typescript
// Usage
const deleteCategory = trpc.category.delete.useMutation();

await deleteCategory.mutateAsync({
  id: 1,
});

// Input Schema
{
  id: number; // Required, category ID to delete
}

// Response
{
  success: boolean; // Always true if successful
}
```

## Error Handling

All tRPC procedures include built-in error handling. Common error scenarios:

### Validation Errors

```typescript
// Example: Invalid input data
{
  code: "BAD_REQUEST",
  message: "Validation error",
  cause: {
    fieldErrors: {
      title: ["Title is required"],
      slug: ["Slug must be unique"]
    }
  }
}
```

### Not Found Errors

```typescript
// Example: Blog post not found
{
  code: "NOT_FOUND",
  message: "Blog post not found"
}
```

### Database Errors

```typescript
// Example: Database connection issue
{
  code: "INTERNAL_SERVER_ERROR",
  message: "Database error"
}
```

## Usage Examples

### Complete Blog Management Flow

```typescript
import { trpc } from '@/lib/trpc-client';

function BlogManager() {
  // Queries
  const { data: blogs } = trpc.blog.getAll.useQuery();
  const { data: categories } = trpc.category.getAll.useQuery();

  // Mutations
  const createBlog = trpc.blog.create.useMutation({
    onSuccess: () => {
      // Refetch blogs after creation
      trpc.useContext().blog.getAll.invalidate();
    }
  });

  const updateBlog = trpc.blog.update.useMutation({
    onSuccess: () => {
      trpc.useContext().blog.getAll.invalidate();
    }
  });

  const deleteBlog = trpc.blog.delete.useMutation({
    onSuccess: () => {
      trpc.useContext().blog.getAll.invalidate();
    }
  });

  // Create new blog
  const handleCreateBlog = async (formData) => {
    try {
      await createBlog.mutateAsync({
        title: formData.title,
        content: formData.content,
        author: formData.author,
        slug: formData.slug,
        published: formData.published,
        categoryIds: formData.selectedCategories
      });
    } catch (error) {
      console.error('Failed to create blog:', error);
    }
  };

  // Update existing blog
  const handleUpdateBlog = async (id, formData) => {
    try {
      await updateBlog.mutateAsync({
        id,
        ...formData
      });
    } catch (error) {
      console.error('Failed to update blog:', error);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id) => {
    try {
      await deleteBlog.mutateAsync({ id });
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  return (
    // Your component JSX
  );
}
```

### Optimistic Updates

```typescript
const updateBlog = trpc.blog.update.useMutation({
  onMutate: async (newBlog) => {
    // Cancel outgoing refetches
    await trpc.useContext().blog.getAll.cancel();

    // Snapshot previous value
    const previousBlogs = trpc.useContext().blog.getAll.getData();

    // Optimistically update
    trpc
      .useContext()
      .blog.getAll.setData(undefined, (old) =>
        old?.map((blog) =>
          blog.id === newBlog.id ? { ...blog, ...newBlog } : blog
        )
      );

    return { previousBlogs };
  },
  onError: (err, newBlog, context) => {
    // Rollback on error
    trpc.useContext().blog.getAll.setData(undefined, context?.previousBlogs);
  },
  onSettled: () => {
    // Refetch after mutation
    trpc.useContext().blog.getAll.invalidate();
  },
});
```

## Type Safety

All procedures are fully type-safe. TypeScript will provide:

- **Input validation**: Compile-time checking of input parameters
- **Response types**: Automatic inference of response data types
- **Error types**: Typed error responses
- **Auto-completion**: Full IntelliSense support

```typescript
// TypeScript will infer all types automatically
const { data } = trpc.blog.getAll.useQuery();
//      ^? BlogWithCategories[]

const createBlog = trpc.blog.create.useMutation();
//    ^? UseMutationResult<BlogWithCategories, TRPCError, CreateBlogInput>
```

## Performance Considerations

1. **Query Caching**: tRPC uses React Query for automatic caching
2. **Optimistic Updates**: Implement for better UX
3. **Pagination**: Consider implementing for large datasets
4. **Selective Fetching**: Use specific queries instead of fetching all data

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider:

1. Implementing rate limiting middleware
2. Using Vercel's built-in rate limiting
3. Database connection pooling for high traffic

## Security

- All inputs are validated using Zod schemas
- SQL injection protection via Drizzle ORM
- No authentication currently implemented (consider adding for production)
