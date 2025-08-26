import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './Icons';

interface DarkModeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  className = '',
  size = 'md'
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8'
  };

  const thumbSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out
        ${sizeClasses[size]}
        ${isDarkMode 
          ? 'bg-primary shadow-primary/25' 
          : 'bg-muted shadow-muted/25'
        }
        hover:shadow-lg backdrop-blur-sm border border-border/20
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`
          absolute flex items-center justify-center rounded-full bg-white shadow-lg
          ${thumbSizes[size]}
          transition-all duration-300 ease-in-out
        `}
        animate={{
          x: isDarkMode ? (size === 'sm' ? 20 : size === 'md' ? 24 : 28) : 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        {isDarkMode ? (
          <MoonIcon className="w-3 h-3 text-primary" strokeWidth={2} />
        ) : (
          <SunIcon className="w-3 h-3 text-primary" strokeWidth={2} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
