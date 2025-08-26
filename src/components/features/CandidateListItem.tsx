import React from 'react';
import { motion } from 'framer-motion';
import Badge, { ScoreBadge, StatusBadge } from '../ui/Badge';
import type { Applicant, ApplicantScore } from '../../types/applicant.types';
import { formatSalary, formatName, formatLocation, calculateExperienceYears } from '../../utils/formatting';
import { skillsCategorizationService } from '../../services/skillsCategorization.service';

interface CandidateListItemProps {
  applicant: Applicant;
  score?: ApplicantScore;
  isShortlisted?: boolean;
  isSelected?: boolean;
  onClick?: (applicantId: string) => void;
  delay?: number;
}

const CandidateListItem: React.FC<CandidateListItemProps> = ({
  applicant,
  score,
  isShortlisted = false,
  isSelected = false,
  onClick,
  delay = 0,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(applicant.id);
    }
  };

  const topSkills = applicant.skills.slice(0, 3);
  const categorizedTopSkills = skillsCategorizationService.categorizeSkills(topSkills);

  return (
    <motion.div
      className="group bg-[var(--card)] border border-[var(--border)]/60 rounded-xl p-3 sm:p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:border-[var(--primary)] overflow-hidden min-h-[100px] sm:min-h-[120px] flex items-center"
      onClick={handleClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.25, 0, 1] }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full min-w-0 gap-3 sm:gap-0">
        {/* Left Section - Main Info */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-1 min-w-0">
          {/* Avatar & Name */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 sm:flex-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--border)] rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-semibold text-sm sm:text-lg shadow-lg flex-shrink-0">
              {formatName(applicant.name).charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                {formatName(applicant.name)}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-3 text-xs sm:text-sm text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <span className="text-xs">📍</span>
                  <span className="truncate">{formatLocation(applicant.location)}</span>
                </span>
                <span className="hidden sm:inline text-[var(--muted-foreground)]/50">•</span>
                <span className="flex items-center gap-1 font-medium text-[var(--secondary)]">
                  <span className="text-xs">💰</span>
                  <span className="truncate">{formatSalary(applicant.annual_salary_expectation["full-time"])}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="hidden md:block">
            <div className="text-sm text-[var(--muted-foreground)]">Experience</div>
            <div className="text-sm font-medium text-[var(--foreground)]">
              {calculateExperienceYears(applicant.work_experiences)}
            </div>
          </div>

          {/* Education */}
          <div className="hidden lg:block">
            <div className="text-sm text-[var(--muted-foreground)]">Education</div>
            <div className="text-sm font-medium text-[var(--foreground)]">
              {applicant.education.highest_level}
            </div>
          </div>

          {/* Skills Preview - Show on lg+ screens */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-wrap">
            {categorizedTopSkills.slice(0, 2).map((skillData, idx) => {
              return (
                <Badge 
                  key={idx} 
                  variant={skillData.isTech ? "gradient" : "info"} 
                  size="xs"
                  glow={skillData.isTech}
                >
                  {skillData.skill}
                </Badge>
              );
            })}
            {applicant.skills.length > 2 && (
              <Badge variant="secondary" size="xs">
                +{applicant.skills.length - 2}
              </Badge>
            )}
          </div>

        </div>

        {/* Right Section - Status & Score */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 self-start sm:self-center">
          {score && (
            <div className="text-right">
              <ScoreBadge score={score.totalScore} showLabel={false} animated={false} />
            </div>
          )}
          
          <div className="flex items-center gap-1 sm:gap-2">
            {isSelected && <StatusBadge status="selected" animated={false} showIcon={false} />}
            {!isSelected && isShortlisted && <StatusBadge status="shortlisted" animated={false} showIcon={false} />}
          </div>

          {/* Arrow indicator */}
          <motion.div 
            className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors"
            whileHover={{ x: 2 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>

        {/* Mobile Skills Preview - Show only on sm screens */}
        <div className="flex sm:hidden items-center gap-1 flex-wrap mt-2">
          {categorizedTopSkills.map((skillData, idx) => {
            return (
              <Badge 
                key={idx} 
                variant={skillData.isTech ? "gradient" : "info"} 
                size="xs"
                glow={skillData.isTech}
              >
                {skillData.skill}
              </Badge>
            );
          })}
          {applicant.skills.length > categorizedTopSkills.length && (
            <Badge variant="secondary" size="xs">
              +{applicant.skills.length - categorizedTopSkills.length}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateListItem;