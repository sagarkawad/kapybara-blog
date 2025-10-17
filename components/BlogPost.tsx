import React from "react";
import { BlogPostProps } from "@/types/types";

const BlogPost = ({
  slug,
  title,
  content,
  categories,
  author,
  createdAt,
}: BlogPostProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <p>{author}</p>
      <p>{createdAt}</p>
      {categories.map((category) => (
        <p key={category}>{category}</p>
      ))}
    </div>
  );
};

export default BlogPost;
