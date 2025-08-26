/**
 * Utility functions for formatting data for display
 */

/**
 * Formats salary string for display
 */
export function formatSalary(salary: string | undefined): string {
  if (!salary) return "Not specified";
  
  // Remove existing formatting
  const cleanSalary = salary.replace(/[$,]/g, "");
  const amount = parseInt(cleanSalary);
  
  if (isNaN(amount) || amount === 0) return "Not specified";
  
  // Format with proper commas and dollar sign
  return `$${amount.toLocaleString()}`;
}

/**
 * Formats date for display
 */
export function formatDate(date: Date | string, format: "short" | "long" | "relative" = "short"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return "Invalid date";
  
  switch (format) {
    case "long":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long", 
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "relative":
      return formatRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString("en-US");
  }
}

/**
 * Formats relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  
  return "just now";
}

/**
 * Formats person name for display
 */
export function formatName(name: string): string {
  if (!name) return "Unknown";
  
  return name
    .split(" ")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Formats phone number for display
 */
export function formatPhone(phone: string): string {
  if (!phone) return "Not provided";
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  
  // Format based on length
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else {
    return phone; // Return original if format is unclear
  }
}

/**
 * Formats work availability array for display
 */
export function formatWorkAvailability(availability: string[]): string {
  if (!availability || availability.length === 0) return "Not specified";
  
  return availability
    .map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .join(", ");
}

/**
 * Formats GPA string for display
 */
export function formatGPA(gpa: string): string {
  if (!gpa || gpa.toLowerCase().includes("unknown")) return "Not specified";
  
  // Handle range formats like "GPA 3.5-3.9"
  if (gpa.includes("GPA")) {
    return gpa;
  }
  
  return `GPA ${gpa}`;
}

/**
 * Formats education level for display
 */
export function formatEducationLevel(level: string): string {
  const levels: Record<string, string> = {
    "high_school": "High School",
    "associate": "Associate Degree",
    "bachelor": "Bachelor's Degree",
    "master": "Master's Degree",
    "phd": "PhD",
    "doctorate": "Doctorate",
    "juris_doctor": "Juris Doctor (J.D)",
  };
  
  const normalized = level.toLowerCase().replace(/[^a-z]/g, "_");
  return levels[normalized] || level;
}

/**
 * Formats skills array for display with highlighting
 */
export function formatSkills(skills: string[], highlightTech = true): { 
  skill: string; 
  isTech: boolean; 
}[] {
  const techSkills = [
    "react", "angular", "vue", "javascript", "typescript", "node", "python", 
    "java", "go", "rust", "docker", "kubernetes", "aws", "gcp", "azure",
    "mongodb", "postgresql", "mysql", "redis", "graphql", "rest",
  ];
  
  return skills.map(skill => ({
    skill: skill.trim(),
    isTech: highlightTech && techSkills.some(tech => 
      skill.toLowerCase().includes(tech)
    ),
  }));
}

/**
 * Formats experience years calculation
 */
export function calculateExperienceYears(workExperiences: Array<{ company: string; roleName: string }>): string {
  const uniqueCompanies = new Set(workExperiences.map(exp => exp.company)).size;
  const totalRoles = workExperiences.length;
  
  if (totalRoles === 0) return "No experience listed";
  if (totalRoles === 1) return "1 role";
  
  return `${totalRoles} roles at ${uniqueCompanies} ${uniqueCompanies === 1 ? "company" : "companies"}`;
}

/**
 * Formats score for display with color coding
 */
export function formatScore(score: number): { 
  score: string; 
  color: "red" | "yellow" | "green"; 
  label: string;
} {
  const roundedScore = Math.round(score);
  
  let color: "red" | "yellow" | "green";
  let label: string;
  
  if (roundedScore >= 80) {
    color = "green";
    label = "Excellent";
  } else if (roundedScore >= 60) {
    color = "yellow"; 
    label = "Good";
  } else {
    color = "red";
    label = "Fair";
  }
  
  return {
    score: roundedScore.toString(),
    color,
    label,
  };
}

/**
 * Formats diversity percentage for display
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%";
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
}

/**
 * Truncates long text for display
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Formats location for consistent display
 */
export function formatLocation(location: string): string {
  if (!location) return "Location not specified";
  
  // Handle common formats
  const formatted = location
    .split(",")
    .map(part => part.trim())
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(", ");
    
  return formatted;
}