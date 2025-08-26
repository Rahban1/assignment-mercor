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
    default: 'bg-muted/60 text-muted-foreground border border-border backdrop-blur-sm hover:bg-muted transition-colors',
    success: 'bg-accent/60 text-accent-foreground border border-border backdrop-blur-sm hover:bg-accent transition-colors',
    warning: 'bg-secondary/60 text-secondary-foreground border border-border backdrop-blur-sm hover:bg-secondary transition-colors',
    danger: 'bg-destructive/60 text-destructive-foreground border border-border backdrop-blur-sm hover:bg-destructive transition-colors',
    info: 'bg-primary/20 text-primary-foreground border border-border backdrop-blur-sm hover:bg-primary/30 transition-colors',
    secondary: 'bg-muted text-muted-foreground border border-transparent hover:bg-muted/80 transition-colors',
    gradient: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all',
  };

  const glowClasses = glow ? {
    default: 'shadow-lg shadow-muted/25',
    success: 'shadow-lg shadow-accent/25',
    warning: 'shadow-lg shadow-secondary/25',
    danger: 'shadow-lg shadow-destructive/25',
    info: 'shadow-lg shadow-primary/25',
    secondary: 'shadow-lg shadow-secondary/25',
    gradient: 'shadow-lg shadow-primary/25',
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
          className="text-xs text-muted-foreground font-medium"
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