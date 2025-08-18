// src/components/categories/CategoryList.tsx
import { CategoryWithCount } from '@/app/(main)/categories/page';
import { CategoryCard } from './CategoryCard';

interface CategoryListProps {
  categories: CategoryWithCount[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>No categories found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
