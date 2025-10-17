import React from "react";
import Categories from "@/components/Categories";
import Blog from "@/components/Blog";
import { fetchCategories, fetchBlogs } from "@/lib/functions";

const Home = async () => {
  const categories = await fetchCategories();
  const blogs = await fetchBlogs();
  console.log(categories);
  console.log(blogs[0].categories);
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
