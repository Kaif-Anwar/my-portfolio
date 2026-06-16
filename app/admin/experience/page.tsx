import Link from "next/link";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { getExperiences } from "@/lib/site-content";

export default async function EditExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-200">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">Edit Experience section</h1>
        <p className="mt-2 text-slate-400">
          Manage activities and work experience shown on your portfolio.
        </p>
      </div>
      <ExperienceForm experiences={experiences} />
    </div>
  );
}
