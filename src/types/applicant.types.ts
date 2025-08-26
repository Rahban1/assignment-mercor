import { z } from "zod";

// the data is messy so I am purposely being lenient in accepting the data here
export const RawWorkExperienceSchema = z.object({
    company: z.string().optional(),
    roleName: z.string().optional(),
});

export const RawDegreeSchema = z.object({
    degree: z.string().optional(),
    subject: z.string().optional(),
    school: z.string().optional(),
    gpa: z.string().optional(),
    startDate: z.string().optional(), 
    endDate: z.string().optional(),
    originalSchool: z.string().optional(),
    isTop50: z.boolean().optional(),
    isTop25: z.boolean().optional(),
});

export const RawEducationSchema = z.object({
    highest_level: z.string().optional(),
    degrees: z.array(RawDegreeSchema).optional(),
});

export const RawApplicantSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional().nullable(),
    location: z.string().optional(),
    submitted_at: z.string().optional(),
    work_availability: z.array(z.string()).optional(),
    annual_salary_expectation: z.record(z.string(), z.string()).optional(),
    work_experiences: z.array(RawWorkExperienceSchema).optional(),
    education: RawEducationSchema.optional(),
    skills: z.array(z.string()).optional(),
});

export type RawApplicant = z.infer<typeof RawApplicantSchema>;

// now I write the stricter schema which app expects

export const WorkExperienceSchema = z.object({
    company: z.string().min(1),
    roleName: z.string().min(1),
});

export const DegreeSchema = z.object({
    degree: z.string(),
    subject: z.string(),
    school: z.string(),
    gpa: z.string(),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().transform((val) => new Date(val)),
    originalSchool: z.string(),
    isTop50: z.boolean(),
    isTop25: z.boolean().optional(),
});

export const EducationSchema = z.object({
    highest_level: z.string(),
    degrees: z.array(DegreeSchema),
});
  
export const SalaryExpectationSchema = z.object({
    "full-time": z.string().optional(),
    "part-time": z.string().optional(),
    "contract": z.string().optional(),
    "internship": z.string().optional(),
});

export const ApplicantSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    email: z.email(),
    phone: z.string(),
    location: z.string(),
    submitted_at: z.string().transform((val) => new Date(val)),
    work_availability: z.array(
        z.enum(["full-time", "part-time", "contract", "internship"])
    ),
    annual_salary_expectation: SalaryExpectationSchema,
    work_experiences: z.array(WorkExperienceSchema),
    education: EducationSchema,
    skills: z.array(z.string().min(1)),
});

export type Applicant = z.infer<typeof ApplicantSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Degree = z.infer<typeof DegreeSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type SalaryExpectation = z.infer<typeof SalaryExpectationSchema>;
export type WorkAvailability = Applicant["work_availability"][number];

// Hiring-specific types
export interface ApplicantScore {
  applicantId: string;
  totalScore: number;
  experienceScore: number;
  educationScore: number;
  skillScore: number;
  diversityScore: number;
  salaryScore: number;
  scoredAt: Date;
}

export interface ShortlistedCandidate {
  applicantId: string;
  shortlistedAt: Date;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface SelectedCandidate {
  applicantId: string;
  selectedAt: Date;
  position: string;
  reason: string;
  diversityFactor?: "location" | "education" | "experience" | "skills";
}

export interface FilterState {
  search: string;
  locations: string[];
  workAvailability: WorkAvailability[];
  minExperience: number;
  maxSalary: number;
  educationLevel: string[];
  skills: string[];
  isShortlisted: boolean | null;
  isSelected: boolean | null;
}

export interface SortConfig {
  key: keyof Applicant | "totalScore";
  direction: "asc" | "desc";
}

export interface DiversityMetrics {
  locations: Record<string, number>;
  educationLevels: Record<string, number>;
  experienceLevels: Record<string, number>;
  topSchools: number;
  averageSalary: number;
}