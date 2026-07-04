import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import type { Category } from '../../types';

/* ============================================
   CATEGORY CARD COMPONENT
   Card for a problem category with icon and count
   ============================================ */

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  // Resolve icon dynamically
  const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Layers;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="
        relative overflow-hidden
        bg-card border border-border rounded-3xl p-6
        hover:border-opacity-60 hover:shadow-lg
        transition-colors duration-300
        flex flex-col items-center text-center gap-4
        cursor-pointer w-full
      "
      style={{
        ['--cat-color' as string]: category.color,
      }}
      aria-label={`${category.name} category with ${category.count} problems`}
    >
      {/* Glow */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: category.color }}
      />

      {/* Icon */}
      <div
        className="relative p-4 rounded-2xl"
        style={{
          backgroundColor: `${category.color}15`,
          border: `1px solid ${category.color}30`,
        }}
      >
        <IconComponent className="w-7 h-7" style={{ color: category.color }} />
      </div>

      {/* Name */}
      <h3 className="text-white font-semibold text-base">{category.name}</h3>

      {/* Count */}
      <p className="text-sm text-text-muted">
        <span className="font-bold text-white">{category.count.toLocaleString()}</span>{' '}
        problems
      </p>
    </motion.button>
  );
};

export default CategoryCard;
