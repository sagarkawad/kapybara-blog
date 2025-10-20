"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types/types";
import { Filter, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import CategoryForm from "./CategoryForm";

const Categories = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  showManagement = false,
}: {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect?: (categoryId: number) => void;
  onCategoryCreate?: (categoryData: {
    name: string;
    description?: string;
    slug: string;
  }) => Promise<void>;
  onCategoryUpdate?: (
    categoryId: number,
    categoryData: {
      name?: string;
      description?: string;
      slug?: string;
    }
  ) => Promise<void>;
  onCategoryDelete?: (categoryId: number) => Promise<void>;
  showManagement?: boolean;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleCategoryClick = (categoryId: number) => {
    onCategorySelect?.(categoryId);
  };

  const handleAllClick = () => {
    onCategorySelect?.(0); // 0 represents "All categories"
  };

  const handleCreateCategory = async (categoryData: {
    name: string;
    description?: string;
    slug: string;
  }) => {
    if (!onCategoryCreate) return;

    setIsLoading(true);
    try {
      await onCategoryCreate(categoryData);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryData: {
    name: string;
    description?: string;
    slug: string;
  }) => {
    if (!onCategoryUpdate || !editingCategory) return;

    setIsLoading(true);
    try {
      await onCategoryUpdate(editingCategory.id, categoryData);
      setEditingCategory(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!onCategoryDelete) return;

    if (
      window.confirm(
        "Are you sure you want to delete this category? This will remove it from all associated blog posts."
      )
    ) {
      try {
        await onCategoryDelete(categoryId);
        setActiveDropdown(null);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600 sm:w-5 sm:h-5" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {showManagement ? "Manage Categories" : "Filter by Category"}
            </h3>
          </div>
          {showManagement && onCategoryCreate && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus size={16} />
              Add Category
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* All Categories option */}
          <button
            onClick={handleAllClick}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              selectedCategoryId === 0 || selectedCategoryId === null
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>

          {/* Individual categories */}
          {categories.map((category) => (
            <div key={category.id} className="relative">
              {showManagement ? (
                <div className="flex items-center gap-1 bg-gray-100 rounded-full pr-1">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      selectedCategoryId === category.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-transparent text-gray-700 hover:bg-gray-200"
                    }`}
                    title={category.description || category.name}
                  >
                    {category.name}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === category.id ? null : category.id
                        )
                      }
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <MoreVertical size={14} />
                    </button>
                    {activeDropdown === category.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategoryId === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title={category.description || category.name}
                >
                  {category.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={
            editingCategory ? handleUpdateCategory : handleCreateCategory
          }
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Categories;
