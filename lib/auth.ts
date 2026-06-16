import { cookies, headers } from "next/headers";
import {
  clearAdminSession,
  createAdminSession,
  getAdminSessionEmail,
} from "@/lib/admin-session";
import {
  areAdminCredentialsConfigured,
  getAdminEmail,
  isAuthorizedAdminEmail,
  verifyLocalAdminCredentials,
} from "@/lib/admin-credentials";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function getClientKey(email: string): string {
  return email.toLowerCase().trim();
}

export {
  areAdminCredentialsConfigured,
  getAdminEmail,
  isAuthorizedAdminEmail,
  verifyLocalAdminCredentials,
};

export async function getRequestIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

export async function checkLoginRateLimit(
  email: string
): Promise<{ allowed: boolean; message?: string }> {
  const cookieStore = await cookies();
  const key = `login_attempts_${getClientKey(email)}`;
  const raw = cookieStore.get(key)?.value;

  if (!raw) return { allowed: true };

  try {
    const { count, lockedUntil } = JSON.parse(raw) as {
      count: number;
      lockedUntil: number;
    };

    if (lockedUntil && Date.now() < lockedUntil) {
      const minutes = Math.ceil((lockedUntil - Date.now()) / 60000);
      return {
        allowed: false,
        message: `Too many failed attempts. Try again in ${minutes} minute(s).`,
      };
    }

    if (count >= MAX_LOGIN_ATTEMPTS) {
      return {
        allowed: false,
        message: "Too many failed attempts. Please wait 15 minutes.",
      };
    }
  } catch {
    return { allowed: true };
  }

  return { allowed: true };
}

export async function recordFailedLogin(email: string): Promise<void> {
  const cookieStore = await cookies();
  const key = `login_attempts_${getClientKey(email)}`;
  const raw = cookieStore.get(key)?.value;

  let count = 1;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { count: number };
      count = parsed.count + 1;
    } catch {
      count = 1;
    }
  }

  const payload = {
    count,
    lockedUntil: count >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0,
  };

  cookieStore.set(key, JSON.stringify(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: LOCKOUT_MS / 1000,
    path: "/admin/login",
  });
}

export async function clearLoginAttempts(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(`login_attempts_${getClientKey(email)}`);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const sessionEmail = await getAdminSessionEmail();
  if (sessionEmail && isAuthorizedAdminEmail(sessionEmail)) {
    return true;
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return Boolean(user && isAuthorizedAdminEmail(user.email));
    } catch {
      return false;
    }
  }

  return false;
}

export async function requireAdmin(): Promise<{ email: string }> {
  const sessionEmail = await getAdminSessionEmail();
  if (sessionEmail && isAuthorizedAdminEmail(sessionEmail)) {
    return { email: sessionEmail };
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && isAuthorizedAdminEmail(user.email)) {
      return { email: user.email! };
    }

    if (user) {
      await supabase.auth.signOut();
    }
  }

  throw new Error("You must be logged in.");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
}

export { createAdminSession };

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export function validateUpload(
  file: File,
  bucket: string
): { valid: boolean; error?: string } {
  if (bucket === "project-images") {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return { valid: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed." };
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return { valid: false, error: "Image must be under 10 MB." };
    }
  }

  if (bucket === "project-videos") {
    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      return { valid: false, error: "Only MP4, WebM, and MOV videos are allowed." };
    }
    if (file.size > MAX_VIDEO_SIZE) {
      return { valid: false, error: "Video must be under 50 MB." };
    }
  }

  return { valid: true };
}

export function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function isValidUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
