import React from 'react';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Badge, { ScoreBadge, StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { BriefcaseIcon, RocketIcon, BarChartIcon, CalendarIcon, EyeIcon, StarIcon, BookmarkIcon, SparklesIcon, MapPinIcon, DollarSignIcon, GraduationCapIcon, ZapIcon, ClockIcon, TrophyIcon } from '../ui/Icons';
import type { Applicant, ApplicantScore } from '../../types/applicant.types';
import { formatSalary, formatDate, formatName, formatLocation, calculateExperienceYears } from '../../utils/formatting';

interface CandidateCardProps {
  applicant: Applicant;
  score?: ApplicantScore;
  isShortlisted?: boolean;
  isSelected?: boolean;
  onShortlist?: (applicantId: string) => void;
  onRemoveFromShortlist?: (applicantId: string) => void;
  onSelect?: (applicantId: string) => void;
  onViewDetails?: (applicantId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  applicant,
  score,
  isShortlisted = false,
  isSelected = false,
  onShortlist,
  onRemoveFromShortlist,
  onSelect,
  onViewDetails,
  showActions = true,
  compact = false,
}) => {
  const handleShortlistToggle = () => {
    if (isShortlisted && onRemoveFromShortlist) {
      onRemoveFromShortlist(applicant.id);
    } else if (!isShortlisted && onShortlist) {
      onShortlist(applicant.id);
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(applicant.id);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(applicant.id);
    }
  };

  const topSkills = applicant.skills.slice(0, compact ? 3 : 5);
  const remainingSkillsCount = Math.max(0, applicant.skills.length - topSkills.length);

  return (
    <Card 
      variant="elevated" 
      className="group hover-lift hover-glow transition-all duration-300" 
      interactive={true}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle 
              className="text-xl group-hover:text-blue-600 transition-colors duration-200" 
              gradient={false}
            >
              {formatName(applicant.name)}
            </CardTitle>
            <motion.div 
              className="flex items-center space-x-4 mt-3 text-sm text-slate-600"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="flex items-center space-x-1">
                <MapPinIcon size={14} />
                <span>{formatLocation(applicant.location)}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center space-x-1 font-medium text-emerald-600">
                <DollarSignIcon size={14} />
                <span>{formatSalary(applicant.annual_salary_expectation["full-time"])}</span>
              </span>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            {score && <ScoreBadge score={score.totalScore} animated={true} />}
            {isSelected && <StatusBadge status="selected" animated={true} />}
            {!isSelected && isShortlisted && <StatusBadge status="shortlisted" animated={true} />}
          </motion.div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Experience Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
            <BriefcaseIcon size={16} />
            <span>Experience</span>
          </h4>
          <p className="text-sm text-slate-600 mb-3 font-medium">
            {calculateExperienceYears(applicant.work_experiences)}
          </p>
          {!compact && applicant.work_experiences.length > 0 && (
            <div className="space-y-2">
              {applicant.work_experiences.slice(0, 2).map((exp, idx) => (
                <motion.div 
                  key={idx} 
                  className="text-sm bg-slate-50 rounded-lg p-3 border border-slate-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                >
                  <span className="font-semibold text-slate-900">{exp.roleName}</span>
                  <span className="text-slate-600"> at </span>
                  <span className="font-medium text-blue-600">{exp.company}</span>
                </motion.div>
              ))}
              {applicant.work_experiences.length > 2 && (
                <motion.p 
                  className="text-sm text-slate-500 font-medium pl-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  +{applicant.work_experiences.length - 2} more roles
                </motion.p>
              )}
            </div>
          )}
        </motion.div>

        {/* Education Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
            <GraduationCapIcon size={16} />
            <span>Education</span>
          </h4>
          <p className="text-sm text-slate-600 font-medium mb-2">{applicant.education.highest_level}</p>
          {!compact && applicant.education.degrees.length > 0 && (
            <motion.div 
              className="mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {applicant.education.degrees.slice(0, 1).map((degree, idx) => (
                <div key={idx} className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900">
                      <span className="font-semibold">{degree.degree}</span>
                      <span className="text-slate-600"> in </span>
                      <span className="font-medium text-blue-600">{degree.subject}</span>
                    </span>
                    {degree.isTop50 && (
                      <Badge variant="gradient" size="xs" animated={true} glow={true}>
                        <TrophyIcon size={12} className="mr-1" /> Top {degree.isTop25 ? '25' : '50'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Skills Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
            <ZapIcon size={16} />
            <span>Skills</span>
          </h4>
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {topSkills.map((skill, idx) => {
              const isTechSkill = ['React', 'JavaScript', 'Python', 'Node', 'Docker', 'AWS']
                .some(tech => skill.toLowerCase().includes(tech.toLowerCase()));
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + (idx * 0.05) }}
                >
                  <Badge 
                    variant={isTechSkill ? "gradient" : "info"} 
                    size="sm"
                    animated={true}
                    glow={isTechSkill}
                  >
                    {isTechSkill && <RocketIcon size={14} className="mr-1" />}
                    {skill}
                  </Badge>
                </motion.div>
              );
            })}
            {remainingSkillsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Badge variant="secondary" size="sm" animated={true}>
                  +{remainingSkillsCount} more
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Score Breakdown */}
        {score && !compact && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
              <BarChartIcon size={16} />
              <span>Score Breakdown</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Experience', score: score.experienceScore, icon: <BriefcaseIcon size={12} /> },
                { label: 'Education', score: score.educationScore, icon: <GraduationCapIcon size={12} /> },
                { label: 'Skills', score: score.skillScore, icon: <ZapIcon size={12} /> },
                { label: 'Salary', score: score.salaryScore, icon: <DollarSignIcon size={12} /> }
              ].map((item, idx) => (
                <motion.div 
                  key={item.label}
                  className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.05) }}
                >
                  <span className="text-slate-600 flex items-center space-x-1">
                    {item.icon}
                    <span className="font-medium">{item.label}:</span>
                  </span>
                  <Badge 
                    variant={item.score >= 80 ? "success" : item.score >= 60 ? "warning" : "danger"} 
                    size="xs"
                    animated={true}
                  >
                    {item.score}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div 
          className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <ClockIcon size={12} />
              <span>Applied {formatDate(applicant.submitted_at, "relative")}</span>
            </span>
            <span className="flex items-center space-x-1 font-medium">
              <CalendarIcon size={12} />
              <span>Available for {applicant.work_availability.join(", ")}</span>
            </span>
          </div>
        </motion.div>
      </CardContent>

      {showActions && (
        <CardFooter>
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDetails}
                icon={<EyeIcon size={16} />}
                iconPosition="left"
              >
                View Details
              </Button>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              {!isSelected && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isShortlisted ? "secondary" : "primary"}
                    size="sm"
                    onClick={handleShortlistToggle}
                    icon={isShortlisted ? <StarIcon size={16} /> : <BookmarkIcon size={16} />}
                    iconPosition="left"
                  >
                    {isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
                  </Button>
                </motion.div>
              )}
              
              {isShortlisted && !isSelected && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={handleSelect}
                    icon={<SparklesIcon size={16} />}
                    iconPosition="left"
                  >
                    Select for Team
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CandidateCard;