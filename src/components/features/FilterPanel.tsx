import React, { useState } from 'react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import type { FilterState, WorkAvailability } from '../../types/applicant.types';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  filterOptions: {
    locations: string[];
    skills: string[];
    educationLevels: string[];
    companies: string[];
    roles: string[];
  };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onModalClose?: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  filterOptions,
  isCollapsed = false,
  onToggleCollapse,
  onModalClose,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [skillsSearch, setSkillsSearch] = useState('');
  const [locationsSearch, setLocationsSearch] = useState('');

  const handleInputChange = (field: keyof FilterState, value: string | number | boolean | string[] | null) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleArrayToggle = (field: keyof FilterState, value: string) => {
    const currentArray = localFilters[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleInputChange(field, newArray);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onModalClose?.();
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      locations: [],
      workAvailability: [],
      minExperience: 0,
      maxSalary: 999999,
      educationLevel: [],
      skills: [],
      isShortlisted: null,
      isSelected: null,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onModalClose?.();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.locations.length > 0) count++;
    if (localFilters.workAvailability.length > 0) count++;
    if (localFilters.minExperience > 0) count++;
    if (localFilters.maxSalary < 999999) count++;
    if (localFilters.educationLevel.length > 0) count++;
    if (localFilters.skills.length > 0) count++;
    if (localFilters.isShortlisted !== null) count++;
    if (localFilters.isSelected !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  if (isCollapsed) {
    return (
      <Card variant="glass" className="mb-4">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
                Show Filters
              </Button>
              {activeFiltersCount > 0 && (
                <Badge variant="info" size="sm">
                  {activeFiltersCount} active
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
        {/* Search Section */}
        <div className="bg-[var(--muted)]/30 rounded-xl p-4 border border-[var(--border)]/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <label className="text-sm font-semibold text-[var(--foreground)]">
              Search
            </label>
          </div>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Search by name, skills, company..."
            className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all duration-200"
          />
        </div>

        {/* Basic Filters Section */}
        <div className="bg-[var(--muted)]/30 rounded-xl p-4 border border-[var(--border)]/50 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Location & Availability</h3>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
              Location
            </label>
            <div className="bg-[var(--card)] rounded-lg border border-[var(--border)]">
              <div className="p-3 border-b border-[var(--border)]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={locationsSearch}
                    onChange={(e) => setLocationsSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                  />
                  <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2 p-3">
                {filterOptions.locations
                  .filter(location => location.toLowerCase().includes(locationsSearch.toLowerCase()))
                  .slice(0, 10)
                  .map((location) => (
                  <label key={location} className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--accent)] rounded-md p-1 transition-colors duration-150">
                    <input
                      type="checkbox"
                      checked={localFilters.locations.includes(location)}
                      onChange={() => handleArrayToggle('locations', location)}
                      className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]/20 w-4 h-4"
                    />
                    <span className="text-sm text-[var(--foreground)]">{location}</span>
                  </label>
                ))}
                {filterOptions.locations.filter(location => location.toLowerCase().includes(locationsSearch.toLowerCase())).length === 0 && locationsSearch && (
                  <div className="text-sm text-[var(--muted-foreground)] text-center py-2">
                    No locations found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Work Availability */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
              Work Availability
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['full-time', 'part-time', 'contract', 'internship'] as WorkAvailability[]).map((availability) => (
                <label key={availability} className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--accent)] rounded-lg p-2 transition-colors duration-150">
                  <input
                    type="checkbox"
                    checked={localFilters.workAvailability.includes(availability)}
                    onChange={() => handleArrayToggle('workAvailability', availability)}
                    className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]/20 w-4 h-4"
                  />
                  <span className="text-sm text-[var(--foreground)] capitalize">
                    {availability.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Experience & Salary Section */}
        <div className="bg-[var(--muted)]/30 rounded-xl p-4 border border-[var(--border)]/50 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Experience & Salary</h3>
          </div>

          {/* Experience Range */}
          <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
              Minimum Experience (roles)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={localFilters.minExperience}
              onChange={(e) => handleInputChange('minExperience', parseInt(e.target.value))}
              className="w-full h-3 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(localFilters.minExperience / 10) * 100}%, var(--muted) ${(localFilters.minExperience / 10) * 100}%, var(--muted) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
              <span>0</span>
              <span className="font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md">
                {localFilters.minExperience} roles
              </span>
              <span>10+</span>
            </div>
          </div>

          {/* Salary Range */}
          <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
              Maximum Salary Expectation
            </label>
            <input
              type="range"
              min="30000"
              max="200000"
              step="10000"
              value={localFilters.maxSalary}
              onChange={(e) => handleInputChange('maxSalary', parseInt(e.target.value))}
              className="w-full h-3 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((localFilters.maxSalary - 30000) / (200000 - 30000)) * 100}%, var(--muted) ${((localFilters.maxSalary - 30000) / (200000 - 30000)) * 100}%, var(--muted) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
              <span>$30k</span>
              <span className="font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md">
                ${localFilters.maxSalary === 999999 ? 'No limit' : `${(localFilters.maxSalary / 1000).toFixed(0)}k`}
              </span>
              <span>$200k+</span>
            </div>
          </div>
        </div>

        {/* Qualifications Section */}
        <div className="bg-[var(--muted)]/30 rounded-xl p-4 border border-[var(--border)]/50 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Qualifications</h3>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
              Education Level
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2 bg-[var(--card)] rounded-lg p-3 border border-[var(--border)]">
              {filterOptions.educationLevels.map((level) => (
                <label key={level} className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--accent)] rounded-md p-1 transition-colors duration-150">
                  <input
                    type="checkbox"
                    checked={localFilters.educationLevel.includes(level)}
                    onChange={() => handleArrayToggle('educationLevel', level)}
                    className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]/20 w-4 h-4"
                  />
                  <span className="text-sm text-[var(--foreground)]">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
              Skills
            </label>
            <div className="bg-[var(--card)] rounded-lg border border-[var(--border)]">
              <div className="p-3 border-b border-[var(--border)]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={skillsSearch}
                    onChange={(e) => setSkillsSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                  />
                  <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 p-3">
                {filterOptions.skills
                  .filter(skill => skill.toLowerCase().includes(skillsSearch.toLowerCase()))
                  .slice(0, 30)
                  .map((skill) => (
                  <label key={skill} className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--accent)] rounded-md p-1 transition-colors duration-150">
                    <input
                      type="checkbox"
                      checked={localFilters.skills.includes(skill)}
                      onChange={() => handleArrayToggle('skills', skill)}
                      className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]/20 w-4 h-4"
                    />
                    <span className="text-sm text-[var(--foreground)] truncate">{skill}</span>
                  </label>
                ))}
                {filterOptions.skills.filter(skill => skill.toLowerCase().includes(skillsSearch.toLowerCase())).length === 0 && skillsSearch && (
                  <div className="text-sm text-[var(--muted-foreground)] text-center py-2">
                    No skills found
                  </div>
                )}
                {!skillsSearch && (
                  <div className="text-xs text-[var(--muted-foreground)] text-center py-2 border-t border-[var(--border)] mt-2 pt-2">
                    Showing top {Math.min(30, filterOptions.skills.length)} skills
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Filters Section */}
        <div className="bg-[var(--muted)]/30 rounded-xl p-4 border border-[var(--border)]/50 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Selection Status</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--accent)] rounded-lg p-2 transition-colors duration-150">
              <input
                type="checkbox"
                checked={localFilters.isShortlisted === true}
                onChange={(e) => handleInputChange('isShortlisted', e.target.checked ? true : null)}
                className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]/20 w-4 h-4"
              />
              <span className="text-sm text-[var(--foreground)]">Show only shortlisted candidates</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--accent)] rounded-lg p-2 transition-colors duration-150">
              <input
                type="checkbox"
                checked={localFilters.isSelected === true}
                onChange={(e) => handleInputChange('isSelected', e.target.checked ? true : null)}
                className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]/20 w-4 h-4"
              />
              <span className="text-sm text-[var(--foreground)]">Show only selected candidates</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[var(--muted)]/30 rounded-xl p-4 border border-[var(--border)]/50">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              variant="secondary" 
              onClick={resetFilters}
              className="flex-1 sm:flex-none sm:px-6 py-3 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All
            </Button>
            <Button 
              variant="primary" 
              onClick={applyFilters}
              className="flex-1 sm:flex-auto sm:px-8 py-3 font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 hover:from-[var(--primary)]/90 hover:to-[var(--primary)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>
          {activeFiltersCount > 0 && (
            <div className="mt-3 text-center">
              <span className="text-xs text-[var(--muted-foreground)] bg-[var(--primary)]/10 px-2 py-1 rounded-full">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </span>
            </div>
          )}
        </div>
    </div>
  );
};

export default FilterPanel;