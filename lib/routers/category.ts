import { router, publicProcedure } from "../trpc";
import { fetchCategories } from "../functions";

export const categoryRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    return await fetchCategories();
  }),
});
