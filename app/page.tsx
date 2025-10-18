import React from "react";
import Categories from "@/components/Categories";
import Blog from "@/components/Blog";
import { fetchCategories, fetchBlogs } from "@/lib/functions";

const Home = async () => {
  const categories = await fetchCategories();
  // For now, fetch blogs for the first category (you can implement dynamic selection later)
  const blogs = categories.length > 0 ? await fetchBlogs(categories[0].id) : [];
  console.log(categories);
  console.log(blogs.length > 0 ? blogs[0].categories : "No blogs found");
  return (
    <div>
      Home
      <Categories
        categories={categories.map((cat) => ({
          ...cat,
          createdAt: cat.createdAt.toISOString(),
        }))}
      />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          slug={blog.slug}
          title={blog.title}
          content={blog.content}
          author={blog.author}
          createdAt={blog.createdAt.toISOString()}
          categories={blog.categories}
        />
      ))}
    </div>
  );
};

export default Home;
