import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ============================================
   PAGINATION COMPONENT
   Page navigation with ellipsis for large sets
   ============================================ */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 2;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          p-2.5 rounded-xl border border-border text-text-secondary
          hover:bg-card-hover hover:text-white hover:border-primary
          transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none
        "
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        typeof page === 'string' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-text-muted text-sm select-none"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-[40px] h-10 rounded-xl text-sm font-medium
              transition-all duration-200
              ${
                page === currentPage
                  ? 'bg-primary text-white shadow-glow'
                  : 'border border-border text-text-secondary hover:bg-card-hover hover:text-white hover:border-primary'
              }
            `}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          p-2.5 rounded-xl border border-border text-text-secondary
          hover:bg-card-hover hover:text-white hover:border-primary
          transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none
        "
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
