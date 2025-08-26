import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  className = '',
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  const itemsPerPageOptions = [10, 20, 50, 100];

  if (totalPages <= 1) {
    return null;
  }

  return (
    <motion.div
      className={`flex flex-col items-center gap-4 sm:gap-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Items info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full max-w-4xl gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-[var(--muted-foreground)] font-medium text-center sm:text-left">
          Showing <span className="font-semibold text-[var(--foreground)]">{startItem}</span> to{' '}
          <span className="font-semibold text-[var(--foreground)]">{endItem}</span> of{' '}
          <span className="font-semibold text-[var(--foreground)]">{totalItems}</span> candidates
        </div>
        
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm border border-[var(--border)] rounded-lg bg-[var(--card)] hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)] transition-all duration-200"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation controls - Responsive layout */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-4xl">
        {/* Previous button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={currentPage > 1 ? "primary" : "ghost"}
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
            className="px-4 py-2 sm:px-6 sm:py-3 font-semibold w-full sm:w-auto"
          >
            <span className="sm:inline">Previous</span>
          </Button>
        </motion.div>

        {/* Page indicator */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 sm:px-4 sm:py-2 shadow-sm">
            <span className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)]">Page</span>
            <span className="text-lg sm:text-lg font-bold text-[var(--primary)] mx-2">{currentPage}</span>
            <span className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)]">of {totalPages}</span>
          </div>
          
          {/* Quick page navigation for nearby pages - Hide on mobile if too many pages */}
          {totalPages > 1 && (
            <div className="hidden sm:flex items-center gap-1">
              {getVisiblePages().slice(0, 5).map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="px-2 py-1 text-[var(--muted-foreground)] text-sm"
                    >
                      ...
                    </span>
                  );
                }

                const pageNumber = page as number;
                const isActive = pageNumber === currentPage;

                return (
                  <motion.button
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    className={`
                      px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)]'
                      }
                    `}
                    whileHover={{ scale: isActive ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNumber}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Next button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={currentPage < totalPages ? "primary" : "ghost"}
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
            iconPosition="right"
            className="px-4 py-2 sm:px-6 sm:py-3 font-semibold w-full sm:w-auto"
          >
            <span className="sm:inline">Next</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Pagination;