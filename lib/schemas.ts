import { z } from "zod";

// Blog schemas
export const createBlogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  content: z.string().min(1, "Content is required"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(255, "Author must be less than 255 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must be less than 255 characters"),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).min(1, "At least one category is required"),
});

export const updateBlogSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .optional(),
  content: z.string().min(1, "Content is required").optional(),
  author: z
    .string()
    .min(1, "Author is required")
    .max(255, "Author must be less than 255 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must be less than 255 characters")
    .optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

export const deleteBlogSchema = z.object({
  id: z.number(),
});

export const getBlogsByCategorySchema = z.object({
  categoryId: z.number(),
});

// Category schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must be less than 255 characters"),
});

export const updateCategorySchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must be less than 255 characters")
    .optional(),
});

export const deleteCategorySchema = z.object({
  id: z.number(),
});

// Type exports
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type DeleteBlogInput = z.infer<typeof deleteBlogSchema>;
export type GetBlogsByCategoryInput = z.infer<typeof getBlogsByCategorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
