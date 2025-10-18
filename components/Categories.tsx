"use client";

import React from "react";
import { Category } from "@/types/types";
import { Filter } from "lucide-react";

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

  const handleAllClick = () => {
    onCategorySelect?.(0); // 0 represents "All categories"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Filter by Category
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All Categories option */}
        <button
          onClick={handleAllClick}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategoryId === 0 || selectedCategoryId === null
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Categories
        </button>

        {/* Individual categories */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategoryId === category.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title={category.description || category.name}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
