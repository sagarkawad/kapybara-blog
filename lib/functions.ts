import { db } from "@/db";
import { categories, postCategories, posts } from "@/src/schema";
import { BlogPostProps } from "@/types/types";
import { eq } from "drizzle-orm";
import {
  CreateBlogInput,
  UpdateBlogInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./schemas";

export const fetchCategories = async () => {
  const response = await db.select().from(categories);
  return response;
};

export const fetchBlogs = async (categoryId: number) => {
  // Get posts that belong to this category
  const postsData = await db
    .select({
      id: posts.id,
      author: posts.author,
      title: posts.title,
      content: posts.content,
      slug: posts.slug,
      published: posts.published,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .innerJoin(postCategories, eq(posts.id, postCategories.postId))
    .where(eq(postCategories.categoryId, categoryId));

  // Add categories to each post
  const postsWithCategories = await Promise.all(
    postsData.map(async (post) => {
      const postCats = await db
        .select({
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
        })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post.id));

      return {
        ...post,
        categories: postCats,
      };
    })
  );

  return postsWithCategories;
};

//delete Blogs
export const deleteBlog = async (blogId: number) => {
  await db.delete(posts).where(eq(posts.id, blogId));
};

//update Blogs
export const updateBlog = async (
  blogId: number,
  blog: Partial<BlogPostProps>
) => {
  await db
    .update(posts)
    .set({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, blogId));
};

// Create a new blog
export const createBlog = async (blogData: CreateBlogInput) => {
  // Insert the blog post
  const [newPost] = await db
    .insert(posts)
    .values({
      title: blogData.title,
      content: blogData.content,
      author: blogData.author,
      slug: blogData.slug,
      published: blogData.published,
    })
    .returning();

  // Insert post-category relationships
  if (blogData.categoryIds && blogData.categoryIds.length > 0) {
    await db.insert(postCategories).values(
      blogData.categoryIds.map((categoryId) => ({
        postId: newPost.id,
        categoryId,
      }))
    );
  }

  return newPost;
};

// Get all blogs
export const fetchAllBlogs = async () => {
  const postsData = await db
    .select({
      id: posts.id,
      author: posts.author,
      title: posts.title,
      content: posts.content,
      slug: posts.slug,
      published: posts.published,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts);

  // Add categories to each post
  const postsWithCategories = await Promise.all(
    postsData.map(async (post) => {
      const postCats = await db
        .select({
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
        })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post.id));

      return {
        ...post,
        categories: postCats,
      };
    })
  );

  return postsWithCategories;
};

// Get a single blog by ID
export const fetchBlogById = async (blogId: number) => {
  const [post] = await db
    .select({
      id: posts.id,
      author: posts.author,
      title: posts.title,
      content: posts.content,
      slug: posts.slug,
      published: posts.published,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(eq(posts.id, blogId));

  if (!post) return null;

  const postCats = await db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description,
      slug: categories.slug,
    })
    .from(postCategories)
    .innerJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(eq(postCategories.postId, post.id));

  return {
    ...post,
    categories: postCats,
  };
};

// Get a single blog by slug
export const fetchBlogBySlug = async (slug: string) => {
  const [post] = await db
    .select({
      id: posts.id,
      author: posts.author,
      title: posts.title,
      content: posts.content,
      slug: posts.slug,
      published: posts.published,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(eq(posts.slug, slug));

  if (!post) return null;

  const postCats = await db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description,
      slug: categories.slug,
    })
    .from(postCategories)
    .innerJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(eq(postCategories.postId, post.id));

  return {
    ...post,
    categories: postCats,
  };
};

// Update blog with categories
export const updateBlogWithCategories = async (
  blogId: number,
  blogData: UpdateBlogInput
) => {
  // Update the blog post
  if (
    blogData.title ||
    blogData.content ||
    blogData.author ||
    blogData.published !== undefined
  ) {
    await db
      .update(posts)
      .set({
        ...(blogData.title && { title: blogData.title }),
        ...(blogData.content && { content: blogData.content }),
        ...(blogData.author && { author: blogData.author }),
        ...(blogData.published !== undefined && {
          published: blogData.published,
        }),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, blogId));
  }

  // Update categories if provided
  if (blogData.categoryIds) {
    // Remove existing category relationships
    await db.delete(postCategories).where(eq(postCategories.postId, blogId));

    // Add new category relationships
    if (blogData.categoryIds.length > 0) {
      await db.insert(postCategories).values(
        blogData.categoryIds.map((categoryId) => ({
          postId: blogId,
          categoryId,
        }))
      );
    }
  }

  return await fetchBlogById(blogId);
};

// Category CRUD operations

// Create a new category
export const createCategory = async (categoryData: CreateCategoryInput) => {
  const [newCategory] = await db
    .insert(categories)
    .values({
      name: categoryData.name,
      description: categoryData.description,
      slug: categoryData.slug,
    })
    .returning();

  return newCategory;
};

// Update a category
export const updateCategory = async (
  categoryId: number,
  categoryData: UpdateCategoryInput
) => {
  const [updatedCategory] = await db
    .update(categories)
    .set({
      ...(categoryData.name && { name: categoryData.name }),
      ...(categoryData.description !== undefined && {
        description: categoryData.description,
      }),
      ...(categoryData.slug && { slug: categoryData.slug }),
    })
    .where(eq(categories.id, categoryId))
    .returning();

  return updatedCategory;
};

// Delete a category
export const deleteCategory = async (categoryId: number) => {
  // First, remove all post-category relationships
  await db
    .delete(postCategories)
    .where(eq(postCategories.categoryId, categoryId));

  // Then delete the category
  await db.delete(categories).where(eq(categories.id, categoryId));
};

// Get a single category by ID
export const fetchCategoryById = async (categoryId: number) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  return category || null;
};

// Get a single category by slug
export const fetchCategoryBySlug = async (slug: string) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));

  return category || null;
};
