import Link from "next/link";
import { logoutAction } from "@/lib/actions/admin";
import { getAllProjects } from "@/lib/projects";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const projects = await getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-slate-400">Manage your portfolio content.</p>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="secondary">
            Log out
          </Button>
        </form>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold text-white">About</h2>
          <p className="mt-2 text-sm text-slate-400">Bio, education, and contact info.</p>
          <Link href="/admin/about" className="mt-4 inline-block">
            <Button variant="secondary">Edit about</Button>
          </Link>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Technologies</h2>
          <p className="mt-2 text-sm text-slate-400">Skill categories and tech stack tags.</p>
          <Link href="/admin/skills" className="mt-4 inline-block">
            <Button variant="secondary">Edit technologies</Button>
          </Link>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Experience</h2>
          <p className="mt-2 text-sm text-slate-400">Activities and work experience entries.</p>
          <Link href="/admin/experience" className="mt-4 inline-block">
            <Button variant="secondary">Edit experience</Button>
          </Link>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p className="mt-2 text-sm text-slate-400">Heading, message, and social links.</p>
          <Link href="/admin/contact" className="mt-4 inline-block">
            <Button variant="secondary">Edit contact</Button>
          </Link>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          <p className="mt-2 text-sm text-slate-400">
            {projects.length} total · {projects.filter((p) => p.status === "published").length}{" "}
            published
          </p>
          <Link href="/admin/projects/new" className="mt-4 inline-block">
            <Button>New project</Button>
          </Link>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <h2 className="mb-4 text-lg font-semibold text-white">All projects</h2>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Featured</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-white/5">
                <td className="py-4 pr-4 font-medium text-white">{project.title}</td>
                <td className="py-4 pr-4 capitalize text-slate-300">{project.status}</td>
                <td className="py-4 pr-4 text-slate-300">{project.featured ? "Yes" : "No"}</td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button variant="secondary">Edit</Button>
                    </Link>
                    {!project.id.startsWith("seed-") && (
                      <DeleteProjectButton id={project.id} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-300">
          View public site
        </Link>
      </p>
    </div>
  );
}
