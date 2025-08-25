import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return <span className={classes}>{children}</span>;
};

interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  className?: string;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  maxScore = 100,
  className = '',
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getVariant = (percentage: number): 'success' | 'warning' | 'danger' => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };
  
  const getLabel = (percentage: number): string => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    return 'Fair';
  };
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge variant={getVariant(percentage)} size="sm">
        {Math.round(score)}
      </Badge>
      <span className="text-xs text-gray-500">{getLabel(percentage)}</span>
    </div>
  );
};

interface StatusBadgeProps {
  status: 'shortlisted' | 'selected' | 'rejected' | 'pending';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const statusConfig = {
    shortlisted: { variant: 'info' as const, label: 'Shortlisted' },
    selected: { variant: 'success' as const, label: 'Selected' },
    rejected: { variant: 'danger' as const, label: 'Rejected' },
    pending: { variant: 'default' as const, label: 'Pending' },
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.label}
    </Badge>
  );
};

export { ScoreBadge, StatusBadge };

export default Badge;