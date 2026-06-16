export function getAdminEmail(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  return email || null;
}

export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password || null;
}

export function areAdminCredentialsConfigured(): boolean {
  return Boolean(getAdminEmail() && getAdminPassword());
}

export function isAuthorizedAdminEmail(email: string | undefined): boolean {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;
  return email?.toLowerCase() === adminEmail.toLowerCase();
}

export function verifyLocalAdminCredentials(
  email: string,
  password: string
): boolean {
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();
  if (!adminEmail || !adminPassword) return false;

  return (
    email.toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword
  );
}
