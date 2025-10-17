import React from "react";
import { BlogProps } from "@/types/types";

const Blog = ({
  author,
  slug,
  createdAt,
  title,
  content,
  categories,
}: BlogProps) => {
  return (
    <div>
      <p>{author}</p>
      <p>{createdAt}</p>
      <h1>{title}</h1>
      <p>{content}</p>
      {categories.map((category) => (
        <p key={category.id}>{category.name}</p>
      ))}
    </div>
  );
};

export default Blog;
