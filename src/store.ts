import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Applicant,
  ApplicantScore,
  ShortlistedCandidate,
  SelectedCandidate,
  FilterState,
  SortConfig,
  DiversityMetrics,
} from "./types/applicant.types";

interface HiringState {
  // Data
  applicants: Applicant[];
  scores: Record<string, ApplicantScore>;
  shortlisted: Record<string, ShortlistedCandidate>;
  selected: Record<string, SelectedCandidate>;
  
  // UI State
  loading: boolean;
  error: string | null;
  filters: FilterState;
  sorting: SortConfig;
  
  // Computed Data
  filteredApplicants: Applicant[];
  diversityMetrics: DiversityMetrics | null;
  
  // Actions
  loadApplicants: (applicants: Applicant[]) => void;
  calculateScores: () => void;
  addToShortlist: (applicantId: string, reason: string, priority: "high" | "medium" | "low") => void;
  removeFromShortlist: (applicantId: string) => void;
  selectCandidate: (applicantId: string, position: string, reason: string, diversityFactor?: string) => void;
  unselectCandidate: (applicantId: string) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  updateSorting: (sorting: SortConfig) => void;
  clearSelection: () => void;
  calculateDiversityMetrics: () => void;
  
  // Utilities
  getApplicantById: (id: string) => Applicant | undefined;
  getApplicantScore: (id: string) => ApplicantScore | undefined;
  isShortlisted: (id: string) => boolean;
  isSelected: (id: string) => boolean;
  getShortlistCount: () => number;
  getSelectedCount: () => number;
}

const initialFilters: FilterState = {
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

const initialSorting: SortConfig = {
  key: "totalScore",
  direction: "desc",
};

export const useHiringStore = create<HiringState>()(
  devtools(
    (set, get) => ({
      // Initial State
      applicants: [],
      scores: {},
      shortlisted: {},
      selected: {},
      loading: false,
      error: null,
      filters: initialFilters,
      sorting: initialSorting,
      filteredApplicants: [],
      diversityMetrics: null,

      // Load applicants and calculate initial scores
      loadApplicants: (applicants: Applicant[]) => {
        console.log('Store: Loading', applicants.length, 'applicants');
        set({ applicants, loading: false, error: null });
        get().calculateScores();
        get().updateFilters({});
        console.log('Store: Loaded successfully, filtered applicants:', get().filteredApplicants.length);
      },

      // Calculate scoring algorithm for all applicants
      calculateScores: () => {
        const { applicants } = get();
        const scores: Record<string, ApplicantScore> = {};

        applicants.forEach((applicant) => {
          const score = calculateApplicantScore(applicant, applicants);
          scores[applicant.id] = score;
        });

        set({ scores });
      },

      // Shortlisting actions
      addToShortlist: (applicantId: string, reason: string, priority: "high" | "medium" | "low") => {
        const shortlisted = { ...get().shortlisted };
        shortlisted[applicantId] = {
          applicantId,
          shortlistedAt: new Date(),
          reason,
          priority,
        };
        set({ shortlisted });
      },

      removeFromShortlist: (applicantId: string) => {
        const shortlisted = { ...get().shortlisted };
        delete shortlisted[applicantId];
        set({ shortlisted });
      },

      // Selection actions
      selectCandidate: (applicantId: string, position: string, reason: string, diversityFactor?: string) => {
        const selected = { ...get().selected };
        selected[applicantId] = {
          applicantId,
          selectedAt: new Date(),
          position,
          reason,
          diversityFactor: diversityFactor as any,
        };
        set({ selected });
      },

      unselectCandidate: (applicantId: string) => {
        const selected = { ...get().selected };
        delete selected[applicantId];
        set({ selected });
      },

      clearSelection: () => {
        set({ selected: {} });
      },

      // Filter and sort management
      updateFilters: (newFilters: Partial<FilterState>) => {
        const filters = { ...get().filters, ...newFilters };
        const filteredApplicants = applyFiltersAndSorting(
          get().applicants,
          get().scores,
          filters,
          get().sorting,
          get().shortlisted,
          get().selected
        );
        
        set({ filters, filteredApplicants });
        get().calculateDiversityMetrics();
      },

      updateSorting: (sorting: SortConfig) => {
        const filteredApplicants = applyFiltersAndSorting(
          get().applicants,
          get().scores,
          get().filters,
          sorting,
          get().shortlisted,
          get().selected
        );
        
        set({ sorting, filteredApplicants });
      },

      // Calculate diversity metrics for current filtered set
      calculateDiversityMetrics: () => {
        const { filteredApplicants } = get();
        const diversityMetrics = calculateDiversityMetrics(filteredApplicants);
        set({ diversityMetrics });
      },

      // Utility functions
      getApplicantById: (id: string) => {
        return get().applicants.find(a => a.id === id);
      },

      getApplicantScore: (id: string) => {
        return get().scores[id];
      },

      isShortlisted: (id: string) => {
        return id in get().shortlisted;
      },

      isSelected: (id: string) => {
        return id in get().selected;
      },

      getShortlistCount: () => {
        return Object.keys(get().shortlisted).length;
      },

      getSelectedCount: () => {
        return Object.keys(get().selected).length;
      },
    }),
    { name: "hiring-store" }
  )
);

// Helper function to calculate applicant score
function calculateApplicantScore(applicant: Applicant, allApplicants: Applicant[]): ApplicantScore {
  const experienceScore = calculateExperienceScore(applicant.work_experiences);
  const educationScore = calculateEducationScore(applicant.education);
  const skillScore = calculateSkillScore(applicant.skills);
  const salaryScore = calculateSalaryScore(applicant.annual_salary_expectation);
  const diversityScore = calculateDiversityScore(applicant, allApplicants);
  
  const totalScore = Math.round(
    experienceScore * 0.3 +
    educationScore * 0.25 +
    skillScore * 0.2 +
    salaryScore * 0.15 +
    diversityScore * 0.1
  );

  return {
    applicantId: applicant.id,
    totalScore,
    experienceScore,
    educationScore,
    skillScore,
    diversityScore,
    salaryScore,
    scoredAt: new Date(),
  };
}

// Scoring helper functions
function calculateExperienceScore(experiences: Applicant["work_experiences"]): number {
  const uniqueCompanies = new Set(experiences.map(exp => exp.company)).size;
  const totalExperience = experiences.length;
  const seniorRoles = experiences.filter(exp => 
    exp.roleName.toLowerCase().includes("senior") ||
    exp.roleName.toLowerCase().includes("lead") ||
    exp.roleName.toLowerCase().includes("manager") ||
    exp.roleName.toLowerCase().includes("director")
  ).length;
  
  return Math.min(100, (totalExperience * 10) + (uniqueCompanies * 5) + (seniorRoles * 15));
}

function calculateEducationScore(education: Applicant["education"]): number {
  let score = 0;
  
  education.degrees.forEach(degree => {
    if (degree.isTop25) score += 30;
    else if (degree.isTop50) score += 20;
    else score += 10;
    
    if (degree.gpa.includes("3.5-3.9") || degree.gpa.includes("4.0")) score += 15;
    else if (degree.gpa.includes("3.0-3.4")) score += 10;
  });
  
  return Math.min(100, score);
}

function calculateSkillScore(skills: Applicant["skills"]): number {
  const techSkills = ["React", "Node.js", "Python", "JavaScript", "TypeScript", "Docker", "AWS"];
  const relevantSkills = skills.filter(skill => 
    techSkills.some(tech => skill.toLowerCase().includes(tech.toLowerCase()))
  ).length;
  
  return Math.min(100, skills.length * 5 + relevantSkills * 10);
}

function calculateSalaryScore(salary: Applicant["annual_salary_expectation"]): number {
  const fullTimeSalary = salary["full-time"];
  if (!fullTimeSalary) return 50;
  
  const amount = parseInt(fullTimeSalary.replace(/[\$,]/g, ""));
  if (amount < 50000) return 100;
  if (amount < 80000) return 80;
  if (amount < 120000) return 60;
  if (amount < 150000) return 40;
  return 20;
}

function calculateDiversityScore(applicant: Applicant, allApplicants: Applicant[]): number {
  let score = 0;
  
  // Location diversity
  const locationCount = allApplicants.filter(a => a.location === applicant.location).length;
  if (locationCount < allApplicants.length * 0.1) score += 30;
  
  // Education diversity
  const hasUniqueBackground = applicant.education.degrees.some(deg => 
    !deg.subject.toLowerCase().includes("computer") &&
    !deg.subject.toLowerCase().includes("engineering")
  );
  if (hasUniqueBackground) score += 20;
  
  return Math.min(100, score);
}

// Filter and sort helper function
function applyFiltersAndSorting(
  applicants: Applicant[],
  scores: Record<string, ApplicantScore>,
  filters: FilterState,
  sorting: SortConfig,
  shortlisted: Record<string, ShortlistedCandidate>,
  selected: Record<string, SelectedCandidate>
): Applicant[] {
  let filtered = applicants.filter(applicant => {
    // Search filter
    if (filters.search && !applicant.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (filters.locations.length && !filters.locations.includes(applicant.location)) {
      return false;
    }
    
    // Work availability filter
    if (filters.workAvailability.length && 
        !filters.workAvailability.some(wa => applicant.work_availability.includes(wa))) {
      return false;
    }
    
    // Experience filter
    if (applicant.work_experiences.length < filters.minExperience) {
      return false;
    }
    
    // Salary filter
    const salary = parseInt(applicant.annual_salary_expectation["full-time"]?.replace(/[\$,]/g, "") || "0");
    if (salary > filters.maxSalary) {
      return false;
    }
    
    // Shortlist filter
    if (filters.isShortlisted !== null) {
      const isShortlisted = applicant.id in shortlisted;
      if (filters.isShortlisted !== isShortlisted) {
        return false;
      }
    }
    
    // Selection filter
    if (filters.isSelected !== null) {
      const isSelected = applicant.id in selected;
      if (filters.isSelected !== isSelected) {
        return false;
      }
    }
    
    return true;
  });

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue: any, bValue: any;
    
    if (sorting.key === "totalScore") {
      aValue = scores[a.id]?.totalScore || 0;
      bValue = scores[b.id]?.totalScore || 0;
    } else {
      aValue = a[sorting.key as keyof Applicant];
      bValue = b[sorting.key as keyof Applicant];
    }
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sorting.direction === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sorting.direction === "asc" ? aValue - bValue : bValue - aValue;
  });
  
  return filtered;
}

// Diversity metrics helper
function calculateDiversityMetrics(applicants: Applicant[]): DiversityMetrics {
  const locations: Record<string, number> = {};
  const educationLevels: Record<string, number> = {};
  const experienceLevels: Record<string, number> = {};
  let topSchools = 0;
  let totalSalary = 0;

  applicants.forEach(applicant => {
    // Location diversity
    locations[applicant.location] = (locations[applicant.location] || 0) + 1;
    
    // Education diversity
    educationLevels[applicant.education.highest_level] = 
      (educationLevels[applicant.education.highest_level] || 0) + 1;
    
    // Experience diversity
    const expLevel = applicant.work_experiences.length > 5 ? "Senior" : 
                    applicant.work_experiences.length > 2 ? "Mid" : "Junior";
    experienceLevels[expLevel] = (experienceLevels[expLevel] || 0) + 1;
    
    // Top schools count
    if (applicant.education.degrees.some(d => d.isTop50 || d.isTop25)) {
      topSchools++;
    }
    
    // Average salary
    const salary = parseInt(applicant.annual_salary_expectation["full-time"]?.replace(/[\$,]/g, "") || "0");
    totalSalary += salary;
  });

  return {
    locations,
    educationLevels,
    experienceLevels,
    topSchools,
    averageSalary: applicants.length ? Math.round(totalSalary / applicants.length) : 0,
  };
}