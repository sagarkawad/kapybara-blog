interface BlogProps {
  slug: string;
  author: string;
  createdAt: string;
  title: string;
  content: string;
  categories: BlogCategory[];
}

interface BlogPostProps {
  id: number;
  slug: string;
  title: string;
  content: string;
  categories: BlogCategory[];
  author: string;
  createdAt: string;
}

interface CategoriesProps {
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
}

interface BlogCategory {
  id: number;
  name: string;
  description: string | null;
  slug: string;
}

interface CategoriesState {
  categories: Category[];
  fetchCategories: () => Promise<void>;
}

export type {
  BlogProps,
  BlogPostProps,
  CategoriesProps,
  Category,
  BlogCategory,
  CategoriesState,
};
