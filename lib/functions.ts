import { db } from "@/db";
import { categories, postCategories, posts } from "@/src/schema";
import { eq } from "drizzle-orm";

export const fetchCategories = async () => {
  const response = await db.select().from(categories);
  return response;
};

export const fetchBlogs = async () => {
  const postsData = await db.select().from(posts);

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
