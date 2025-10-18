"use client";

import React from "react";
import { Category } from "@/types/types";
import { useState } from "react";

const Categories = ({
  categories,
  onCategorySelect,
}: {
  categories: Category[];
  onCategorySelect?: (categoryId: number) => void;
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories.length > 0 ? categories[0].id : null
  );

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
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
