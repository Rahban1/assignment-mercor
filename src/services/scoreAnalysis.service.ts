/**
 * Service for analyzing and managing candidate scores
 */

import type { ApplicantScore } from '../types/applicant.types';

export interface ScoreBreakdownItem {
  label: string;
  score: number;
  icon: string;
  description: string;
  weight: number;
}

export interface ScoreAnalysis {
  totalScore: number;
  breakdown: ScoreBreakdownItem[];
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  color: 'red' | 'yellow' | 'green';
  status: 'excellent' | 'good' | 'fair' | 'poor';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ScoreComparison {
  candidate: ApplicantScore;
  percentile: number;
  aboveAverage: boolean;
  topPerformer: boolean;
}

/**
 * Service for analyzing candidate scores and providing insights
 */
export class ScoreAnalysisService {
  private readonly scoreWeights = {
    experience: 0.3,
    education: 0.25,
    skills: 0.25,
    diversity: 0.1,
    salary: 0.1
  };

  /**
   * Creates detailed score breakdown for display
   */
  createScoreBreakdown(score: ApplicantScore): ScoreBreakdownItem[] {
    return [
      {
        label: 'Experience',
        score: score.experienceScore,
        icon: 'briefcase',
        description: 'Work experience relevance and quality',
        weight: this.scoreWeights.experience
      },
      {
        label: 'Education',
        score: score.educationScore,
        icon: 'graduation-cap',
        description: 'Educational background and achievements',
        weight: this.scoreWeights.education
      },
      {
        label: 'Skills',
        score: score.skillScore,
        icon: 'zap',
        description: 'Technical and soft skills alignment',
        weight: this.scoreWeights.skills
      },
      {
        label: 'Diversity',
        score: score.diversityScore,
        icon: 'users',
        description: 'Contribution to team diversity',
        weight: this.scoreWeights.diversity
      },
      {
        label: 'Salary Fit',
        score: score.salaryScore,
        icon: 'dollar-sign',
        description: 'Alignment with salary expectations',
        weight: this.scoreWeights.salary
      }
    ];
  }

  /**
   * Analyzes a candidate's score comprehensively
   */
  analyzeScore(score: ApplicantScore): ScoreAnalysis {
    const breakdown = this.createScoreBreakdown(score);
    const grade = this.calculateGrade(score.totalScore);
    const { color, status } = this.getScoreStatus(score.totalScore);
    const strengths = this.identifyStrengths(breakdown);
    const weaknesses = this.identifyWeaknesses(breakdown);
    const recommendations = this.generateRecommendations(breakdown, strengths);

    return {
      totalScore: score.totalScore,
      breakdown,
      grade,
      color,
      status,
      strengths,
      weaknesses,
      recommendations
    };
  }

  /**
   * Compares candidate scores against a pool of candidates
   */
  compareScores(candidateScore: ApplicantScore, allScores: ApplicantScore[]): ScoreComparison {
    const sortedScores = allScores
      .map(s => s.totalScore)
      .sort((a, b) => b - a);

    const candidateRank = sortedScores.indexOf(candidateScore.totalScore) + 1;
    const percentile = Math.round(((sortedScores.length - candidateRank + 1) / sortedScores.length) * 100);
    
    const average = sortedScores.reduce((a, b) => a + b, 0) / sortedScores.length;
    const aboveAverage = candidateScore.totalScore > average;
    const topPerformer = percentile >= 90;

    return {
      candidate: candidateScore,
      percentile,
      aboveAverage,
      topPerformer
    };
  }

  /**
   * Gets score trend analysis
   */
  getScoreTrend(scores: ApplicantScore[], applicantId: string): {
    scores: number[];
    trend: 'improving' | 'stable' | 'declining';
    changePercent: number;
  } {
    const candidateScores = scores
      .filter(s => s.applicantId === applicantId)
      .sort((a, b) => a.scoredAt.getTime() - b.scoredAt.getTime())
      .map(s => s.totalScore);

    if (candidateScores.length < 2) {
      return { scores: candidateScores, trend: 'stable', changePercent: 0 };
    }

    const first = candidateScores[0];
    const last = candidateScores[candidateScores.length - 1];
    const changePercent = ((last - first) / first) * 100;

    let trend: 'improving' | 'stable' | 'declining';
    if (Math.abs(changePercent) < 5) {
      trend = 'stable';
    } else if (changePercent > 0) {
      trend = 'improving';
    } else {
      trend = 'declining';
    }

    return { scores: candidateScores, trend, changePercent };
  }

  /**
   * Validates score consistency
   */
  validateScore(score: ApplicantScore): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check if total score is roughly the weighted sum of components
    const expectedTotal = Math.round(
      score.experienceScore * this.scoreWeights.experience +
      score.educationScore * this.scoreWeights.education +
      score.skillScore * this.scoreWeights.skills +
      score.diversityScore * this.scoreWeights.diversity +
      score.salaryScore * this.scoreWeights.salary
    );

    if (Math.abs(score.totalScore - expectedTotal) > 5) {
      issues.push(`Total score (${score.totalScore}) doesn't match weighted components (expected ~${expectedTotal})`);
    }

    // Check for valid score ranges
    const scores = [score.totalScore, score.experienceScore, score.educationScore, score.skillScore, score.diversityScore, score.salaryScore];
    scores.forEach((s, index) => {
      const labels = ['total', 'experience', 'education', 'skill', 'diversity', 'salary'];
      if (s < 0 || s > 100) {
        issues.push(`${labels[index]} score (${s}) is out of valid range (0-100)`);
      }
    });

    return { isValid: issues.length === 0, issues };
  }

  /**
   * Calculates letter grade from score
   */
  private calculateGrade(score: number): ScoreAnalysis['grade'] {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Gets color and status for score
   */
  private getScoreStatus(score: number): { color: 'red' | 'yellow' | 'green'; status: 'excellent' | 'good' | 'fair' | 'poor' } {
    if (score >= 80) return { color: 'green', status: 'excellent' };
    if (score >= 65) return { color: 'yellow', status: 'good' };
    if (score >= 50) return { color: 'yellow', status: 'fair' };
    return { color: 'red', status: 'poor' };
  }

  /**
   * Identifies candidate strengths based on scores
   */
  private identifyStrengths(breakdown: ScoreBreakdownItem[]): string[] {
    const strengths: string[] = [];
    const sorted = [...breakdown].sort((a, b) => b.score - a.score);

    // Top 2 scoring areas above 75
    sorted.slice(0, 2).forEach(item => {
      if (item.score >= 75) {
        strengths.push(`Strong ${item.label.toLowerCase()} (${item.score}/100)`);
      }
    });

    return strengths;
  }

  /**
   * Identifies areas for improvement
   */
  private identifyWeaknesses(breakdown: ScoreBreakdownItem[]): string[] {
    const weaknesses: string[] = [];

    breakdown.forEach(item => {
      if (item.score < 60) {
        weaknesses.push(`${item.label} needs improvement (${item.score}/100)`);
      }
    });

    return weaknesses;
  }

  /**
   * Generates recommendations based on analysis
   */
  private generateRecommendations(
    breakdown: ScoreBreakdownItem[], 
    strengths: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Leverage strengths
    if (strengths.length > 0) {
      recommendations.push('Consider highlighting top strengths during interviews');
    }

    // Address weaknesses
    breakdown.forEach(item => {
      if (item.score < 60) {
        switch (item.label.toLowerCase()) {
          case 'experience':
            recommendations.push('Consider additional screening for relevant experience');
            break;
          case 'education':
            recommendations.push('Evaluate practical skills over educational credentials');
            break;
          case 'skills':
            recommendations.push('Conduct technical assessment or skills interview');
            break;
          case 'salary fit':
            recommendations.push('Discuss salary expectations early in process');
            break;
        }
      }
    });

    return recommendations;
  }

  /**
   * Gets benchmark scores for comparison
   */
  getBenchmarkScores(): { excellent: number; good: number; fair: number } {
    return {
      excellent: 80,
      good: 65,
      fair: 50
    };
  }
}

// Export singleton instance
export const scoreAnalysisService = new ScoreAnalysisService();