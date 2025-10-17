import { create } from "zustand";
import { db } from "@/db";
import { categories } from "@/src/schema";
import type { CategoriesState } from "@/types/types";

const useCategories = create<CategoriesState>((set) => ({
  categories: [], // Initialize with empty array
  fetchCategories: async () => {
    try {
      const categoriesData = await db.select().from(categories);
      const transformedCategories = categoriesData.map((cat) => ({
        ...cat,
        description: cat.description || "", // Convert null to empty string
        createdAt: cat.createdAt.toISOString(), // Convert Date to string
      }));
      set({ categories: transformedCategories });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Optionally set an error state or handle the error
    }
  },
}));

export { useCategories };
