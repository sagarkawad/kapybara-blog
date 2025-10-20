"use client";

import React, { useState } from "react";
import Categories from "@/components/Categories";
import Blog from "@/components/Blog";
import { BlogForm } from "@/components/BlogForm";
import { trpc } from "@/lib/trpc-client";
import { Plus, BookOpen, Loader2, Settings, Eye } from "lucide-react";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  // tRPC queries
  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = trpc.category.getAll.useQuery();
  const { data: allBlogs, isLoading: allBlogsLoading } =
    trpc.blog.getAll.useQuery();
  const { data: categoryBlogs, isLoading: categoryBlogsLoading } =
    trpc.blog.getByCategory.useQuery(
      { categoryId: selectedCategory! },
      { enabled: !!selectedCategory }
    );

  // tRPC mutations for categories
  const createCategoryMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      refetchCategories();
    },
  });

  const updateCategoryMutation = trpc.category.update.useMutation({
    onSuccess: () => {
      refetchCategories();
    },
  });

  const deleteCategoryMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      refetchCategories();
      // Reset selected category if it was deleted
      if (selectedCategory && categories) {
        const categoryExists = categories.some(
          (cat) => cat.id === selectedCategory
        );
        if (!categoryExists) {
          setSelectedCategory(null);
        }
      }
    },
  });

  // Determine which blogs to show
  const blogs = selectedCategory ? categoryBlogs : allBlogs;
  const isLoading = selectedCategory ? categoryBlogsLoading : allBlogsLoading;

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId === 0 ? null : categoryId);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  // Category management handlers
  const handleCategoryCreate = async (categoryData: {
    name: string;
    description?: string;
    slug: string;
  }) => {
    await createCategoryMutation.mutateAsync(categoryData);
  };

  const handleCategoryUpdate = async (
    categoryId: number,
    categoryData: {
      name?: string;
      description?: string;
      slug?: string;
    }
  ) => {
    await updateCategoryMutation.mutateAsync({
      id: categoryId,
      ...categoryData,
    });
  };

  const handleCategoryDelete = async (categoryId: number) => {
    await deleteCategoryMutation.mutateAsync({ id: categoryId });
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <BlogForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <BookOpen size={32} className="text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Kapybara Blog
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Share your thoughts with the world
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() =>
                  setShowCategoryManagement(!showCategoryManagement)
                }
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md flex-1 sm:flex-initial ${
                  showCategoryManagement
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {showCategoryManagement ? (
                  <Eye size={20} />
                ) : (
                  <Settings size={20} />
                )}
                <span className="sm:inline">
                  {showCategoryManagement ? "View Mode" : "Manage Categories"}
                </span>
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex-1 sm:flex-initial"
              >
                <Plus size={20} />
                <span className="sm:inline">New Post</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Categories Filter */}
        {categoriesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-gray-500" size={24} />
          </div>
        ) : (
          categories && (
            <Categories
              selectedCategoryId={selectedCategory}
              onCategorySelect={handleCategorySelect}
              categories={categories.map((cat) => ({
                ...cat,
                createdAt: new Date(cat.createdAt).toISOString(),
              }))}
              showManagement={showCategoryManagement}
              onCategoryCreate={
                showCategoryManagement ? handleCategoryCreate : undefined
              }
              onCategoryUpdate={
                showCategoryManagement ? handleCategoryUpdate : undefined
              }
              onCategoryDelete={
                showCategoryManagement ? handleCategoryDelete : undefined
              }
            />
          )
        )}

        {/* Blog Posts */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 className="animate-spin" size={24} />
                <span>Loading posts...</span>
              </div>
            </div>
          ) : blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <Blog
                key={blog.id}
                id={blog.id}
                slug={blog.slug}
                title={blog.title}
                content={blog.content}
                author={blog.author}
                createdAt={new Date(blog.createdAt).toISOString()}
                categories={blog.categories}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory
                  ? "No posts in this category yet."
                  : "Be the first to create a blog post!"}
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Create First Post
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 sm:mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm sm:text-base">
              &copy; 2024 Kapybara Blog. Built with Next.js, tRPC, and
              TailwindCSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
