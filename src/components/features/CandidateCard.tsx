import React from 'react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Badge, { ScoreBadge, StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
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
    <Card variant="elevated" className="hover:shadow-xl transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{formatName(applicant.name)}</CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>{formatLocation(applicant.location)}</span>
              <span>•</span>
              <span>{formatSalary(applicant.annual_salary_expectation["full-time"])}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {score && <ScoreBadge score={score.totalScore} />}
            {isSelected && <StatusBadge status="selected" />}
            {!isSelected && isShortlisted && <StatusBadge status="shortlisted" />}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Experience Section */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
          <p className="text-sm text-gray-600 mb-2">
            {calculateExperienceYears(applicant.work_experiences)}
          </p>
          {!compact && applicant.work_experiences.length > 0 && (
            <div className="space-y-1">
              {applicant.work_experiences.slice(0, 2).map((exp, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium">{exp.roleName}</span>
                  <span className="text-gray-500"> at {exp.company}</span>
                </div>
              ))}
              {applicant.work_experiences.length > 2 && (
                <p className="text-sm text-gray-500">
                  +{applicant.work_experiences.length - 2} more roles
                </p>
              )}
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Education</h4>
          <p className="text-sm text-gray-600">{applicant.education.highest_level}</p>
          {!compact && applicant.education.degrees.length > 0 && (
            <div className="mt-1">
              {applicant.education.degrees.slice(0, 1).map((degree, idx) => (
                <div key={idx} className="text-sm text-gray-600">
                  {degree.degree} in {degree.subject}
                  {degree.isTop50 && (
                    <Badge variant="info" size="sm" className="ml-2">
                      Top {degree.isTop25 ? '25' : '50'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {topSkills.map((skill, idx) => {
              const isTechSkill = ['React', 'JavaScript', 'Python', 'Node', 'Docker', 'AWS']
                .some(tech => skill.toLowerCase().includes(tech.toLowerCase()));
              
              return (
                <Badge 
                  key={idx} 
                  variant={isTechSkill ? "info" : "default"} 
                  size="sm"
                >
                  {skill}
                </Badge>
              );
            })}
            {remainingSkillsCount > 0 && (
              <Badge variant="secondary" size="sm">
                +{remainingSkillsCount} more
              </Badge>
            )}
          </div>
        </div>

        {/* Score Breakdown */}
        {score && !compact && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Score Breakdown</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <Badge variant="default" size="sm">{score.experienceScore}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Education:</span>
                <Badge variant="default" size="sm">{score.educationScore}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Skills:</span>
                <Badge variant="default" size="sm">{score.skillScore}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salary:</span>
                <Badge variant="default" size="sm">{score.salaryScore}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-gray-500">
          Applied {formatDate(applicant.submitted_at, "relative")} • 
          Available for {applicant.work_availability.join(", ")}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isSelected && (
                <Button
                  variant={isShortlisted ? "secondary" : "primary"}
                  size="sm"
                  onClick={handleShortlistToggle}
                >
                  {isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
                </Button>
              )}
              
              {isShortlisted && !isSelected && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleSelect}
                >
                  Select for Team
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CandidateCard;