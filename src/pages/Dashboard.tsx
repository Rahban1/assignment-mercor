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
              className="fixed inset-0 sm:inset-4 md:inset-8 lg:inset-16 bg-[var(--card)] border-0 sm:border border-[var(--border)] rounded-none sm:rounded-2xl z-50 flex flex-col max-h-screen"
              style={{ boxShadow: 'var(--shadow-2xl)' }}
            >
              {/* Modal Header */}
              <div className="bg-[var(--accent)] border-b border-[var(--border)] p-4 sm:p-6 flex-shrink-0 rounded-none sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">Filter Candidates</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterModalOpen(false)}
                    className="p-1.5 sm:p-2 hover:bg-[var(--accent)] text-[var(--foreground)] rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto bg-[var(--card)] rounded-none sm:rounded-b-2xl">
                <div className="p-4 sm:p-6">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={updateFilters}
                    filterOptions={filterOptions}
                    isCollapsed={false}
                    onToggleCollapse={() => setIsFilterModalOpen(false)}
                  />
                </div>
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
      <motion.button
        onClick={() => setIsFilterModalOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: 'var(--shadow-xl)' }}
        aria-label="Open filters"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        
        {/* Tooltip - Only show on desktop */}
        <div className="hidden sm:block absolute bottom-16 right-0 bg-[var(--popover)] border border-[var(--border)] text-[var(--popover-foreground)] px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Filter Candidates
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--border)]"></div>
        </div>
      </motion.button>

    </div>
  );
};

export default Dashboard;