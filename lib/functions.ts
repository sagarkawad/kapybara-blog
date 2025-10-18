import { db } from "@/db";
import { categories, postCategories, posts } from "@/src/schema";
import { BlogPostProps } from "@/types/types";
import { eq } from "drizzle-orm";

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
export const updateBlog = async (blogId: number, blog: BlogPostProps) => {
  await db.update(posts).set(content).where(eq(posts.id, blogId));
};
