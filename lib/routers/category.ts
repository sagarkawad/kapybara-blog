import { router, publicProcedure } from "../trpc";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategoryById,
} from "../functions";
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "../schemas";
import { z } from "zod";

export const categoryRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    return await fetchCategories();
  }),

  // Get category by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await fetchCategoryById(input.id);
    }),

  // Create a new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      return await createCategory(input);
    }),

  // Update a category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      return await updateCategory(id, updateData);
    }),

  // Delete a category
  delete: publicProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ input }) => {
      await deleteCategory(input.id);
      return { success: true };
    }),
});
