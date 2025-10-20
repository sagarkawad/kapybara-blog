import { router, publicProcedure } from "../trpc";
import {
  createBlogSchema,
  updateBlogSchema,
  deleteBlogSchema,
  getBlogsByCategorySchema,
} from "../schemas";
import {
  createBlog,
  fetchAllBlogs,
  fetchBlogs,
  fetchBlogById,
  fetchBlogBySlug,
  updateBlogWithCategories,
  deleteBlog,
} from "../functions";
import { z } from "zod";

export const blogRouter = router({
  // Get all blogs
  getAll: publicProcedure.query(async () => {
    return await fetchAllBlogs();
  }),

  // Get blogs by category
  getByCategory: publicProcedure
    .input(getBlogsByCategorySchema)
    .query(async ({ input }) => {
      return await fetchBlogs(input.categoryId);
    }),

  // Get blog by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await fetchBlogById(input.id);
    }),

  // Get blog by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await fetchBlogBySlug(input.slug);
    }),

  // Create new blog
  create: publicProcedure
    .input(createBlogSchema)
    .mutation(async ({ input }) => {
      return await createBlog(input);
    }),

  // Update blog
  update: publicProcedure
    .input(updateBlogSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      return await updateBlogWithCategories(id, updateData);
    }),

  // Delete blog
  delete: publicProcedure
    .input(deleteBlogSchema)
    .mutation(async ({ input }) => {
      await deleteBlog(input.id);
      return { success: true };
    }),
});
