import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

/* ============================================
   SEARCH BAR COMPONENT
   Responsive search with hero variant for landing page
   ============================================ */

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  size?: 'default' | 'large' | 'hero';
}

const sizeConfig = {
  default: {
    wrapper: 'max-w-xl',
    input: 'px-12 py-3.5 text-sm',
    icon: 'left-4 w-4 h-4',
    button: 'right-2 px-4 py-2 text-sm',
  },
  large: {
    wrapper: 'max-w-2xl',
    input: 'px-14 py-4.5 text-base',
    icon: 'left-5 w-5 h-5',
    button: 'right-2.5 px-5 py-2.5 text-sm',
  },
  hero: {
    wrapper: 'max-w-3xl',
    input: 'px-16 py-5 md:py-6 text-base md:text-lg',
    icon: 'left-6 w-5 h-5 md:w-6 md:h-6',
    button: 'right-3 px-6 py-3 text-sm md:text-base',
  },
};

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search government problems...',
  size = 'default',
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const config = sizeConfig[size];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${config.wrapper} mx-auto`}>
      <motion.div
        className="relative"
        whileFocus={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Search Icon */}
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-text-muted pointer-events-none ${config.icon}`}
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full bg-[#171717] border border-border text-white rounded-2xl
            outline-none transition-all duration-300
            placeholder:text-text-muted
            focus:border-primary focus:shadow-glow
            ${config.input}
          `}
          aria-label="Search"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className={`
            absolute top-1/2 -translate-y-1/2
            bg-gradient-to-r from-[#FF5A00] to-[#FF8C00]
            text-white font-semibold rounded-xl
            hover:shadow-glow transition-shadow duration-200
            ${config.button}
          `}
          aria-label="Submit search"
        >
          Search
        </button>
      </motion.div>
    </form>
  );
};

export default SearchBar;
