/**
 * Seed script — run after Supabase is configured:
 *   npm run seed
 *
 * Loads variables from .env.local in the project root.
 */

import { resolve } from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { CONTACT_CONTENT, EXPERIENCES, PROFILE, SEED_PROJECTS, SKILL_GROUPS } from "../lib/seed";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const { error: contentError } = await supabase.from("site_content").upsert({
    id: "main",
    profile: PROFILE,
    skill_groups: SKILL_GROUPS,
    experiences: EXPERIENCES,
    contact: CONTACT_CONTENT,
  });

  if (contentError) {
    console.error("Failed to seed site content:", contentError.message);
  } else {
    console.log("Seeded: about + technologies");
  }

  for (const project of SEED_PROJECTS) {
    const { error } = await supabase.from("projects").upsert(project, {
      onConflict: "slug",
    });

    if (error) {
      console.error(`Failed to seed ${project.slug}:`, error.message);
    } else {
      console.log(`Seeded: ${project.title}`);
    }
  }

  console.log("Done.");
}

main();
