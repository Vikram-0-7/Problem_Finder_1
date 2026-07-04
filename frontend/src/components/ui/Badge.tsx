import { type ReactNode } from 'react';

/* ============================================
   BADGE COMPONENT
   Semantic pill badges with color variants
   ============================================ */

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  icon?: ReactNode;
  style?: React.CSSProperties;
}

const variantStyles: Record<string, string> = {
  default: 'bg-primary/10 text-primary-light border-primary/25',
  success: 'bg-success/10 text-success border-success/25',
  warning: 'bg-warning/10 text-warning border-warning/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-4 py-1.5 text-sm',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  style,
}: BadgeProps) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={style}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
