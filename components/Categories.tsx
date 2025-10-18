"use client";

import React from "react";
import { Category } from "@/types/types";

const Categories = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect?: (categoryId: number) => void;
}) => {
  const handleCategoryClick = (categoryId: number) => {
    onCategorySelect?.(categoryId);
  };

  return (
    <div>
      Categories
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          style={{
            cursor: "pointer",
            backgroundColor:
              selectedCategoryId === category.id ? "#e0e0e0" : "transparent",
            padding: "8px",
            margin: "4px 0",
            borderRadius: "4px",
          }}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default Categories;
