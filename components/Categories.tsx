"use client";

import { useEffect } from "react";
import { CategoriesProps } from "../types/types";

export default function Categories({ categories }: CategoriesProps) {
  useEffect(() => {
    console.log("Category names:", categories);
    categories.forEach((categoryName, index) => {
      console.log(`Category ${index + 1}: ${categoryName}`);
    });
  }, [categories]);

  return (
    <div className="categories">
      <h2>Categories</h2>
      <ul>
        {categories.map((categoryName, index) => (
          <li key={index}>{categoryName}</li>
        ))}
      </ul>
    </div>
  );
}
