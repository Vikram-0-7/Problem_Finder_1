import { useState, useCallback } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { FilterOptions } from '../../types';
import { categories, indianStates, severityOptions, yearOptions, sortOptions } from '../../data/dummyData';
import Tag from '../ui/Tag';
import { useClickOutside } from '../../hooks';

/* ============================================
   FILTERS COMPONENT
   Horizontal filter bar with dropdowns and active tags
   ============================================ */

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string | undefined;
  onSelect: (value: string) => void;
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
  },
  exit: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.15 } },
};

const FilterDropdown = ({ label, options, selected, onSelect }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);
  const ref = useClickOutside(handleClose);

  const selectedLabel = options.find((o) => o.value === selected)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
          border transition-all duration-200
          ${selected
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-card border-border text-text-secondary hover:text-white hover:border-border-light'
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedLabel || label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              absolute z-50 mt-2 min-w-[200px] max-h-60 overflow-y-auto
              bg-card border border-border rounded-2xl py-2
              shadow-lg shadow-black/30
            "
            role="listbox"
          >
            {/* All option */}
            <button
              onClick={() => {
                onSelect('');
                setOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-sm transition-colors duration-150
                ${!selected ? 'text-primary bg-primary/5' : 'text-text-secondary hover:text-white hover:bg-white/5'}
              `}
              role="option"
              aria-selected={!selected}
            >
              All
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2 text-sm transition-colors duration-150
                  ${selected === option.value
                    ? 'text-primary bg-primary/5'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }
                `}
                role="option"
                aria-selected={selected === option.value}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Filters = ({ filters, onFilterChange, onReset }: FiltersProps) => {
  const categoryOptions = categories.map((c) => ({ value: c.name, label: c.name }));
  const stateOpts = indianStates.map((s) => ({ value: s, label: s }));
  const severityOpts = severityOptions.map((s) => ({ value: s, label: s }));
  const yearOpts = yearOptions.map((y) => ({ value: y, label: y }));
  const sortOpts = sortOptions;

  const activeFilters = [
    filters.category && { key: 'category', value: filters.category },
    filters.state && { key: 'state', value: filters.state },
    filters.severity && { key: 'severity', value: filters.severity },
    filters.year && { key: 'year', value: filters.year },
  ].filter(Boolean) as { key: string; value: string }[];

  return (
    <div className="space-y-4">
      {/* Dropdown Row */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          label="Category"
          options={categoryOptions}
          selected={filters.category}
          onSelect={(v) => onFilterChange('category', v)}
        />
        <FilterDropdown
          label="State"
          options={stateOpts}
          selected={filters.state}
          onSelect={(v) => onFilterChange('state', v)}
        />
        <FilterDropdown
          label="Severity"
          options={severityOpts}
          selected={filters.severity}
          onSelect={(v) => onFilterChange('severity', v)}
        />
        <FilterDropdown
          label="Year"
          options={yearOpts}
          selected={filters.year}
          onSelect={(v) => onFilterChange('year', v)}
        />
        <FilterDropdown
          label="Sort By"
          options={sortOpts}
          selected={filters.sortBy}
          onSelect={(v) => onFilterChange('sortBy', v)}
        />

        {activeFilters.length > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-white transition-colors duration-200"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted mr-1">Active:</span>
          {activeFilters.map((f) => (
            <Tag
              key={f.key}
              label={f.value}
              onRemove={() => onFilterChange(f.key, '')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;
