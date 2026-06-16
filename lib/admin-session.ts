import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAdminEmail } from "@/lib/admin-credentials";

const COOKIE_NAME = "portfolio_admin_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function getSessionSecret(): string | null {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    null
  );
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

async function signPayload(payload: string): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}:${hex}`;
}

async function verifySignedToken(signed: string): Promise<string | null> {
  const secret = getSessionSecret();
  const adminEmail = getAdminEmail();
  if (!secret || !adminEmail) return null;

  try {
    const lastColon = signed.lastIndexOf(":");
    if (lastColon === -1) return null;

    const payload = signed.slice(0, lastColon);
    const signature = signed.slice(lastColon + 1);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload)
    );
    const expected = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expected.length !== signature.length) return null;

    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
      mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    if (mismatch !== 0) return null;

    const [email, expiresRaw] = payload.split(":");
    const expires = Number(expiresRaw);
    if (!email || !expires || Date.now() > expires) return null;
    if (email !== adminEmail.toLowerCase()) return null;

    return email;
  } catch {
    return null;
  }
}

export async function createAdminSession(email: string): Promise<void> {
  const expires = Date.now() + SESSION_MS;
  const payload = `${email.toLowerCase()}:${expires}`;
  const signed = await signPayload(payload);
  const token = toBase64Url(signed);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
}

export async function getAdminSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySignedToken(fromBase64Url(token));
}

export async function getAdminSessionEmailFromRequest(
  request: NextRequest
): Promise<string | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySignedToken(fromBase64Url(token));
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
