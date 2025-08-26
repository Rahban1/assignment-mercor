import { 
  type RawApplicant, 
  RawApplicantSchema, 
  type Applicant, 
  ApplicantSchema,
  type WorkAvailability
} from "../types/applicant.types";
// Simple ID generator (replace with uuid if needed)
const generateId = () => `applicant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Processes raw applicant data from JSON file into validated Applicant objects
 */
export async function processRawApplicants(rawData: unknown[]): Promise<{
  applicants: Applicant[];
  errors: Array<{ index: number; error: string; data: unknown }>;
}> {
  const applicants: Applicant[] = [];
  const errors: Array<{ index: number; error: string; data: unknown }> = [];

  for (let i = 0; i < rawData.length; i++) {
    const rawItem = rawData[i];
    
    try {
      // First, validate with lenient schema
      const rawApplicant = RawApplicantSchema.parse(rawItem);
      
      // Transform to strict format
      const applicant = transformRawToApplicant(rawApplicant, i);
      
      // Validate with strict schema
      const validatedApplicant = ApplicantSchema.parse(applicant);
      applicants.push(validatedApplicant);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown validation error";
      console.error(`Validation error for applicant ${i}:`, errorMessage, rawItem);
      errors.push({
        index: i,
        error: errorMessage,
        data: rawItem,
      });
    }
  }

  return { applicants, errors };
}

/**
 * Transforms raw applicant data to expected format
 */
function transformRawToApplicant(raw: RawApplicant, index: number): any {
  return {
    id: raw.id || generateId(),
    name: raw.name || `Unknown Applicant ${index}`,
    email: raw.email || `unknown${index}@example.com`,
    phone: raw.phone || "",
    location: raw.location || "Unknown",
    submitted_at: raw.submitted_at || new Date().toISOString(),
    work_availability: (raw.work_availability || ["full-time"]) as WorkAvailability[],
    annual_salary_expectation: raw.annual_salary_expectation || { "full-time": "$0" },
    work_experiences: (raw.work_experiences || []).map(exp => ({
      company: exp.company || "Unknown Company",
      roleName: exp.roleName || "Unknown Role",
    })),
    education: {
      highest_level: raw.education?.highest_level || "Unknown",
      degrees: (raw.education?.degrees || []).map(deg => ({
        degree: deg.degree || "Unknown Degree",
        subject: deg.subject || "Unknown Subject",
        school: deg.school || "Unknown School",
        gpa: deg.gpa || "Unknown",
        startDate: deg.startDate || "2020",
        endDate: deg.endDate || "2024",
        originalSchool: deg.originalSchool || deg.school || "Unknown School",
        isTop50: deg.isTop50 || false,
        isTop25: deg.isTop25,
      })),
    },
    skills: raw.skills || [],
  };
}

/**
 * Deduplicates applicants based on email
 */
export function deduplicateApplicants(applicants: Applicant[]): {
  unique: Applicant[];
  duplicates: Applicant[];
} {
  const seen = new Set<string>();
  const unique: Applicant[] = [];
  const duplicates: Applicant[] = [];

  applicants.forEach(applicant => {
    if (seen.has(applicant.email)) {
      duplicates.push(applicant);
    } else {
      seen.add(applicant.email);
      unique.push(applicant);
    }
  });

  return { unique, duplicates };
}

/**
 * Normalizes skill names for better matching
 */
export function normalizeSkills(applicants: Applicant[]): Applicant[] {
  const skillMap = createSkillNormalizationMap(applicants);
  
  return applicants.map(applicant => ({
    ...applicant,
    skills: applicant.skills.map(skill => skillMap[skill.toLowerCase()] || skill),
  }));
}

/**
 * Creates a mapping for normalizing similar skill names
 */
function createSkillNormalizationMap(applicants: Applicant[]): Record<string, string> {
  const allSkills = new Set<string>();
  applicants.forEach(app => {
    app.skills.forEach(skill => allSkills.add(skill.toLowerCase()));
  });

  const skillMap: Record<string, string> = {};
  const skillGroups = [
    ["javascript", "js", "ecmascript"],
    ["typescript", "ts"],
    ["react", "reactjs", "react.js"],
    ["node", "nodejs", "node.js"],
    ["python", "py"],
    ["docker", "containerization"],
    ["aws", "amazon web services"],
    ["gcp", "google cloud platform"],
    ["azure", "microsoft azure"],
    ["mongodb", "mongo"],
    ["postgresql", "postgres", "psql"],
    ["mysql", "sql"],
  ];

  skillGroups.forEach(group => {
    const canonical = group[0];
    group.forEach(variant => {
      if (allSkills.has(variant)) {
        skillMap[variant] = canonical;
      }
    });
  });

  return skillMap;
}

/**
 * Validates and cleans salary expectations
 */
export function normalizeSalaryExpectations(applicants: Applicant[]): Applicant[] {
  return applicants.map(applicant => ({
    ...applicant,
    annual_salary_expectation: Object.fromEntries(
      Object.entries(applicant.annual_salary_expectation).map(([key, value]) => [
        key,
        normalizeSalaryString(value),
      ])
    ),
  }));
}

function normalizeSalaryString(salary: string): string {
  if (!salary) return "$0";
  
  // Remove extra characters and normalize
  const cleaned = salary.replace(/[^\d]/g, "");
  const amount = parseInt(cleaned);
  
  if (isNaN(amount) || amount === 0) return "$0";
  
  return `$${amount.toLocaleString()}`;
}

/**
 * Extracts unique values for filter options
 */
export function extractFilterOptions(applicants: Applicant[]): {
  locations: string[];
  skills: string[];
  educationLevels: string[];
  workAvailability: string[];
  companies: string[];
  roles: string[];
} {
  const locations = new Set<string>();
  const skills = new Set<string>();
  const educationLevels = new Set<string>();
  const workAvailability = new Set<string>();
  const companies = new Set<string>();
  const roles = new Set<string>();

  applicants.forEach(applicant => {
    locations.add(applicant.location);
    educationLevels.add(applicant.education.highest_level);
    
    applicant.skills.forEach(skill => skills.add(skill));
    applicant.work_availability.forEach(wa => workAvailability.add(wa));
    applicant.work_experiences.forEach(exp => {
      companies.add(exp.company);
      roles.add(exp.roleName);
    });
  });

  return {
    locations: Array.from(locations).sort(),
    skills: Array.from(skills).sort(),
    educationLevels: Array.from(educationLevels).sort(),
    workAvailability: Array.from(workAvailability).sort(),
    companies: Array.from(companies).sort(),
    roles: Array.from(roles).sort(),
  };
}

/**
 * Creates search index for fast text searching
 */
export function createSearchIndex(applicants: Applicant[]): Map<string, Set<number>> {
  const index = new Map<string, Set<number>>();
  
  applicants.forEach((applicant, idx) => {
    const searchableText = [
      applicant.name,
      applicant.email,
      applicant.location,
      ...applicant.skills,
      ...applicant.work_experiences.map(exp => `${exp.company} ${exp.roleName}`),
      ...applicant.education.degrees.map(deg => `${deg.degree} ${deg.subject} ${deg.school}`),
    ].join(" ").toLowerCase();
    
    const words = searchableText.split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) {
        if (!index.has(word)) {
          index.set(word, new Set());
        }
        index.get(word)!.add(idx);
      }
    });
  });
  
  return index;
}