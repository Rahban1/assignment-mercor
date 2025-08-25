import type { 
  Applicant, 
  ApplicantScore, 
  ShortlistedCandidate, 
  SelectedCandidate,
  DiversityMetrics 
} from "../types/applicant.types";
import { formatSalary, formatDate, formatName, formatPhone } from "./formatting";

/**
 * Export utilities for generating reports and data exports
 */

/**
 * Exports applicant data to CSV format
 */
export function exportApplicantsToCSV(
  applicants: Applicant[],
  scores?: Record<string, ApplicantScore>,
  shortlisted?: Record<string, ShortlistedCandidate>,
  selected?: Record<string, SelectedCandidate>
): string {
  const headers = [
    "ID",
    "Name", 
    "Email",
    "Phone",
    "Location",
    "Submitted At",
    "Work Availability",
    "Salary Expectation (Full-time)",
    "Total Experience",
    "Highest Education",
    "Skills Count",
    "Top Skills",
    "Total Score",
    "Experience Score", 
    "Education Score",
    "Skill Score",
    "Shortlisted",
    "Selected",
  ];

  const rows = applicants.map(applicant => {
    const score = scores?.[applicant.id];
    const isShortlisted = shortlisted?.[applicant.id] ? "Yes" : "No";
    const isSelected = selected?.[applicant.id] ? "Yes" : "No";
    const topSkills = applicant.skills.slice(0, 3).join("; ");
    
    return [
      applicant.id,
      formatName(applicant.name),
      applicant.email,
      formatPhone(applicant.phone),
      applicant.location,
      formatDate(applicant.submitted_at),
      applicant.work_availability.join("; "),
      formatSalary(applicant.annual_salary_expectation["full-time"]),
      applicant.work_experiences.length.toString(),
      applicant.education.highest_level,
      applicant.skills.length.toString(),
      topSkills,
      score?.totalScore.toString() || "0",
      score?.experienceScore.toString() || "0",
      score?.educationScore.toString() || "0",
      score?.skillScore.toString() || "0",
      isShortlisted,
      isSelected,
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\\n");

  return csvContent;
}

/**
 * Generates a detailed hiring report
 */
export function generateHiringReport(
  applicants: Applicant[],
  scores: Record<string, ApplicantScore>,
  shortlisted: Record<string, ShortlistedCandidate>,
  selected: Record<string, SelectedCandidate>,
  diversityMetrics: DiversityMetrics
): HiringReport {
  const shortlistedApplicants = applicants.filter(a => a.id in shortlisted);
  const selectedApplicants = applicants.filter(a => a.id in selected);
  
  return {
    summary: {
      totalApplicants: applicants.length,
      shortlistedCount: shortlistedApplicants.length,
      selectedCount: selectedApplicants.length,
      averageScore: calculateAverageScore(applicants, scores),
      generatedAt: new Date(),
    },
    topCandidates: getTopCandidates(applicants, scores, 10),
    selectedCandidates: selectedApplicants.map(applicant => ({
      applicant,
      score: scores[applicant.id],
      selection: selected[applicant.id],
    })),
    diversityAnalysis: analyzeDiversity(selectedApplicants, diversityMetrics),
    skillsAnalysis: analyzeSkills(selectedApplicants),
    salaryAnalysis: analyzeSalary(selectedApplicants),
    locationAnalysis: analyzeLocations(selectedApplicants),
  };
}

export interface HiringReport {
  summary: {
    totalApplicants: number;
    shortlistedCount: number;
    selectedCount: number;
    averageScore: number;
    generatedAt: Date;
  };
  topCandidates: Array<{
    applicant: Applicant;
    score: ApplicantScore;
    rank: number;
  }>;
  selectedCandidates: Array<{
    applicant: Applicant;
    score: ApplicantScore;
    selection: SelectedCandidate;
  }>;
  diversityAnalysis: {
    locationDiversity: number;
    educationDiversity: number;
    skillsDiversity: number;
    recommendations: string[];
  };
  skillsAnalysis: {
    mostCommonSkills: Array<{ skill: string; count: number }>;
    techSkillsCount: number;
    averageSkillsPerCandidate: number;
  };
  salaryAnalysis: {
    averageSalary: number;
    medianSalary: number;
    salaryRange: { min: number; max: number };
  };
  locationAnalysis: {
    locations: Record<string, number>;
    uniqueLocations: number;
  };
}

function calculateAverageScore(applicants: Applicant[], scores: Record<string, ApplicantScore>): number {
  const validScores = applicants
    .map(a => scores[a.id]?.totalScore)
    .filter(score => score !== undefined);
    
  return validScores.length > 0 
    ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
    : 0;
}

function getTopCandidates(
  applicants: Applicant[], 
  scores: Record<string, ApplicantScore>, 
  count: number
): Array<{ applicant: Applicant; score: ApplicantScore; rank: number }> {
  return applicants
    .map(applicant => ({
      applicant,
      score: scores[applicant.id],
    }))
    .filter(item => item.score)
    .sort((a, b) => b.score.totalScore - a.score.totalScore)
    .slice(0, count)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}

function analyzeDiversity(candidates: Applicant[], metrics: DiversityMetrics) {
  const locationCount = Object.keys(metrics.locations).length;
  const educationCount = Object.keys(metrics.educationLevels).length;
  
  const recommendations: string[] = [];
  
  if (locationCount < 3) {
    recommendations.push("Consider candidates from more diverse locations");
  }
  
  if (educationCount < 2) {
    recommendations.push("Consider candidates with different educational backgrounds");
  }
  
  const techHeavy = candidates.every(c => 
    c.skills.some(skill => 
      ["javascript", "react", "python", "java"].some(tech => 
        skill.toLowerCase().includes(tech)
      )
    )
  );
  
  if (techHeavy) {
    recommendations.push("Consider candidates with diverse skill sets beyond core tech");
  }

  return {
    locationDiversity: locationCount,
    educationDiversity: educationCount,
    skillsDiversity: calculateSkillsDiversity(candidates),
    recommendations,
  };
}

function calculateSkillsDiversity(candidates: Applicant[]): number {
  const allSkills = new Set<string>();
  candidates.forEach(c => c.skills.forEach(s => allSkills.add(s.toLowerCase())));
  return allSkills.size;
}

function analyzeSkills(candidates: Applicant[]) {
  const skillCounts: Record<string, number> = {};
  let totalSkills = 0;
  let techSkillsCount = 0;
  
  const techSkills = ["javascript", "react", "python", "java", "node", "docker", "aws"];
  
  candidates.forEach(candidate => {
    totalSkills += candidate.skills.length;
    
    candidate.skills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase();
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      
      if (techSkills.some(tech => normalizedSkill.includes(tech))) {
        techSkillsCount++;
      }
    });
  });
  
  const mostCommonSkills = Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));
  
  return {
    mostCommonSkills,
    techSkillsCount,
    averageSkillsPerCandidate: candidates.length > 0 ? Math.round(totalSkills / candidates.length) : 0,
  };
}

function analyzeSalary(candidates: Applicant[]) {
  const salaries = candidates
    .map(c => parseInt(c.annual_salary_expectation["full-time"]?.replace(/[\$,]/g, "") || "0"))
    .filter(salary => salary > 0)
    .sort((a, b) => a - b);
  
  const averageSalary = salaries.length > 0 
    ? Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length)
    : 0;
  
  const medianSalary = salaries.length > 0
    ? salaries[Math.floor(salaries.length / 2)]
    : 0;
  
  const salaryRange = salaries.length > 0
    ? { min: salaries[0], max: salaries[salaries.length - 1] }
    : { min: 0, max: 0 };
  
  return { averageSalary, medianSalary, salaryRange };
}

function analyzeLocations(candidates: Applicant[]) {
  const locations: Record<string, number> = {};
  
  candidates.forEach(candidate => {
    locations[candidate.location] = (locations[candidate.location] || 0) + 1;
  });
  
  return {
    locations,
    uniqueLocations: Object.keys(locations).length,
  };
}

/**
 * Downloads data as a file
 */
export function downloadAsFile(content: string, filename: string, contentType: string = "text/csv") {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Exports hiring report as JSON
 */
export function exportReportAsJSON(report: HiringReport): string {
  return JSON.stringify(report, null, 2);
}