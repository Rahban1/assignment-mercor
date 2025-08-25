import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
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
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  filterOptions,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleInputChange = (field: keyof FilterState, value: any) => {
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
      <Card className="mb-4">
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
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="info" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
              Hide
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Search by name, skills, company..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {filterOptions.locations.slice(0, 10).map((location) => (
              <label key={location} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localFilters.locations.includes(location)}
                  onChange={() => handleArrayToggle('locations', location)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Work Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Availability
          </label>
          <div className="space-y-1">
            {(['full-time', 'part-time', 'contract', 'internship'] as WorkAvailability[]).map((availability) => (
              <label key={availability} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localFilters.workAvailability.includes(availability)}
                  onChange={() => handleArrayToggle('workAvailability', availability)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {availability.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Experience (roles)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={localFilters.minExperience}
            onChange={(e) => handleInputChange('minExperience', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className="font-medium">{localFilters.minExperience} roles</span>
            <span>10+</span>
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Salary Expectation
          </label>
          <input
            type="range"
            min="30000"
            max="200000"
            step="10000"
            value={localFilters.maxSalary}
            onChange={(e) => handleInputChange('maxSalary', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$30k</span>
            <span className="font-medium">
              ${localFilters.maxSalary === 999999 ? 'No limit' : `${(localFilters.maxSalary / 1000).toFixed(0)}k`}
            </span>
            <span>$200k+</span>
          </div>
        </div>

        {/* Education Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Level
          </label>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {filterOptions.educationLevels.map((level) => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localFilters.educationLevel.includes(level)}
                  onChange={() => handleArrayToggle('educationLevel', level)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills (top skills)
          </label>
          <div className="max-h-32 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1">
              {filterOptions.skills.slice(0, 20).map((skill) => (
                <label key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.skills.includes(skill)}
                    onChange={() => handleArrayToggle('skills', skill)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700 truncate">{skill}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.isShortlisted === true}
                onChange={(e) => handleInputChange('isShortlisted', e.target.checked ? true : null)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show only shortlisted</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.isSelected === true}
                onChange={(e) => handleInputChange('isSelected', e.target.checked ? true : null)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show only selected</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="secondary" onClick={resetFilters}>
            Reset All
          </Button>
          <Button variant="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;