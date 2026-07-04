import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useCountUp, useInView } from '../../hooks';
import { formatNumber } from '../../utils';

/* ============================================
   STATS CARD COMPONENT
   Animated counter card with icon and trend
   ============================================ */

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}

const StatsCard = ({
  label,
  value,
  icon,
  trend,
  color = '#FF6A00',
}: StatsCardProps) => {
  const [ref, inView] = useInView(0.3);
  const numericValue = typeof value === 'number' ? value : parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const animatedCount = useCountUp(numericValue, 2000, inView);
  const displayValue = typeof value === 'number' ? formatNumber(animatedCount) : value;

  // Resolve icon dynamically
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.BarChart3;

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="
        relative overflow-hidden
        bg-card border border-border rounded-3xl p-6
        hover:bg-card-hover hover:border-primary/50 hover:shadow-glow
        transition-colors duration-300
      "
    >
      {/* Subtle background gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: color }}
      />

      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-2xl"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
        >
          <IconComponent className="w-5 h-5" style={{ color }} />
        </div>

        {trend && (
          <span
            className={`
              flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
              ${trend.direction === 'up'
                ? 'text-success bg-success/10'
                : 'text-danger bg-danger/10'
              }
            `}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div className="relative">
        <p className="text-3xl font-bold text-white mb-1">
          {typeof value === 'number' ? displayValue : value}
        </p>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
