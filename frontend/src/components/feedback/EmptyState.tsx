import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

/* ============================================
   EMPTY STATE COMPONENT
   Centered placeholder for empty content areas
   ============================================ */

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const EmptyState = ({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {/* Icon */}
      <div className="p-5 rounded-3xl bg-card border border-border mb-6">
        {icon || <Inbox className="w-10 h-10 text-text-muted" />}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-text-muted max-w-md leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
