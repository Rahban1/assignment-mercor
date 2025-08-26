import React from 'react';
import { motion } from 'framer-motion';
import Badge, { ScoreBadge, StatusBadge } from '../ui/Badge';
import type { Applicant, ApplicantScore } from '../../types/applicant.types';
import { formatSalary, formatName, formatLocation, calculateExperienceYears } from '../../utils/formatting';

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
  const remainingSkillsCount = Math.max(0, applicant.skills.length - topSkills.length);

  return (
    <motion.div
      className="group bg-[var(--card)] border border-[var(--border)]/60 rounded-xl p-6 cursor-pointer hover-lift hover-glow transition-all duration-300 hover:border-[var(--primary)]"
      onClick={handleClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.25, 0, 1] }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Main Info */}
        <div className="flex items-center space-x-6 flex-1">
          {/* Avatar & Name */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--border)] rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-semibold text-lg shadow-lg">
              {formatName(applicant.name).charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {formatName(applicant.name)}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-[var(--muted-foreground)]">
                <span className="flex items-center space-x-1">
                  <span className="text-xs">📍</span>
                  <span>{formatLocation(applicant.location)}</span>
                </span>
                <span className="text-[var(--muted-foreground)]/50">•</span>
                <span className="flex items-center space-x-1 font-medium text-[var(--secondary)]">
                  <span className="text-xs">💰</span>
                  <span>{formatSalary(applicant.annual_salary_expectation["full-time"])}</span>
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

          {/* Skills Preview */}
          <div className="hidden xl:flex items-center space-x-2">
            {topSkills.map((skill, idx) => {
              const isTechSkill = ['React', 'JavaScript', 'Python', 'Node', 'Docker', 'AWS']
                .some(tech => skill.toLowerCase().includes(tech.toLowerCase()));
              
              return (
                <Badge 
                  key={idx} 
                  variant={isTechSkill ? "gradient" : "info"} 
                  size="xs"
                  glow={isTechSkill}
                >
                  {skill}
                </Badge>
              );
            })}
            {remainingSkillsCount > 0 && (
              <Badge variant="secondary" size="xs">
                +{remainingSkillsCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Right Section - Status & Score */}
        <div className="flex items-center space-x-4">
          {score && (
            <div className="text-right">
              <ScoreBadge score={score.totalScore} showLabel={false} animated={false} />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {isSelected && <StatusBadge status="selected" animated={false} showIcon={false} />}
            {!isSelected && isShortlisted && <StatusBadge status="shortlisted" animated={false} showIcon={false} />}
          </div>

          {/* Arrow indicator */}
          <motion.div 
            className="text-slate-400 group-hover:text-blue-500 transition-colors"
            whileHover={{ x: 2 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateListItem;