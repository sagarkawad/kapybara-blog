interface BlogProps {
  slug: string;
  author: string;
  createdAt: string;
  title: string;
  content: string;
  categories: Category[];
}

interface BlogPostProps {
  id: number;
  slug: string;
  title: string;
  content: string;
  categories: Category[];
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

interface CategoriesState {
  categories: Category[];
  fetchCategories: () => Promise<void>;
}

export type {
  BlogProps,
  BlogPostProps,
  CategoriesProps,
  Category,
  CategoriesState,
};
