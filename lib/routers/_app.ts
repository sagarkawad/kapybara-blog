import { router } from "../trpc";
import { blogRouter } from "./blog";
import { categoryRouter } from "./category";

export const appRouter = router({
  blog: blogRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
