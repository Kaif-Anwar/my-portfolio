import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const unauthorized = params.error === "unauthorized";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your private admin email and password.
          </p>
          {unauthorized && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              This account is not authorized for admin access.
            </p>
          )}
        </div>
        <LoginForm />
        <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
          <p>Only the email set in ADMIN_EMAIL can access this panel.</p>
          <Link href="/" className="block hover:text-slate-300">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
