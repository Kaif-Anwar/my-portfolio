import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-200">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">Edit project</h1>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
