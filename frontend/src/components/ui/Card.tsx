import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

/* ============================================
   CARD COMPONENT
   Glassmorphic card with hover glow and elevation
   ============================================ */

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingStyles: Record<string, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  padding = 'md',
}: CardProps) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={
        hover
          ? {
              y: -6,
              transition: { type: 'spring', stiffness: 300, damping: 20 },
            }
          : {}
      }
      className={`
        bg-card border border-border rounded-3xl
        transition-colors duration-300
        ${paddingStyles[padding]}
        ${hover ? 'hover:bg-card-hover hover:border-primary hover:shadow-glow cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? 'Clickable card' : undefined}
    >
      {children}
    </motion.div>
  );
};

export default Card;
