"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { trpc } from "@/lib/trpc-client";
import { CreateBlogInput } from "@/lib/schemas";
import { BlogCategory } from "@/types/types";

interface BlogFormProps {
  initialData?: {
    id?: number;
    title?: string;
    content?: string;
    author?: string;
    slug?: string;
    published?: boolean;
    categories?: BlogCategory[];
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BlogForm({ initialData, onSuccess, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    author: initialData?.author || "",
    slug: initialData?.slug || "",
    published: initialData?.published || false,
    categoryIds: initialData?.categories?.map((cat) => cat.id) || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories } = trpc.category.getAll.useQuery();
  const utils = trpc.useUtils();
  const createMutation = trpc.blog.create.useMutation();
  const updateMutation = trpc.blog.update.useMutation();

  const isEditing = !!initialData?.id;

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !isEditing) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (formData.categoryIds.length === 0)
      newErrors.categories = "At least one category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData as CreateBlogInput);
      }

      // Invalidate all blog-related queries to refresh the cache
      await utils.blog.getAll.invalidate();
      await utils.blog.getByCategory.invalidate();

      onSuccess?.();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: checked
        ? [...prev.categoryIds, categoryId]
        : prev.categoryIds.filter((id) => id !== categoryId),
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, author: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.author ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter author name"
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">{errors.author}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.slug ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="blog-post-slug"
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {categories?.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.categoryIds.includes(category.id)}
                  onChange={(e) =>
                    handleCategoryChange(category.id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
          {errors.categories && (
            <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
            placeholder="Write your blog content here..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Published */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, published: e.target.checked }))
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="published"
            className="text-sm font-medium text-gray-700"
          >
            Publish immediately
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors order-2 sm:order-1"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
          >
            {isLoading
              ? "Saving..."
              : isEditing
              ? "Update Post"
              : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
