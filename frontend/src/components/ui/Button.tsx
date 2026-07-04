import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/* ============================================
   BUTTON COMPONENT
   Premium button with variants, sizes, and animations
   ============================================ */

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-[#FF5A00] to-[#FF8C00] text-white shadow-lg hover:shadow-glow',
  secondary:
    'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
  ghost:
    'bg-transparent text-text-secondary hover:bg-white/5 hover:text-white',
  danger:
    'bg-danger/10 border border-danger/25 text-danger hover:bg-danger/20',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-7 py-3.5 text-sm gap-2',
  lg: 'px-9 py-4 text-base gap-2.5',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  className = '',
  fullWidth = false,
  type = 'button',
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { y: -3, scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center font-semibold rounded-[14px]
        transition-all duration-300 cursor-pointer select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      aria-label={typeof children === 'string' ? children : undefined}
      aria-disabled={isDisabled}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
