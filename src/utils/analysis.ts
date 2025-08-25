import type { Applicant, ApplicantScore } from "../types/applicant.types";

/**
 * Advanced analysis utilities for candidate evaluation
 */

/**
 * Analyzes candidate pool for potential bias and recommendations
 */
export function analyzeBias(applicants: Applicant[], scores: Record<string, ApplicantScore>): BiasAnalysis {
  const locationBias = analyzeLocationBias(applicants, scores);
  const educationBias = analyzeEducationBias(applicants, scores);
  const skillsBias = analyzeSkillsBias(applicants, scores);
  
  const recommendations = [
    ...locationBias.recommendations,
    ...educationBias.recommendations,
    ...skillsBias.recommendations,
  ];

  return {
    overallRisk: calculateOverallBiasRisk([locationBias, educationBias, skillsBias]),
    locationBias,
    educationBias,
    skillsBias,
    recommendations: recommendations.slice(0, 5), // Top 5 recommendations
  };
}

export interface BiasAnalysis {
  overallRisk: "low" | "medium" | "high";
  locationBias: {
    risk: "low" | "medium" | "high";
    dominantLocations: string[];
    recommendations: string[];
  };
  educationBias: {
    risk: "low" | "medium" | "high";
    topSchoolsPercentage: number;
    recommendations: string[];
  };
  skillsBias: {
    risk: "low" | "medium" | "high";
    dominantSkills: string[];
    recommendations: string[];
  };
  recommendations: string[];
}

function analyzeLocationBias(applicants: Applicant[], scores: Record<string, ApplicantScore>) {
  const locationCounts: Record<string, number> = {};
  const locationScores: Record<string, number[]> = {};
  
  applicants.forEach(applicant => {
    const location = applicant.location;
    locationCounts[location] = (locationCounts[location] || 0) + 1;
    
    const score = scores[applicant.id]?.totalScore || 0;
    if (!locationScores[location]) locationScores[location] = [];
    locationScores[location].push(score);
  });
  
  const totalApplicants = applicants.length;
  const dominantLocations = Object.entries(locationCounts)
    .filter(([, count]) => count / totalApplicants > 0.3)
    .map(([location]) => location);
  
  const recommendations: string[] = [];
  if (dominantLocations.length > 0) {
    recommendations.push(`Consider more geographic diversity - ${dominantLocations.join(", ")} dominate the pool`);
  }
  
  const locationAverages = Object.entries(locationScores).map(([location, scores]) => ({
    location,
    average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    count: scores.length,
  }));
  
  const scoreVariance = Math.max(...locationAverages.map(l => l.average)) - 
                       Math.min(...locationAverages.map(l => l.average));
  
  if (scoreVariance > 30) {
    recommendations.push("Significant score variance by location detected - review scoring criteria");
  }
  
  const risk = dominantLocations.length > 1 ? "high" : 
               dominantLocations.length === 1 ? "medium" : "low";
  
  return { risk, dominantLocations, recommendations };
}

function analyzeEducationBias(applicants: Applicant[], scores: Record<string, ApplicantScore>) {
  const topSchoolCandidates = applicants.filter(a => 
    a.education.degrees.some(d => d.isTop25 || d.isTop50)
  );
  
  const topSchoolsPercentage = (topSchoolCandidates.length / applicants.length) * 100;
  
  const recommendations: string[] = [];
  if (topSchoolsPercentage > 70) {
    recommendations.push("Consider candidates from a wider range of educational institutions");
  }
  
  const topSchoolScores = topSchoolCandidates.map(a => scores[a.id]?.totalScore || 0);
  const otherScores = applicants
    .filter(a => !topSchoolCandidates.includes(a))
    .map(a => scores[a.id]?.totalScore || 0);
  
  if (topSchoolScores.length > 0 && otherScores.length > 0) {
    const topAvg = topSchoolScores.reduce((sum, score) => sum + score, 0) / topSchoolScores.length;
    const otherAvg = otherScores.reduce((sum, score) => sum + score, 0) / otherScores.length;
    
    if (topAvg - otherAvg > 20) {
      recommendations.push("Review if scoring criteria may favor prestigious school credentials");
    }
  }
  
  const risk = topSchoolsPercentage > 80 ? "high" :
               topSchoolsPercentage > 60 ? "medium" : "low";
  
  return { risk, topSchoolsPercentage, recommendations };
}

function analyzeSkillsBias(applicants: Applicant[], scores: Record<string, ApplicantScore>) {
  const skillCounts: Record<string, number> = {};
  
  applicants.forEach(applicant => {
    applicant.skills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase();
      skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
    });
  });
  
  const totalApplicants = applicants.length;
  const dominantSkills = Object.entries(skillCounts)
    .filter(([, count]) => count / totalApplicants > 0.5)
    .map(([skill]) => skill)
    .slice(0, 3);
  
  const recommendations: string[] = [];
  if (dominantSkills.length > 2) {
    recommendations.push(`Skill pool may be too homogeneous - ${dominantSkills.join(", ")} are over-represented`);
  }
  
  const techSkillsOnly = applicants.filter(a => 
    a.skills.every(skill => 
      ["javascript", "react", "python", "java", "node", "docker", "aws", "git"]
        .some(tech => skill.toLowerCase().includes(tech))
    )
  ).length;
  
  if (techSkillsOnly / totalApplicants > 0.8) {
    recommendations.push("Consider candidates with complementary soft skills and domain expertise");
  }
  
  const risk = dominantSkills.length > 2 ? "high" :
               dominantSkills.length > 1 ? "medium" : "low";
  
  return { risk, dominantSkills, recommendations };
}

function calculateOverallBiasRisk(analyses: Array<{ risk: "low" | "medium" | "high" }>): "low" | "medium" | "high" {
  const riskScores = analyses.map(a => a.risk === "high" ? 3 : a.risk === "medium" ? 2 : 1);
  const avgRisk = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
  
  return avgRisk >= 2.5 ? "high" : avgRisk >= 1.5 ? "medium" : "low";
}

/**
 * Analyzes team composition and suggests optimal diversity mix
 */
export function analyzeTeamComposition(
  selectedCandidates: Applicant[], 
  maxTeamSize: number = 5
): TeamCompositionAnalysis {
  const skills = analyzeTeamSkills(selectedCandidates);
  const experience = analyzeTeamExperience(selectedCandidates);
  const diversity = analyzeTeamDiversity(selectedCandidates);
  const gaps = identifyTeamGaps(selectedCandidates, maxTeamSize);
  
  return {
    currentSize: selectedCandidates.length,
    maxSize: maxTeamSize,
    skills,
    experience,
    diversity,
    gaps,
    overallScore: calculateTeamScore(skills, experience, diversity),
    recommendations: generateTeamRecommendations(gaps, selectedCandidates.length, maxTeamSize),
  };
}

export interface TeamCompositionAnalysis {
  currentSize: number;
  maxSize: number;
  skills: {
    coverage: number; // 0-100
    overlaps: string[];
    missing: string[];
  };
  experience: {
    averageYears: number;
    distribution: Record<"junior" | "mid" | "senior", number>;
  };
  diversity: {
    locationSpread: number;
    educationSpread: number;
    skillSpread: number;
  };
  gaps: {
    skillGaps: string[];
    experienceGaps: string[];
    diversityGaps: string[];
  };
  overallScore: number; // 0-100
  recommendations: string[];
}

function analyzeTeamSkills(candidates: Applicant[]) {
  const allSkills = new Set<string>();
  const skillCounts: Record<string, number> = {};
  
  candidates.forEach(candidate => {
    candidate.skills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase();
      allSkills.add(normalizedSkill);
      skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
    });
  });
  
  const essentialSkills = ["javascript", "react", "node", "python", "sql", "aws", "git"];
  const coveredEssential = essentialSkills.filter(skill => allSkills.has(skill));
  const coverage = (coveredEssential.length / essentialSkills.length) * 100;
  
  const overlaps = Object.entries(skillCounts)
    .filter(([, count]) => count > Math.ceil(candidates.length * 0.6))
    .map(([skill]) => skill);
  
  const missing = essentialSkills.filter(skill => !allSkills.has(skill));
  
  return { coverage, overlaps, missing };
}

function analyzeTeamExperience(candidates: Applicant[]) {
  const experienceLevels = candidates.map(candidate => {
    const roleCount = candidate.work_experiences.length;
    if (roleCount <= 2) return "junior";
    if (roleCount <= 5) return "mid";
    return "senior";
  });
  
  const distribution = {
    junior: experienceLevels.filter(level => level === "junior").length,
    mid: experienceLevels.filter(level => level === "mid").length,
    senior: experienceLevels.filter(level => level === "senior").length,
  };
  
  const averageYears = candidates.reduce((sum, candidate) => 
    sum + candidate.work_experiences.length, 0) / candidates.length;
  
  return { averageYears, distribution };
}

function analyzeTeamDiversity(candidates: Applicant[]) {
  const locations = new Set(candidates.map(c => c.location)).size;
  const educationLevels = new Set(candidates.map(c => c.education.highest_level)).size;
  const allSkills = new Set<string>();
  candidates.forEach(c => c.skills.forEach(s => allSkills.add(s.toLowerCase())));
  
  return {
    locationSpread: locations,
    educationSpread: educationLevels,
    skillSpread: allSkills.size,
  };
}

function identifyTeamGaps(candidates: Applicant[], maxSize: number) {
  const currentSkills = new Set<string>();
  candidates.forEach(c => c.skills.forEach(s => currentSkills.add(s.toLowerCase())));
  
  const desiredSkills = ["leadership", "project management", "ui/ux", "devops", "data analysis"];
  const skillGaps = desiredSkills.filter(skill => 
    !Array.from(currentSkills).some(s => s.includes(skill.replace("/", "")))
  );
  
  const experienceDistribution = analyzeTeamExperience(candidates).distribution;
  const experienceGaps: string[] = [];
  
  if (experienceDistribution.senior === 0 && candidates.length > 2) {
    experienceGaps.push("senior leadership");
  }
  if (experienceDistribution.junior === 0 && candidates.length > 3) {
    experienceGaps.push("junior talent for mentoring");
  }
  
  const diversity = analyzeTeamDiversity(candidates);
  const diversityGaps: string[] = [];
  
  if (diversity.locationSpread < Math.min(3, candidates.length)) {
    diversityGaps.push("geographic diversity");
  }
  if (diversity.educationSpread < 2 && candidates.length > 2) {
    diversityGaps.push("educational background diversity");
  }
  
  return { skillGaps, experienceGaps, diversityGaps };
}

function calculateTeamScore(skills: any, experience: any, diversity: any): number {
  const skillsScore = Math.min(100, skills.coverage + (skills.overlaps.length > 2 ? -10 : 0));
  const experienceScore = experience.distribution.senior > 0 && experience.distribution.mid > 0 ? 100 : 70;
  const diversityScore = Math.min(100, (diversity.locationSpread * 20) + (diversity.educationSpread * 15));
  
  return Math.round((skillsScore * 0.4 + experienceScore * 0.3 + diversityScore * 0.3));
}

function generateTeamRecommendations(
  gaps: { skillGaps: string[]; experienceGaps: string[]; diversityGaps: string[] },
  currentSize: number,
  maxSize: number
): string[] {
  const recommendations: string[] = [];
  
  if (currentSize < maxSize) {
    if (gaps.skillGaps.length > 0) {
      recommendations.push(`Consider adding candidates with: ${gaps.skillGaps.slice(0, 3).join(", ")}`);
    }
    
    if (gaps.experienceGaps.length > 0) {
      recommendations.push(`Team needs: ${gaps.experienceGaps.join(", ")}`);
    }
    
    if (gaps.diversityGaps.length > 0) {
      recommendations.push(`Improve: ${gaps.diversityGaps.join(", ")}`);
    }
  }
  
  if (currentSize === maxSize) {
    recommendations.push("Team is at capacity - consider if current composition meets all requirements");
  }
  
  return recommendations.slice(0, 4);
}

/**
 * Predicts hiring success based on candidate profile patterns
 */
export function predictHiringSuccess(candidate: Applicant, score: ApplicantScore): {
  successProbability: number;
  confidenceLevel: "low" | "medium" | "high";
  factors: Array<{ factor: string; impact: "positive" | "negative"; weight: number }>;
} {
  const factors: Array<{ factor: string; impact: "positive" | "negative"; weight: number }> = [];
  
  // Experience factors
  if (candidate.work_experiences.length > 3) {
    factors.push({ factor: "Strong work history", impact: "positive", weight: 0.2 });
  } else if (candidate.work_experiences.length === 0) {
    factors.push({ factor: "No work experience", impact: "negative", weight: 0.15 });
  }
  
  // Education factors
  if (candidate.education.degrees.some(d => d.isTop25)) {
    factors.push({ factor: "Top-tier education", impact: "positive", weight: 0.15 });
  }
  
  // Skills factors
  if (candidate.skills.length > 5) {
    factors.push({ factor: "Diverse skill set", impact: "positive", weight: 0.1 });
  }
  
  // Score factors
  if (score.totalScore > 80) {
    factors.push({ factor: "High overall score", impact: "positive", weight: 0.25 });
  } else if (score.totalScore < 50) {
    factors.push({ factor: "Low overall score", impact: "negative", weight: 0.2 });
  }
  
  const positiveWeight = factors
    .filter(f => f.impact === "positive")
    .reduce((sum, f) => sum + f.weight, 0);
    
  const negativeWeight = factors
    .filter(f => f.impact === "negative")
    .reduce((sum, f) => sum + f.weight, 0);
  
  const successProbability = Math.min(100, Math.max(0, 
    (positiveWeight * 100) - (negativeWeight * 50) + 50
  ));
  
  const confidenceLevel = factors.length > 3 ? "high" : 
                         factors.length > 1 ? "medium" : "low";
  
  return { successProbability, confidenceLevel, factors };
}