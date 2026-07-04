import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

/* ============================================
   ERROR STATE COMPONENT
   Error display with retry action
   ============================================ */

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again later.',
  onRetry,
}: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {/* Icon */}
      <div className="p-5 rounded-3xl bg-danger/10 border border-danger/20 mb-6">
        <AlertTriangle className="w-10 h-10 text-danger" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

      {/* Message */}
      <p className="text-sm text-text-muted max-w-md leading-relaxed mb-6">
        {message}
      </p>

      {/* Retry */}
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;
