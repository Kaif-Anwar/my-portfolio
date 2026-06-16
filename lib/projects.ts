import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { seedProjectsWithIds } from "@/lib/seed";
import type { Project, ProjectStatus } from "@/lib/types/project";

function mapRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    short_description: row.short_description as string,
    long_description: row.long_description as string,
    tech_stack: (row.tech_stack as string[]) ?? [],
    github_url: (row.github_url as string) ?? null,
    live_url: (row.live_url as string) ?? null,
    featured: Boolean(row.featured),
    sort_order: Number(row.sort_order ?? 0),
    status: row.status as ProjectStatus,
    images: (row.images as string[]) ?? [],
    video_url: (row.video_url as string) ?? null,
    start_date: (row.start_date as string) ?? null,
    end_date: (row.end_date as string) ?? null,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return seedProjectsWithIds();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return seedProjectsWithIds();
    }

    return data.map(mapRow);
  } catch {
    return seedProjectsWithIds();
  }
}

export async function getAllProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return seedProjectsWithIds();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return seedProjectsWithIds();
  }

  return data.map(mapRow);
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return seedProjectsWithIds().find((p) => p.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapRow(data);
}
