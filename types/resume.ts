// ─── Resume JSON schema ──────────────────────────────────────────────────────

export type SectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "projects"
  | "languages"
  | "references";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photo?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  bullets: string[];
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic";
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
}

export interface ResumeData {
  id?: string;
  templateId: string;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skillGroups: SkillGroup[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  references: ReferenceItem[];
  sections: ResumeSection[];
  colorScheme: string;
  fontFamily: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: "Professional" | "Modern" | "Minimal" | "Creative" | "Executive" | "ATS-Friendly";
  atsScore: number;
  popular?: boolean;
  colors: string[];
  fonts: string[];
  description: string;
}

// ─── Supabase schema types ────────────────────────────────────────────────────

export interface DbResume {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  data: ResumeData;
  ats_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbResumeVersion {
  id: string;
  resume_id: string;
  version_number: number;
  data: ResumeData;
  label: string | null;
  created_at: string;
}
