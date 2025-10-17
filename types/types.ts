interface BlogProps {
  author: string;
  createdAt: string;
  title: string;
  content: string;
  categories: string[];
}

interface BlogPostProps {
  slug: string;
  title: string;
  content: string;
  categories: string[];
  author: string;
  createdAt: string;
}

interface CategoriesProps {
  categories: Category["name"][];
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
