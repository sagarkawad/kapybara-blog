import React from "react";
import { BlogProps } from "@/types/types";

const Blog = ({ author, createdAt, title, content }: BlogProps) => {
  return (
    <div>
      <p>{author}</p>
      <p>{createdAt}</p>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

export default Blog;
