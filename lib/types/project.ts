export type ProjectStatus = "draft" | "published";

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  sort_order: number;
  status: ProjectStatus;
  images: string[];
  video_url: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Experience {
  title: string;
  organization: string;
  period: string;
  bullets: string[];
}

export interface ContactContent {
  heading: string;
  message: string;
}

export interface SiteContent {
  profile: Profile;
  skill_groups: SkillGroup[];
  experiences: Experience[];
  contact: ContactContent;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  education: {
    degree: string;
    school: string;
    expected: string;
  };
  bio: string;
}
