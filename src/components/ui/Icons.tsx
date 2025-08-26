import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

// Base Icon component
const Icon: React.FC<IconProps & { children: React.ReactNode; viewBox?: string }> = ({
  size = 20,
  className = '',
  strokeWidth = 2,
  viewBox = '0 0 24 24',
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

// Warning/Alert Icon (⚠️)
export const AlertTriangleIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <path d="m12 17 .01 0"/>
  </Icon>
);

// Search Icon (🔍)
export const SearchIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </Icon>
);

// Users/Team Icon (👥)
export const UsersIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </Icon>
);

// Star Icon (⭐)
export const StarIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </Icon>
);

// Sparkles Icon (✨)
export const SparklesIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </Icon>
);

// Target Icon (🎯)
export const TargetIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </Icon>
);

// Refresh Icon (🔄)
export const RefreshIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </Icon>
);

// Briefcase Icon (💼)
export const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </Icon>
);

// Rocket Icon (🚀)
export const RocketIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </Icon>
);

// Chart Icon (📊)
export const BarChartIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="12" x2="12" y1="20" y2="10"/>
    <line x1="18" x2="18" y1="20" y2="4"/>
    <line x1="6" x2="6" y1="20" y2="16"/>
  </Icon>
);

// Calendar Icon (🗓️)
export const CalendarIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </Icon>
);

// Eye Icon (👁️)
export const EyeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </Icon>
);

// Bookmark Icon (🔖)
export const BookmarkIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </Icon>
);

// Light Bulb Icon (💡) - for insights/ideas
export const LightbulbIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </Icon>
);

// Trophy Icon - alternative to star for achievements
export const TrophyIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.01 18.75 13 19.88 13 21.3c0 .36-.35.7-.71.7H11.71c-.36 0-.71-.34-.71-.7 0-1.42.99-2.55 2.03-3.09.5-.23.97-.66.97-1.21v-2.34"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </Icon>
);

// Zap Icon - for energy/power (⚡)
export const ZapIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
  </Icon>
);

// Map Pin Icon (📍)
export const MapPinIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M20 10c0 6-10 12-10 12s-10-6-10-12a10 10 0 0 1 20 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </Icon>
);

// Dollar Sign Icon (💰)
export const DollarSignIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="12" x2="12" y1="2" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </Icon>
);

// Graduation Cap Icon (🎓)
export const GraduationCapIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </Icon>
);

// Clock Icon (⏰)
export const ClockIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </Icon>
);

// X Mark Icon (❌)
export const XMarkIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="m18 6-12 12"/>
    <path d="m6 6 12 12"/>
  </Icon>
);

// Hourglass Icon (⏳)
export const HourglassIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5 22h14"/>
    <path d="M5 2h14"/>
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
    <path d="M7 22v-4.172a2 2 0 0 1 .586-1.414L12 12 7.586 7.414A2 2 0 0 1 7 6.172V2"/>
  </Icon>
);

// Sparkle Icon (🌟) - enhanced sparkle for high scores
export const SparkleIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 3l2.912 5.825 6.426.934-4.669 4.55 1.102 6.421L12 17.77l-5.771 2.96 1.102-6.42-4.669-4.551 6.426-.934L12 3z"/>
  </Icon>
);

export default {
  AlertTriangleIcon,
  SearchIcon,
  UsersIcon,
  StarIcon,
  SparklesIcon,
  TargetIcon,
  RefreshIcon,
  BriefcaseIcon,
  RocketIcon,
  BarChartIcon,
  CalendarIcon,
  EyeIcon,
  BookmarkIcon,
  LightbulbIcon,
  TrophyIcon,
  ZapIcon,
  MapPinIcon,
  DollarSignIcon,
  GraduationCapIcon,
  ClockIcon,
  XMarkIcon,
  HourglassIcon,
  SparkleIcon,
};