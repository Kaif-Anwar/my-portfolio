import Link from "next/link";
import { AboutForm } from "@/components/admin/AboutForm";
import { getProfile } from "@/lib/site-content";

export default async function EditAboutPage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-200">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">Edit About section</h1>
        <p className="mt-2 text-slate-400">
          Update your bio, education, and contact details shown on the homepage.
        </p>
      </div>
      <AboutForm profile={profile} />
    </div>
  );
}
