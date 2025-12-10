import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  index: number;
}

export function CategoryCard({ category, onClick, index }: CategoryCardProps) {
  const staggerClass = `stagger-${Math.min(index + 1, 6)}`;

  return (
    <button
      onClick={onClick}
      className={`group relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer opacity-0 animate-fade-in-up ${staggerClass}`}
      data-testid={`card-category-${category.id}`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
        <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
          {category.name}
        </h3>
        <p className="text-white/80 text-xs sm:text-sm line-clamp-2">
          {category.description}
        </p>
      </div>
    </button>
  );
}
