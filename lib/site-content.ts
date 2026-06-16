import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { CONTACT_CONTENT, EXPERIENCES, PROFILE, SKILL_GROUPS } from "@/lib/seed";
import type {
  ContactContent,
  Experience,
  Profile,
  SiteContent,
  SkillGroup,
} from "@/lib/types/project";

export function getDefaultSiteContent(): SiteContent {
  return {
    profile: PROFILE,
    skill_groups: SKILL_GROUPS,
    experiences: EXPERIENCES,
    contact: CONTACT_CONTENT,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured()) {
    return getDefaultSiteContent();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("profile, skill_groups, experiences, contact")
      .eq("id", "main")
      .single();

    if (error || !data) {
      return getDefaultSiteContent();
    }

    const defaults = getDefaultSiteContent();

    return {
      profile: (data.profile as Profile) ?? defaults.profile,
      skill_groups: (data.skill_groups as SkillGroup[]) ?? defaults.skill_groups,
      experiences: (data.experiences as Experience[])?.length
        ? (data.experiences as Experience[])
        : defaults.experiences,
      contact: {
        ...defaults.contact,
        ...((data.contact as ContactContent) ?? {}),
      },
    };
  } catch {
    return getDefaultSiteContent();
  }
}

export async function getProfile(): Promise<Profile> {
  const content = await getSiteContent();
  return content.profile;
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const content = await getSiteContent();
  return content.skill_groups;
}

export async function getExperiences(): Promise<Experience[]> {
  const content = await getSiteContent();
  return content.experiences;
}

export async function getContactContent(): Promise<ContactContent> {
  const content = await getSiteContent();
  return content.contact;
}
