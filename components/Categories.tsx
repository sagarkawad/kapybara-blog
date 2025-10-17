import React from "react";
import { Category } from "@/types/types";

const Categories = ({ categories }: { categories: Category[] }) => {
  return (
    <div>
      Categories
      {categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
};

export default Categories;
