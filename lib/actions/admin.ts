"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  createAdminSession,
  isAuthorizedAdminEmail,
  isValidUrl,
  logoutAdmin,
  recordFailedLogin,
  requireAdmin,
  sanitizeText,
  validateUpload,
  verifyLocalAdminCredentials,
  areAdminCredentialsConfigured,
} from "@/lib/auth";
import { slugify } from "@/lib/project-utils";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { CONTACT_CONTENT, EXPERIENCES, PROFILE, SKILL_GROUPS } from "@/lib/seed";
import type {
  ContactContent,
  Experience,
  Profile,
  ProjectStatus,
  SkillGroup,
} from "@/lib/types/project";

export type ProjectFormState = {
  error?: string;
  success?: string;
};

export async function loginAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const email = sanitizeText(String(formData.get("email") ?? ""), 254);
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!areAdminCredentialsConfigured()) {
    return {
      error:
        "Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local (local) or Vercel Environment Variables (production).",
    };
  }

  if (!isAuthorizedAdminEmail(email)) {
    return { error: "This email is not authorized for admin access." };
  }

  const rateLimit = await checkLoginRateLimit(email);
  if (!rateLimit.allowed) {
    return { error: rateLimit.message ?? "Too many login attempts." };
  }

  if (isSupabaseConfigured()) {
    const supabase = await import("@/lib/supabase/server").then((m) => m.createClient());
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      await clearLoginAttempts(email);
      await createAdminSession(email);
      redirect("/admin");
    }
  }

  if (verifyLocalAdminCredentials(email, password)) {
    await clearLoginAttempts(email);
    await createAdminSession(email);
    redirect("/admin");
  }

  await recordFailedLogin(email);
  return { error: "Invalid email or password." };
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function saveProjectAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized." };
  }

  const supabase = createServiceClient();

  const id = String(formData.get("id") ?? "");
  const title = sanitizeText(String(formData.get("title") ?? ""), 200);
  const slugInput = sanitizeText(String(formData.get("slug") ?? ""), 200);
  const shortDescription = sanitizeText(String(formData.get("short_description") ?? ""), 500);
  const longDescription = sanitizeText(String(formData.get("long_description") ?? ""), 10000);
  const techStackRaw = String(formData.get("tech_stack") ?? "");
  const githubUrl = sanitizeText(String(formData.get("github_url") ?? ""), 500) || null;
  const liveUrl = sanitizeText(String(formData.get("live_url") ?? ""), 500) || null;
  const videoUrl = sanitizeText(String(formData.get("video_url") ?? ""), 500) || null;
  const featured = formData.get("featured") === "on";
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const status = String(formData.get("status") ?? "draft") as ProjectStatus;
  const startDate = String(formData.get("start_date") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;
  const existingImages = String(formData.get("existing_images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);

  if (!title) {
    return { error: "Title is required." };
  }

  if (githubUrl && !isValidUrl(githubUrl)) {
    return { error: "Invalid GitHub URL." };
  }
  if (liveUrl && !isValidUrl(liveUrl)) {
    return { error: "Invalid live demo URL." };
  }
  if (videoUrl && !isValidUrl(videoUrl)) {
    return { error: "Invalid video URL." };
  }

  const slug = slugInput || slugify(title);
  const tech_stack = techStackRaw
    .split(",")
    .map((s) => sanitizeText(s, 80))
    .filter(Boolean)
    .slice(0, 30);

  const payload = {
    title,
    slug,
    short_description: shortDescription,
    long_description: longDescription,
    tech_stack,
    github_url: githubUrl,
    live_url: liveUrl,
    video_url: videoUrl,
    featured,
    sort_order: sortOrder,
    status,
    start_date: startDate,
    end_date: endDate,
    images: existingImages,
  };

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function saveAboutAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized." };
  }

  const supabase = createServiceClient();

  const profile: Profile = {
    name: sanitizeText(String(formData.get("name") ?? ""), 120),
    title: sanitizeText(String(formData.get("title") ?? ""), 200),
    location: sanitizeText(String(formData.get("location") ?? ""), 120),
    email: sanitizeText(String(formData.get("email") ?? ""), 254),
    phone: sanitizeText(String(formData.get("phone") ?? ""), 30),
    linkedin: sanitizeText(String(formData.get("linkedin") ?? ""), 500),
    github: sanitizeText(String(formData.get("github") ?? ""), 500),
    bio: sanitizeText(String(formData.get("bio") ?? ""), 5000),
    education: {
      degree: sanitizeText(String(formData.get("education_degree") ?? ""), 200),
      school: sanitizeText(String(formData.get("education_school") ?? ""), 300),
      expected: sanitizeText(String(formData.get("education_expected") ?? ""), 50),
    },
  };

  if (!profile.name || !profile.bio) {
    return { error: "Name and bio are required." };
  }

  if (!isValidUrl(profile.linkedin) || !isValidUrl(profile.github)) {
    return { error: "LinkedIn and GitHub must be valid URLs." };
  }

  const { data: existing } = await supabase
    .from("site_content")
    .select("skill_groups, experiences, contact")
    .eq("id", "main")
    .single();

  const skill_groups = (existing?.skill_groups as SkillGroup[]) ?? SKILL_GROUPS;
  const experiences = (existing?.experiences as Experience[]) ?? EXPERIENCES;
  const contact = (existing?.contact as ContactContent) ?? CONTACT_CONTENT;

  const { error } = await supabase.from("site_content").upsert({
    id: "main",
    profile,
    skill_groups,
    experiences,
    contact,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: "About section saved." };
}

export async function saveSkillsAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized." };
  }

  const supabase = createServiceClient();
  const raw = String(formData.get("skill_groups_json") ?? "[]");

  let skill_groups: SkillGroup[];
  try {
    skill_groups = JSON.parse(raw) as SkillGroup[];
  } catch {
    return { error: "Invalid skills data." };
  }

  if (!Array.isArray(skill_groups) || skill_groups.length === 0) {
    return { error: "At least one skill category is required." };
  }

  const sanitized = skill_groups
    .map((group) => ({
      category: sanitizeText(group.category ?? "", 80),
      items: (group.items ?? [])
        .map((item) => sanitizeText(item, 80))
        .filter(Boolean)
        .slice(0, 30),
    }))
    .filter((group) => group.category && group.items.length > 0)
    .slice(0, 20);

  if (sanitized.length === 0) {
    return { error: "Each category needs a name and at least one skill." };
  }

  const { data: existing } = await supabase
    .from("site_content")
    .select("profile, experiences, contact")
    .eq("id", "main")
    .single();

  const profile = (existing?.profile as Profile) ?? PROFILE;
  const experiences = (existing?.experiences as Experience[]) ?? EXPERIENCES;
  const contact = (existing?.contact as ContactContent) ?? CONTACT_CONTENT;

  const { error } = await supabase.from("site_content").upsert({
    id: "main",
    profile,
    skill_groups: sanitized,
    experiences,
    contact,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: "Technologies section saved." };
}

export async function saveExperienceAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized." };
  }

  const supabase = createServiceClient();
  const raw = String(formData.get("experiences_json") ?? "[]");

  let experiences: Experience[];
  try {
    experiences = JSON.parse(raw) as Experience[];
  } catch {
    return { error: "Invalid experience data." };
  }

  const sanitized = experiences
    .map((exp) => ({
      title: sanitizeText(exp.title ?? "", 120),
      organization: sanitizeText(exp.organization ?? "", 200),
      period: sanitizeText(exp.period ?? "", 50),
      bullets: (exp.bullets ?? [])
        .map((b) => sanitizeText(b, 500))
        .filter(Boolean)
        .slice(0, 10),
    }))
    .filter((exp) => exp.title && exp.organization && exp.bullets.length > 0)
    .slice(0, 20);

  if (sanitized.length === 0) {
    return { error: "At least one experience entry with bullets is required." };
  }

  const { data: existing } = await supabase
    .from("site_content")
    .select("profile, skill_groups, contact")
    .eq("id", "main")
    .single();

  const profile = (existing?.profile as Profile) ?? PROFILE;
  const skill_groups = (existing?.skill_groups as SkillGroup[]) ?? SKILL_GROUPS;
  const contact = (existing?.contact as ContactContent) ?? CONTACT_CONTENT;

  const { error } = await supabase.from("site_content").upsert({
    id: "main",
    profile,
    skill_groups,
    experiences: sanitized,
    contact,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: "Experience section saved." };
}

export async function saveContactAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized." };
  }

  const supabase = createServiceClient();

  const contact: ContactContent = {
    heading: sanitizeText(String(formData.get("heading") ?? ""), 200),
    message: sanitizeText(String(formData.get("message") ?? ""), 2000),
  };

  const profileUpdates: Partial<Profile> = {
    email: sanitizeText(String(formData.get("email") ?? ""), 254),
    linkedin: sanitizeText(String(formData.get("linkedin") ?? ""), 500),
    github: sanitizeText(String(formData.get("github") ?? ""), 500),
  };

  if (!contact.heading || !contact.message) {
    return { error: "Heading and message are required." };
  }

  if (
    (profileUpdates.linkedin && !isValidUrl(profileUpdates.linkedin)) ||
    (profileUpdates.github && !isValidUrl(profileUpdates.github))
  ) {
    return { error: "LinkedIn and GitHub must be valid URLs." };
  }

  const { data: existing } = await supabase
    .from("site_content")
    .select("profile, skill_groups, experiences")
    .eq("id", "main")
    .single();

  const profile: Profile = {
    ...((existing?.profile as Profile) ?? PROFILE),
    email: profileUpdates.email || PROFILE.email,
    linkedin: profileUpdates.linkedin || PROFILE.linkedin,
    github: profileUpdates.github || PROFILE.github,
  };
  const skill_groups = (existing?.skill_groups as SkillGroup[]) ?? SKILL_GROUPS;
  const experiences = (existing?.experiences as Experience[]) ?? EXPERIENCES;

  const { error } = await supabase.from("site_content").upsert({
    id: "main",
    profile,
    skill_groups,
    experiences,
    contact,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: "Contact section saved." };
}

export async function deleteProjectAction(id: string): Promise<ProjectFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: "Project deleted." };
}

export async function uploadProjectFileAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  let adminEmail: string;
  try {
    ({ email: adminEmail } = await requireAdmin());
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized." };
  }

  const file = formData.get("file") as File | null;
  const bucket = String(formData.get("bucket") ?? "project-images");

  if (!file || file.size === 0) {
    return { error: "No file selected." };
  }

  const validation = validateUpload(file, bucket);
  if (!validation.valid) {
    return { error: validation.error };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "bin";
  const owner = adminEmail.replace(/[^a-zA-Z0-9]/g, "_");
  const path = `${owner}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

  try {
    const serviceClient = createServiceClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await serviceClient.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) return { error: error.message };

    const {
      data: { publicUrl },
    } = serviceClient.storage.from(bucket).getPublicUrl(path);

    return { url: publicUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}
