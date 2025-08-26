import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  delay?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  interactive = false,
  delay = 0,
}) => {
  const baseClasses = 'bg-card rounded-xl border backdrop-blur-sm';
  
  const variantClasses = {
    default: 'border-border/50 shadow-sm hover:shadow-md transition-all duration-300',
    bordered: 'border-2 border-border shadow-sm',
    elevated: 'shadow-xl border-border/30 hover:shadow-2xl transition-all duration-300',
    glass: 'bg-card/80 backdrop-blur-md border-border/20 shadow-lg',
    gradient: 'bg-gradient-to-br from-card to-muted border-border/40 shadow-lg',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };
  
  const interactiveClasses = interactive 
    ? 'card-interactive hover-lift cursor-pointer' 
    : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`;
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay,
        ease: [0.25, 0.25, 0, 1]
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div 
      className={classes}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      layout
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div 
      className={`mb-6 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  gradient = false,
}) => {
  const titleClasses = gradient 
    ? `text-xl font-bold text-gradient ${className}`
    : `text-xl font-bold text-slate-900 ${className}`;

  return (
    <motion.h3 
      className={titleClasses}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
    >
      {children}
    </motion.h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div 
      className={`text-slate-700 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div 
      className={`mt-6 pt-4 border-t border-slate-100 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export { CardHeader, CardTitle, CardContent, CardFooter };

export default Card;