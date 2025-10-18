"use client";

import React, { useState } from "react";
import { BlogProps } from "@/types/types";
import { Edit, Trash2, Calendar, User, Tag } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { BlogForm } from "./BlogForm";

interface ExtendedBlogProps extends BlogProps {
  id?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Blog = ({
  id,
  author,
  createdAt,
  title,
  content,
  categories,
  onEdit,
  onDelete,
}: ExtendedBlogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteMutation = trpc.blog.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteMutation.mutateAsync({ id });
      await utils.blog.getAll.invalidate();
      await utils.blog.getByCategory.invalidate();
      onDelete?.();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEditSuccess = async () => {
    setIsEditing(false);
    await utils.blog.getAll.invalidate();
    await utils.blog.getByCategory.invalidate();
    onEdit?.();
  };

  if (isEditing && id) {
    return (
      <BlogForm
        initialData={{
          id,
          title,
          content,
          author,
          categories,
        }}
        onSuccess={handleEditSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
            {title}
          </h2>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 mb-4">
            <Tag size={14} className="text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {id && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit post"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Blog Post
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &ldquo;{title}&rdquo;? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default Blog;
