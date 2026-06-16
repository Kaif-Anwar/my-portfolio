import Link from "next/link";
import { SkillsForm } from "@/components/admin/SkillsForm";
import { getSkillGroups } from "@/lib/site-content";

export default async function EditSkillsPage() {
  const skillGroups = await getSkillGroups();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-200">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">Edit Technologies section</h1>
        <p className="mt-2 text-slate-400">
          Manage skill categories and technologies shown on your portfolio.
        </p>
      </div>
      <SkillsForm skillGroups={skillGroups} />
    </div>
  );
}
