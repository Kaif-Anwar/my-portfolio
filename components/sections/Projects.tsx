"use client";

import { useState } from "react";
import Image from "next/image";
import { getEmbedUrl, isExternalVideo } from "@/lib/project-utils";
import type { Project } from "@/lib/types/project";

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const embedUrl = project.video_url ? getEmbedUrl(project.video_url) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1117] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
            <p className="mt-2 text-slate-400">{project.short_description}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1 text-sm text-slate-300 hover:bg-white/5"
          >
            Close
          </button>
        </div>

        {project.images.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.images.map((src) => (
              <div key={src} className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={project.title}
                  fill
                  className="object-cover"
                  unoptimized={src.startsWith("http")}
                />
              </div>
            ))}
          </div>
        )}

        {project.video_url && (
          <div className="mt-6">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${project.title} video`}
                className="aspect-video w-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={project.video_url}
                controls
                className="w-full rounded-xl"
              />
            )}
          </div>
        )}

        <p className="mt-6 whitespace-pre-wrap text-slate-300">{project.long_description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:underline"
            >
              GitHub
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:underline"
            >
              Live Demo
            </a>
          )}
          {project.video_url && isExternalVideo(project.video_url) && !embedUrl && (
            <a
              href={project.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:underline"
            >
              Watch Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
          Projects
        </p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">Selected work</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelected(project)}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
            >
              {project.featured && (
                <span className="mb-3 inline-block rounded-full bg-cyan-400/15 px-2 py-0.5 text-xs font-medium text-cyan-300">
                  Featured
                </span>
              )}
              <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300">
                {project.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-slate-400">{project.short_description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech_stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
