import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, BarChartIcon, SparkleIcon, SparklesIcon, XMarkIcon, HourglassIcon } from './Icons';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
  glow?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  animated = false,
  glow = false,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    secondary: 'bg-purple-50 text-purple-700 border border-purple-200',
    gradient: 'gradient-primary text-white shadow-sm',
  };

  const glowClasses = glow ? {
    default: 'shadow-slate-200/50',
    success: 'shadow-emerald-200/50',
    warning: 'shadow-amber-200/50',
    danger: 'shadow-red-200/50',
    info: 'shadow-blue-200/50',
    secondary: 'shadow-purple-200/50',
    gradient: 'shadow-blue-300/50',
  } : {};
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs font-medium',
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-4 py-1.5 text-base font-semibold',
  };
  
  const glowClass = glow && glowClasses[variant] ? `shadow-lg ${glowClasses[variant]}` : '';
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${glowClass} ${className}`;
  
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
    },
    hover: {
      scale: 1.05,
    }
  };

  if (!animated) {
    return <span className={classes}>{children}</span>;
  }

  return (
    <motion.span
      className={classes}
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {children}
    </motion.span>
  );
};

interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  maxScore = 100,
  className = '',
  showLabel = true,
  animated = true,
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

  const getIcon = (percentage: number): React.ReactNode => {
    if (percentage >= 80) return <SparkleIcon size={12} />;
    if (percentage >= 60) return <StarIcon size={12} />;
    return <BarChartIcon size={12} />;
  };
  
  return (
    <motion.div 
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Badge 
        variant={getVariant(percentage)} 
        size="sm" 
        animated={animated}
        glow={percentage >= 80}
      >
        <span className="flex items-center space-x-1">
          {getIcon(percentage)}
          <span>{Math.round(score)}</span>
        </span>
      </Badge>
      {showLabel && (
        <motion.span 
          className="text-xs text-slate-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getLabel(percentage)}
        </motion.span>
      )}
    </motion.div>
  );
};

interface StatusBadgeProps {
  status: 'shortlisted' | 'selected' | 'rejected' | 'pending';
  className?: string;
  animated?: boolean;
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  animated = true,
  showIcon = true,
}) => {
  const statusConfig = {
    shortlisted: { 
      variant: 'info' as const, 
      label: 'Shortlisted',
      icon: <StarIcon size={12} />,
      glow: false
    },
    selected: { 
      variant: 'success' as const, 
      label: 'Selected',
      icon: <SparklesIcon size={12} />,
      glow: true
    },
    rejected: { 
      variant: 'danger' as const, 
      label: 'Rejected',
      icon: <XMarkIcon size={12} />,
      glow: false
    },
    pending: { 
      variant: 'default' as const, 
      label: 'Pending',
      icon: <HourglassIcon size={12} />,
      glow: false
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant} 
      size="sm" 
      className={className}
      animated={animated}
      glow={config.glow}
    >
      <span className="flex items-center space-x-1">
        {showIcon && config.icon}
        <span>{config.label}</span>
      </span>
    </Badge>
  );
};

export { ScoreBadge, StatusBadge };

export default Badge;