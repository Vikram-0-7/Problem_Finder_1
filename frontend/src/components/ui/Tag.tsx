import { X } from 'lucide-react';

/* ============================================
   TAG COMPONENT
   Removable pill tag with custom color
   ============================================ */

interface TagProps {
  label: string;
  onRemove?: () => void;
  color?: string;
  className?: string;
}

const Tag = ({
  label,
  onRemove,
  color = '#FF6A00',
  className = '',
}: TagProps) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium
        border transition-all duration-200
        ${className}
      `}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color: color,
      }}
    >
      {label}

      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-white/10 transition-colors duration-200"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Tag;
