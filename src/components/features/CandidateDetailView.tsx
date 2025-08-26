import React from 'react';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Badge, { ScoreBadge, StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { BriefcaseIcon, RocketIcon, BarChartIcon, CalendarIcon, StarIcon, BookmarkIcon, SparklesIcon, MapPinIcon, DollarSignIcon, GraduationCapIcon, ZapIcon, ClockIcon, TrophyIcon } from '../ui/Icons';
import type { Applicant, ApplicantScore } from '../../types/applicant.types';
import { formatSalary, formatDate, formatName, formatLocation, calculateExperienceYears } from '../../utils/formatting';
import { candidateManagementService } from '../../services/candidateManagement.service';
import { skillsCategorizationService } from '../../services/skillsCategorization.service';
import { scoreAnalysisService } from '../../services/scoreAnalysis.service';

interface CandidateDetailViewProps {
  applicant: Applicant;
  score?: ApplicantScore;
  isShortlisted?: boolean;
  isSelected?: boolean;
  onShortlist?: (applicantId: string) => void;
  onRemoveFromShortlist?: (applicantId: string) => void;
  onSelect?: (applicantId: string) => void;
  onClose?: () => void;
}

const CandidateDetailView: React.FC<CandidateDetailViewProps> = ({
  applicant,
  score,
  isShortlisted = false,
  isSelected = false,
  onShortlist,
  onRemoveFromShortlist,
  onSelect,
  onClose,
}) => {
  const handleShortlistToggle = () => {
    candidateManagementService.toggleShortlist(applicant.id, isShortlisted, {
      onShortlist,
      onRemoveFromShortlist
    });
  };

  const handleSelect = () => {
    candidateManagementService.selectCandidate(applicant.id, {
      onSelect
    });
  };

  // Get candidate status info for UI
  const statusInfo = candidateManagementService.getCandidateStatusInfo(isShortlisted, isSelected);
  
  // Categorize skills
  const categorizedSkills = skillsCategorizationService.categorizeSkills(applicant.skills);
  
  // Get score breakdown if score exists
  const scoreBreakdown = score ? scoreAnalysisService.createScoreBreakdown(score) : null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[var(--card)] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[var(--card)] border-b border-[var(--border)] p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--border)] rounded-xl flex items-center justify-center text-[var(--primary-foreground)] font-bold text-2xl shadow-lg">
                {formatName(applicant.name).charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">{formatName(applicant.name)}</h1>
                <div className="flex items-center space-x-4 mt-2 text-[var(--muted-foreground)]">
                  <span className="flex items-center space-x-1">
                    <MapPinIcon size={14} />
                    <span>{formatLocation(applicant.location)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 font-semibold text-[var(--secondary)]">
                    <span>{formatSalary(applicant.annual_salary_expectation["full-time"])}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {score && <ScoreBadge score={score.totalScore} animated={true} />}
              {isSelected && <StatusBadge status="selected" animated={true} />}
              {!isSelected && isShortlisted && <StatusBadge status="shortlisted" animated={true} />}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={<span>✕</span>}
              >
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="elevated" className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {applicant.work_experiences.length}
                </div>
                <div className="text-sm text-[var(--muted-foreground)]/80">Previous Roles</div>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {applicant.skills.length}
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">Skills</div>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {applicant.education.degrees.length}
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">Degrees</div>
              </CardContent>
            </Card>
          </div>

          {/* Experience */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BriefcaseIcon size={16} />
                <span>Work Experience</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] mb-4 font-medium">
                {calculateExperienceYears(applicant.work_experiences)}
              </p>
              <div className="space-y-4">
                {applicant.work_experiences.map((exp, idx) => (
                  <motion.div 
                    key={idx} 
                    className="border border-[var(--border)] rounded-lg p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <h4 className="font-semibold text-[var(--foreground)]">{exp.roleName}</h4>
                    <p className="text-[var(--primary)] font-medium">{exp.company}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCapIcon size={16} />
                <span>Education</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Highest Level: <span className="font-medium">{applicant.education.highest_level}</span>
              </p>
              <div className="space-y-3">
                {applicant.education.degrees.map((degree, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex items-center justify-between p-3 bg-[var(--accent)]/20 rounded-lg border border-[var(--accent)]/30"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div>
                      <span className="font-semibold text-[var(--foreground)]">{degree.degree}</span>
                      <span className="text-[var(--muted-foreground)]"> in </span>
                      <span className="font-medium text-[var(--primary)]">{degree.subject}</span>
                    </div>
                    {degree.isTop50 && (
                      <Badge variant="gradient" size="sm" glow={true}>
                        <TrophyIcon size={12} className="inline mr-1" /> Top {degree.isTop25 ? '25' : '50'}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ZapIcon size={16} />
                <span>Skills & Expertise</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categorizedSkills.map((skillData, idx) => {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                    >
                      <Badge 
                        variant={skillData.isTech ? "gradient" : "info"} 
                        size="sm"
                        glow={skillData.isTech}
                      >
                        {skillData.isTech && <RocketIcon size={14} className="mr-1" />}
                        {skillData.skill}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          {score && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChartIcon size={16} />
                  <span>Detailed Score Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scoreBreakdown?.map((item, idx) => {
                    const IconComponent = item.icon === 'briefcase' ? BriefcaseIcon : 
                                         item.icon === 'graduation-cap' ? GraduationCapIcon :
                                         item.icon === 'zap' ? ZapIcon :
                                         item.icon === 'dollar-sign' ? DollarSignIcon : BriefcaseIcon;
                    
                    return (
                      <motion.div 
                        key={item.label}
                        className="flex justify-between items-center p-4 border border-[var(--border)] rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        title={item.description}
                      >
                        <span className="text-[var(--foreground)] font-medium flex items-center space-x-2">
                          <IconComponent size={12} />
                          <span>{item.label}</span>
                        </span>
                        <ScoreBadge score={item.score} showLabel={false} animated={false} />
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <ClockIcon size={12} />
                  <span>Applied {formatDate(applicant.submitted_at, "relative")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon size={12} />
                  <span>Available for {applicant.work_availability.join(", ")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[var(--card)]/95 backdrop-blur-sm border-t border-[var(--border)] p-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              icon={<span>←</span>}
            >
              Back to List
            </Button>
            
            <div className="flex items-center space-x-3">
              {!isSelected && (
                <Button
                  variant={isShortlisted ? "secondary" : "primary"}
                  onClick={handleShortlistToggle}
                  icon={statusInfo.shortlistIcon === 'star' ? <StarIcon size={16} /> : <BookmarkIcon size={16} />}
                  disabled={!statusInfo.canShortlist}
                >
                  {statusInfo.shortlistButtonText}
                </Button>
              )}
              
              {statusInfo.canSelect && (
                <Button
                  variant="gradient"
                  onClick={handleSelect}
                  icon={<SparklesIcon size={16} />}
                >
                  {statusInfo.selectButtonText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CandidateDetailView;