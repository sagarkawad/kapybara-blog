"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import { ArrowLeft, Calendar, User, Tag, Loader2 } from "lucide-react";

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const {
    data: blog,
    isLoading,
    error,
  } = trpc.blog.getBySlug.useQuery({ slug }, { enabled: !!slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <article className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
          {/* Blog header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-start gap-2 mb-6">
              <Tag size={16} className="text-gray-500 mt-1" />
              <div className="flex flex-wrap gap-2">
                {blog.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Blog content */}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Navigation footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to All Posts
          </button>
        </div>
      </main>
    </div>
  );
}
