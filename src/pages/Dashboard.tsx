import React, { useState, useEffect } from 'react';
import { useHiringStore } from '../store';
import { extractFilterOptions } from '../utils/data-processing';
import CandidateCard from '../components/features/CandidateCard';
import FilterPanel from '../components/features/FilterPanel';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    // Navigate to candidate detail page
    console.log('View details for:', applicantId);
  };

  const shortlistCount = getShortlistCount();
  const selectedCount = getSelectedCount();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hiring Dashboard</h1>
              <p className="text-sm text-gray-600">
                {filteredApplicants.length} of {applicants.length} candidates
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant="info">{shortlistCount} Shortlisted</Badge>
                <Badge variant="success">{selectedCount}/5 Selected</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

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
          <div className="flex-1">
            {/* Selection Progress */}
            {selectedCount > 0 && (
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">
                        Team Selection Progress
                      </h3>
                      <p className="text-sm text-blue-700">
                        {selectedCount} of 5 candidates selected
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(selectedCount / 5) * 100}%` }}
                        />
                      </div>
                      <Button variant="ghost" size="sm">
                        View Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {filteredApplicants.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No candidates found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters to see more candidates
                  </p>
                  <Button 
                    variant="secondary" 
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
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredApplicants.map((applicant) => (
                  <CandidateCard
                    key={applicant.id}
                    applicant={applicant}
                    score={scores[applicant.id]}
                    isShortlisted={applicant.id in shortlisted}
                    isSelected={applicant.id in selected}
                    onShortlist={handleShortlist}
                    onRemoveFromShortlist={handleRemoveFromShortlist}
                    onSelect={handleSelect}
                    onViewDetails={handleViewDetails}
                    compact={viewMode === 'list'}
                  />
                ))}
              </div>
            )}

            {/* Load More / Pagination could go here */}
            {filteredApplicants.length > 50 && (
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">
                  Showing first 50 candidates. Use filters to refine results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;