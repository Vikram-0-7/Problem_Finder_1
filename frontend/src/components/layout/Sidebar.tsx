import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { categories, indianStates, severityOptions, yearOptions } from '../../data/dummyData';
import Button from '../ui/Button';

/* ============================================
   SIDEBAR COMPONENT
   Mobile slide-in filter sidebar for Discover page
   ============================================ */

interface SidebarFilters {
  category?: string;
  state?: string;
  severity?: string;
  year?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SidebarFilters;
  onFilterChange: (key: string, value: string) => void;
}

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: { x: '-100%', transition: { duration: 0.25 } },
};

interface FilterSectionProps {
  title: string;
  options: readonly string[] | string[];
  selected: string | undefined;
  filterKey: string;
  onSelect: (key: string, value: string) => void;
}

const FilterSection = ({ title, options, selected, filterKey, onSelect }: FilterSectionProps) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
      {title}
    </h3>
    <div className="flex flex-col gap-1">
      {options.map((option) => {
        const value = typeof option === 'string' ? option : String(option);
        const isActive = selected === value;
        return (
          <button
            key={value}
            onClick={() => onSelect(filterKey, isActive ? '' : value)}
            className={`
              text-left px-3 py-2 rounded-xl text-sm transition-all duration-200
              ${isActive
                ? 'bg-primary/15 text-primary border border-primary/25'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
              }
            `}
          >
            {value}
          </button>
        );
      })}
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose, filters, onFilterChange }: SidebarProps) => {
  const handleReset = () => {
    onFilterChange('category', '');
    onFilterChange('state', '');
    onFilterChange('severity', '');
    onFilterChange('year', '');
  };

  const categoryNames = categories.map((c) => c.name);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              fixed top-0 left-0 bottom-0 z-[70] w-80
              bg-surface border-r border-border
              overflow-y-auto
              lg:hidden
            "
            aria-label="Filter sidebar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="p-6">
              <FilterSection
                title="Category"
                options={categoryNames}
                selected={filters.category}
                filterKey="category"
                onSelect={onFilterChange}
              />

              <FilterSection
                title="State"
                options={indianStates}
                selected={filters.state}
                filterKey="state"
                onSelect={onFilterChange}
              />

              <FilterSection
                title="Severity"
                options={severityOptions}
                selected={filters.severity}
                filterKey="severity"
                onSelect={onFilterChange}
              />

              <FilterSection
                title="Year"
                options={yearOptions}
                selected={filters.year}
                filterKey="year"
                onSelect={onFilterChange}
              />
            </div>

            {/* Bottom Actions */}
            <div className="sticky bottom-0 bg-surface border-t border-border px-6 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={handleReset}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
