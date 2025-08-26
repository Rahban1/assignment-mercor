import React from 'react';
import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground focus:ring-ring shadow-sm hover:shadow-md',
    secondary: 'bg-secondary hover:bg-secondary/90 active:bg-secondary/80 text-secondary-foreground focus:ring-ring border border-border',
    success: 'bg-accent hover:bg-accent/90 active:bg-accent/80 text-accent-foreground focus:ring-ring shadow-sm hover:shadow-md',
    danger: 'bg-destructive hover:bg-destructive/90 active:bg-destructive/80 text-destructive-foreground focus:ring-ring shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-muted active:bg-muted/80 text-foreground focus:ring-ring',
    gradient: 'bg-primary text-primary-foreground focus:ring-ring shadow-lg hover:shadow-xl hover:bg-primary/90',
  };
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs font-medium',
    sm: 'px-3 py-2 text-sm font-medium',
    md: 'px-4 py-2.5 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-semibold',
    xl: 'px-8 py-4 text-lg font-semibold',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const buttonVariants: Variants = {
    hover: { 
      scale: 1.02,
    },
    tap: { 
      scale: 0.98,
    },
    loading: {
    }
  };

  const iconSize = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }[size];

  const LoadingSpinner = () => (
    <motion.svg
      className={`animate-spin ${iconSize} ${children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </motion.svg>
  );

  const IconComponent = ({ children: iconChildren }: { children: React.ReactNode }) => (
    <motion.span
      className={`${iconSize} ${children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {iconChildren}
    </motion.span>
  );

  return (
    <motion.button
      className={classes}
      disabled={disabled || isLoading}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      animate={isLoading ? "loading" : undefined}
      {...props}
    >
      {/* Ripple effect background */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          icon && iconPosition === 'left' && <IconComponent>{icon}</IconComponent>
        )}
        
        {children && (
          <motion.span
            initial={{ opacity: isLoading ? 0 : 1 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.span>
        )}
        
        {!isLoading && icon && iconPosition === 'right' && (
          <IconComponent>{icon}</IconComponent>
        )}
      </div>
    </motion.button>
  );
};

export default Button;