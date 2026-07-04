import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, List, SlidersHorizontal, Sparkles, Database, WifiOff } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import Filters from '../components/search/Filters';
import ProblemCard from '../components/cards/ProblemCard';
import Tag from '../components/ui/Tag';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import Sidebar from '../components/layout/Sidebar';
import EmptyState from '../components/feedback/EmptyState';
import Skeleton from '../components/feedback/Skeleton';
import { useDebounce, useMediaQuery } from '../hooks';
import { dummyProblems } from '../data/dummyData';
import { problemsApi } from '../services/api';
import type { FilterOptions, ViewMode, Problem } from '../types';

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const ITEMS_PER_PAGE = 9;

export default function Discover() {
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.get('category') || undefined,
    state: undefined,
    severity: undefined,
    year: undefined,
    sortBy: 'newest',
  });

  // State for API integration
  const [problems, setProblems] = useState<Problem[]>([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchSource, setSearchSource] = useState<'database' | 'live_search' | 'local_mock'>('local_mock');

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    document.title = 'Discover Problems — Government Problem Finder';
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  // Fetch problems from API with local fallback
  useEffect(() => {
    const fetchBackendProblems = async () => {
      setLoading(true);
      try {
        if (debouncedSearch.trim()) {
          // If search term is present, trigger live-search orchestrator which checks DB first, then scrapes if needed
          const res = await problemsApi.liveSearch(debouncedSearch.trim());
          
          // Apply filters locally on the search result
          let filtered = [...res.problems];
          if (filters.category) filtered = filtered.filter((p) => p.category === filters.category);
          if (filters.state) filtered = filtered.filter((p) => p.state === filters.state);
          if (filters.severity) filtered = filtered.filter((p) => p.severity === filters.severity);
          if (filters.year) filtered = filtered.filter((p) => p.published_year === filters.year);
          
          // Sort
          if (filters.sortBy === 'severity') {
            const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
            filtered.sort((a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4));
          } else {
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          }

          setTotalProblems(filtered.length);
          const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
          setProblems(paged);
          setSearchSource(res.source);
        } else {
          // Otherwise get standard paginated filtered list from the database
          const res = await problemsApi.getProblems({
            category: filters.category,
            state: filters.state,
            severity: filters.severity,
            year: filters.year,
            sortBy: filters.sortBy,
            page,
            pageSize: ITEMS_PER_PAGE,
          });
          setProblems(res.problems);
          setTotalProblems(res.total);
          setSearchSource('database');
        }
      } catch (err) {
        console.warn('Backend API unavailable. Falling back to local search filtering:', err);
        setSearchSource('local_mock');
        
        // Execute local filter logic
        let result = [...dummyProblems];

        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          result = result.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q)
          );
        }

        if (filters.category) result = result.filter((p) => p.category === filters.category);
        if (filters.state) result = result.filter((p) => p.state === filters.state);
        if (filters.severity) result = result.filter((p) => p.severity === filters.severity);
        if (filters.year) result = result.filter((p) => p.published_year === filters.year);

        // Sort
        if (filters.sortBy === 'severity') {
          const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          result.sort((a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4));
        } else {
          result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        setTotalProblems(result.length);
        const paged = result.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        setProblems(paged);
      } finally {
        setLoading(false);
      }
    };

    fetchBackendProblems();
  }, [debouncedSearch, filters, page]);

  // Execute explicit live search (AI Scraper + Extractor)
  const handleLiveSearch = (queryValue: string) => {
    const q = queryValue || search;
    setSearch(q.trim());
  };

  const totalPages = Math.ceil(totalProblems / ITEMS_PER_PAGE);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleFilterReset = () => {
    setFilters({ sortBy: 'newest' });
    setSearch('');
  };

  // Active filter tags
  const activeFilters: { key: string; label: string }[] = [];
  if (filters.category) activeFilters.push({ key: 'category', label: `Category: ${filters.category}` });
  if (filters.state) activeFilters.push({ key: 'state', label: `State: ${filters.state}` });
  if (filters.severity) activeFilters.push({ key: 'severity', label: `Severity: ${filters.severity}` });
  if (filters.year) activeFilters.push({ key: 'year', label: `Year: ${filters.year}` });

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Discover <span className="text-gradient">Problems</span>
              </h1>
              <p className="text-text-secondary">
                Search verified problems from official government reports using AI.
              </p>
            </div>

            {/* Premium Data Source Indicator */}
            <div className="text-sm">
              {searchSource === 'live_search' && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary-light animate-pulse-glow shadow-glow-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI Live Search Active</span>
                </div>
              )}
              {searchSource === 'database' && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>Database Connected</span>
                </div>
              )}
              {searchSource === 'local_mock' && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 text-text-muted">
                  <WifiOff className="w-4 h-4 text-text-muted" />
                  <span>Offline (Local Demo Data)</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Search + Controls */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={handleLiveSearch}
                placeholder="Type and press Enter to search government databases using AI..."
              />
            </div>

            <div className="flex items-center gap-2">
              {isMobile && (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<SlidersHorizontal className="w-4 h-4" />}
                  onClick={() => setSidebarOpen(true)}
                >
                  Filters
                </Button>
              )}
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg border transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-border text-text-muted hover:text-text hover:border-border-light'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg border transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-border text-text-muted hover:text-text hover:border-border-light'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Desktop Filters */}
        {!isMobile && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Filters filters={filters} onFilterChange={handleFilterChange} onReset={handleFilterReset} />
          </motion.div>
        )}

        {/* Active Filter Tags */}
        {activeFilters.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {activeFilters.map((f) => (
              <Tag key={f.key} label={f.label} onRemove={() => removeFilter(f.key)} />
            ))}
            <button
              onClick={handleFilterReset}
              className="text-sm text-text-muted hover:text-primary transition-colors"
            >
              Clear all
            </button>
          </motion.div>
        )}

        {/* Results count */}
        <div className="mb-4 text-sm text-text-muted flex justify-between items-center">
          <span>Showing {problems.length} of {totalProblems} problems</span>
          {searchSource === 'live_search' && (
            <span className="text-xs text-primary font-medium">✨ Real-time AI Extracted results</span>
          )}
        </div>

        {/* Problem Cards */}
        {loading ? (
          <div className="py-6">
            <Skeleton variant="card" count={6} />
          </div>
        ) : problems.length > 0 ? (
          <motion.div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }
            variants={stagger}
            initial="initial"
            animate="animate"
            key={`${page}-${debouncedSearch}-${JSON.stringify(filters)}-${problems.length}`}
          >
            {problems.map((problem) => (
              <motion.div key={problem.id} variants={fadeUp}>
                <ProblemCard problem={problem} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No problems found"
            description="Try typing a search query and pressing Enter to trigger a Live AI Search across government sites."
            action={
              <Button variant="primary" onClick={handleFilterReset}>
                Reset Filters
              </Button>
            }
          />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-10">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
