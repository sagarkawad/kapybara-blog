"use client";

import React from "react";
import Categories from "@/components/Categories";
import Blog from "@/components/Blog";
import { useState, useEffect, useCallback } from "react";
import { BlogPostProps, Category } from "@/types/types";

const Home = () => {
  const [blogs, setBlogs] = useState<BlogPostProps[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(1);

  //functions
  const getBlogs = useCallback(async () => {
    const response = await fetch("/api/blogs", {
      method: "POST",
      body: JSON.stringify({ category: selectedCategory }),
    });
    const data = await response.json();
    console.log(data);
    setBlogs(data);
  }, [selectedCategory]);

  const getCategories = useCallback(async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    console.log(data);
    setCategories(data);
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getCategories();
      await getBlogs();
    }
    fetchData();
  }, [getCategories, getBlogs]);

  useEffect(() => {
    if (selectedCategory) {
      getBlogs();
    }
  }, [selectedCategory, getBlogs]);

  return (
    <div>
      Home
      <Categories
        selectedCategoryId={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categories={categories.map((cat) => ({
          ...cat,
          createdAt: new Date(cat.createdAt).toISOString(),
        }))}
      />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          slug={blog.slug}
          title={blog.title}
          content={blog.content}
          author={blog.author}
          createdAt={new Date(blog.createdAt).toISOString()}
          categories={blog.categories}
        />
      ))}
    </div>
  );
};

export default Home;
