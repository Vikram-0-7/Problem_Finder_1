import { type ReactNode, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '../../hooks';

/* ============================================
   DROPDOWN COMPONENT
   Animated dropdown menu with click-outside close
   ============================================ */

interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.15 } },
};

const Dropdown = ({ trigger, items, align = 'left' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => setIsOpen(false), []);
  const ref = useClickOutside(handleClose);

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              absolute z-50 mt-2 min-w-[200px]
              bg-card border border-border rounded-2xl py-2
              shadow-lg shadow-black/30
              ${align === 'right' ? 'right-0' : 'left-0'}
            `}
            role="listbox"
          >
            {items.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="
                  w-full flex items-center gap-3 px-4 py-2.5
                  text-sm text-text-secondary hover:text-white
                  hover:bg-white/5 transition-colors duration-150
                  text-left
                "
                role="option"
              >
                {item.icon && (
                  <span className="shrink-0 text-text-muted">{item.icon}</span>
                )}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
