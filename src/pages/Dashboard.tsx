import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useHiringStore } from '../store';
import { extractFilterOptions } from '../utils/data-processing';
import CandidateListItem from '../components/features/CandidateListItem';
import CandidateDetailView from '../components/features/CandidateDetailView';
import FilterPanel from '../components/features/FilterPanel';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import DarkModeToggle from '../components/ui/DarkModeToggle';
import { AlertTriangleIcon, SearchIcon, UsersIcon, StarIcon, SparklesIcon, TargetIcon, RefreshIcon } from '../components/ui/Icons';
import type { Applicant } from '../types/applicant.types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    applicants,
    filteredApplicants,
    scores,
    shortlisted,
    selected,
    filters,
    loading,
    error,
    updateFilters,
    addToShortlist,
    removeFromShortlist,
    selectCandidate,
    getShortlistCount,
    getSelectedCount,
  } = useHiringStore();

  const [filterOptions, setFilterOptions] = useState<{
    locations: string[];
    skills: string[];
    educationLevels: string[];
    workAvailability: string[];
    companies: string[];
    roles: string[];
  }>({
    locations: [],
    skills: [],
    educationLevels: [],
    workAvailability: [],
    companies: [],
    roles: [],
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (applicants.length > 0) {
      const options = extractFilterOptions(applicants);
      setFilterOptions(options);
    }
  }, [applicants]);

  const handleShortlist = (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId);
    if (applicant) {
      addToShortlist(applicantId, `Strong candidate with relevant experience`, 'medium');
    }
  };

  const handleRemoveFromShortlist = (applicantId: string) => {
    removeFromShortlist(applicantId);
  };

  const handleSelect = (applicantId: string) => {
    if (getSelectedCount() >= 5) {
      toast.warning('You have already selected 5 candidates. Please remove one before selecting another.');
      return;
    }
    
    const applicant = applicants.find(a => a.id === applicantId);
    if (applicant) {
      selectCandidate(
        applicantId,
        'Team Member',
        `Selected for diverse skills and strong performance`,
        'skills' // This could be determined dynamically based on team composition
      );
    }
  };

  const handleViewDetails = (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId);
    if (applicant) {
      setSelectedCandidate(applicant);
    }
  };

  const handleCloseDetails = () => {
    setSelectedCandidate(null);
  };

  const shortlistCount = getShortlistCount();
  const selectedCount = getSelectedCount();

  // Calculate active filters count for floating button
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.locations.length > 0) count++;
    if (filters.workAvailability.length > 0) count++;
    if (filters.minExperience > 0) count++;
    if (filters.maxSalary < 999999) count++;
    if (filters.educationLevel.length > 0) count++;
    if (filters.skills.length > 0) count++;
    if (filters.isShortlisted !== null) count++;
    if (filters.isSelected !== null) count++;
    return count;
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, filteredApplicants.length]);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Smooth scroll to top of results
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <div className="text-[var(--destructive)] mb-4">
              <AlertTriangleIcon size={64} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Error Loading Data</h2>
            <p className="text-[var(--muted-foreground)] mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <motion.header 
        className="glass border-b border-white/20 backdrop-blur-xl sticky top-0 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-5 gap-3 sm:gap-0">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex-1"
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--foreground)]">Hiring Dashboard</h1>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-medium mt-1 flex flex-wrap items-center gap-1">
                <span className="flex items-center">
                  <SparklesIcon size={14} className="inline mr-1" /> 
                  {filteredApplicants.length} of {applicants.length} candidates
                </span>
                {filteredApplicants.length > itemsPerPage && (
                  <span className="text-[var(--primary)]">
                    • Page {currentPage} of {totalPages}
                  </span>
                )}
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Badge variant="gradient" animated={true} glow={true} size="sm">
                  <StarIcon size={14} className="inline mr-1" /> 
                  <span className="hidden xs:inline">Shortlisted </span>
                  {shortlistCount}
                </Badge>
                <Badge variant="success" animated={true} glow={selectedCount > 0} size="sm">
                  <SparklesIcon size={14} className="inline mr-1" /> 
                  <span className="hidden xs:inline">Selected </span>
                  {selectedCount}/5
                </Badge>
              </div>
              <DarkModeToggle size="sm" />
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 min-h-0">

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-hidden" id="results-section">
            {/* Selection Progress */}
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card className="mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700" variant="glass">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                          <TargetIcon size={14} className="sm:w-4 sm:h-4" />
                          <span className="text-sm sm:text-base">Team Selection Progress</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {selectedCount} of 5 candidates selected
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="w-full sm:w-32 bg-gray-300 dark:bg-gray-600 rounded-full h-2 sm:h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gray-600 dark:bg-gray-300 h-2 sm:h-3 rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedCount / 5) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          icon={<UsersIcon size={14} className="sm:w-4 sm:h-4" />} 
                          onClick={() => navigate('/selection')}
                          className="w-full sm:w-auto text-xs sm:text-sm"
                        >
                          View Team
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Results */}
            {filteredApplicants.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Card variant="glass">
                  <CardContent className="text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
                    <motion.div 
                      className="text-[var(--muted-foreground)] text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <SearchIcon size={32} className="sm:hidden mx-auto" />
                      <SearchIcon size={48} className="hidden sm:block lg:hidden mx-auto" />
                      <SearchIcon size={64} className="hidden lg:block mx-auto" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-2 sm:mb-3">
                      No candidates found
                    </h3>
                    <p className="text-sm sm:text-base text-[var(--muted-foreground)] mb-4 sm:mb-6 max-w-md mx-auto">
                      We couldn't find any candidates matching your current filters. Try adjusting your search criteria to discover more talent.
                    </p>
                    <Button 
                      variant="gradient"
                      size="sm"
                      className="sm:px-6 sm:py-3"
                      icon={<RefreshIcon size={14} className="sm:w-4 sm:h-4" />}
                      onClick={() => updateFilters({
                        search: "",
                        locations: [],
                        workAvailability: [],
                        minExperience: 0,
                        maxSalary: 999999,
                        educationLevel: [],
                        skills: [],
                        isShortlisted: null,
                        isSelected: null,
                      })}
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                key={`list-page-${currentPage}`}
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {paginatedApplicants.map((applicant, index) => (
                  <CandidateListItem
                    key={applicant.id}
                    applicant={applicant}
                    score={scores[applicant.id]}
                    isShortlisted={applicant.id in shortlisted}
                    isSelected={applicant.id in selected}
                    onClick={handleViewDetails}
                    delay={0.1 + (index * 0.05)}
                  />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {filteredApplicants.length > 0 && (
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredApplicants.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </motion.div>
            )}

          </div>

          
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <>
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsFilterModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 sm:inset-4 md:inset-y-8 md:inset-x-16 lg:inset-y-12 lg:inset-x-24 xl:inset-y-16 xl:inset-x-32 bg-[var(--card)] border-0 sm:border border-[var(--border)] rounded-none sm:rounded-2xl z-50 flex flex-col max-h-screen"
              style={{ boxShadow: 'var(--shadow-2xl)' }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[var(--card)] to-[var(--muted)] border-b border-[var(--border)] p-4 sm:p-6 flex-shrink-0 rounded-none sm:rounded-t-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 rounded-xl shadow-lg flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </motion.div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Filter Candidates</h2>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">Refine your search to find the perfect candidates</p>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFilterModalOpen(false)}
                      className="p-2 sm:p-3 hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-xl transition-all duration-200 group"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto bg-[var(--card)] rounded-none sm:rounded-b-2xl scrollbar-thin scrollbar-thumb-[var(--primary)]/30 scrollbar-track-transparent hover:scrollbar-thumb-[var(--primary)]/50">
                <motion.div 
                  className="p-4 sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={updateFilters}
                    filterOptions={filterOptions}
                    isCollapsed={false}
                    onToggleCollapse={() => setIsFilterModalOpen(false)}
                    onModalClose={() => setIsFilterModalOpen(false)}
                  />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Candidate Detail View Overlay */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateDetailView
            applicant={selectedCandidate}
            score={scores[selectedCandidate.id]}
            isShortlisted={selectedCandidate.id in shortlisted}
            isSelected={selectedCandidate.id in selected}
            onShortlist={handleShortlist}
            onRemoveFromShortlist={handleRemoveFromShortlist}
            onSelect={handleSelect}
            onClose={handleCloseDetails}
          />
        )}
      </AnimatePresence>

      {/* Floating Filter Button */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsFilterModalOpen(true)}
          className="overflow-visible relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 text-[var(--primary-foreground)] rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          style={{ boxShadow: 'var(--shadow-2xl)' }}
          aria-label="Open filters"
        >
          {/* Background ripple effect */}
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          <svg className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          
          {/* Active filter indicator */}
          {getActiveFiltersCount() > 0 && (
            <motion.div 
              className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--destructive)] text-white rounded-full text-xs font-bold flex items-center justify-center border-2 border-[var(--card)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {getActiveFiltersCount()}
            </motion.div>
          )}
          
          {/* Tooltip - Only show on desktop */}
          <motion.div 
            className="hidden sm:block absolute bottom-20 right-0 bg-[var(--popover)] border border-[var(--border)] text-[var(--popover-foreground)] px-4 py-2 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-lg"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
          >
            Filter Candidates
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--border)]"></div>
          </motion.div>
        </motion.button>
      </motion.div>

    </div>
  );
};

export default Dashboard;