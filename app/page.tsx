import React from "react";
import Categories from "@/components/Categories";
import Blog from "@/components/BlogPost";
import { fetchCategories, fetchBlogs } from "@/lib/functions";

const Home = async () => {
  const categories = await fetchCategories();
  const blogs = await fetchBlogs();
  console.log(categories);
  console.log(blogs);
  return (
    <div>
      Home
      <Categories
        categories={categories.map((cat) => ({
          ...cat,
          createdAt: cat.createdAt.toISOString(),
        }))}
      />
      <Blog
        slug={blogs[0].slug}
        title={blogs[0].title}
        content={blogs[0].content}
        author={blogs[0].author}
        createdAt={blogs[0].createdAt.toISOString()}
      />
    </div>
  );
};

export default Home;
