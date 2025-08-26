import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 focus:ring-slate-500 border border-slate-200',
    success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white focus:ring-emerald-500 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 focus:ring-slate-500',
    gradient: 'gradient-primary text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
  };
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs font-medium',
    sm: 'px-3 py-2 text-sm font-medium',
    md: 'px-4 py-2.5 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-semibold',
    xl: 'px-8 py-4 text-lg font-semibold',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const buttonVariants = {
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
      animate={isLoading ? "loading" : ""}
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