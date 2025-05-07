
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (categoryId: string) => void;
  selectedCategory?: string;
}

const CategorySelector = ({ categories, onSelect, selectedCategory }: CategorySelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-lg border transition-all",
            selectedCategory === category.id
              ? "border-primary bg-primary-50 text-primary"
              : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
          )}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 mb-3">
            <span className="text-2xl" role="img" aria-label={category.name}>
              {category.icon}
            </span>
          </div>
          <span className="text-sm font-medium">{category.name}</span>
          {selectedCategory === category.id && (
            <div className="absolute top-2 right-2">
              <Check className="h-4 w-4 text-primary" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
