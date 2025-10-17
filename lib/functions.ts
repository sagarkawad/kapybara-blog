import { db } from "@/db";
import { categories } from "@/src/schema";

export const fetchCategories = async () => {
  const response = await db.select().from(categories);
  return response;
};
