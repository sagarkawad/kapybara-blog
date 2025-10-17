import { db } from "@/db";
import { categories, posts } from "@/src/schema";

export const fetchCategories = async () => {
  const response = await db.select().from(categories);
  return response;
};

export const fetchBlogs = async () => {
  const response = await db.select().from(posts);
  return response;
};
