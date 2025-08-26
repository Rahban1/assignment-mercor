import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHiringStore } from '../store';
import { extractFilterOptions } from '../utils/data-processing';
import CandidateListItem from '../components/features/CandidateListItem';
import CandidateDetailView from '../components/features/CandidateDetailView';
import FilterPanel from '../components/features/FilterPanel';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import BackToTop from '../components/ui/BackToTop';
import { AlertTriangleIcon, SearchIcon, UsersIcon, StarIcon, SparklesIcon, TargetIcon, RefreshIcon } from '../components/ui/Icons';
import type { Applicant } from '../types/applicant.types';

const Dashboard: React.FC = () => {
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

  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
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
      alert('You have already selected 5 candidates. Please remove one before selecting another.');
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
        className="glass border-b border-white/20 backdrop-blur-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-gradient">Hiring Dashboard</h1>
              <p className="text-sm text-[var(--muted-foreground)] font-medium mt-1">
                <SparklesIcon size={16} className="inline mr-1" /> {filteredApplicants.length} of {applicants.length} talented candidates
                {filteredApplicants.length > itemsPerPage && (
                  <span className="ml-2 text-[var(--primary)]">
                    • Page {currentPage} of {totalPages}
                  </span>
                )}
              </p>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center space-x-3">
                <Badge variant="gradient" animated={true} glow={true}>
                  <StarIcon size={16} className="inline mr-1" /> {shortlistCount} Shortlisted
                </Badge>
                <Badge variant="success" animated={true} glow={selectedCount > 0}>
                  <SparklesIcon size={16} className="inline mr-1" /> {selectedCount}/5 Selected
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={updateFilters}
              filterOptions={filterOptions}
              isCollapsed={isFiltersCollapsed}
              onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1" id="results-section">
            {/* Selection Progress */}
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card className="mb-6 gradient-primary text-white" variant="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white flex items-center space-x-2">
                          <TargetIcon size={16} />
                          <span>Team Selection Progress</span>
                        </h3>
                        <p className="text-sm text-white/80 mt-1">
                          {selectedCount} of 5 candidates selected
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-white/20 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-white h-3 rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedCount / 5) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <Button variant="secondary" size="sm" icon={<UsersIcon size={16} />}>
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
                  <CardContent className="text-center py-16">
                    <motion.div 
                      className="text-[var(--muted-foreground)] text-8xl mb-6"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <SearchIcon size={64} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                      No candidates found
                    </h3>
                    <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                      We couldn't find any candidates matching your current filters. Try adjusting your search criteria to discover more talent.
                    </p>
                    <Button 
                      variant="gradient"
                      size="lg"
                      icon={<RefreshIcon size={16} />}
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

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Dashboard;