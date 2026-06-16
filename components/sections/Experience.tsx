import type { Experience } from "@/lib/types/project";

export function Experience({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="relative px-6 py-24 md:px-12 lg:px-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 to-[#0a0a0f]/90" />
      <div className="relative mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
          Experience
        </p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">Activities</h2>

        <div className="mt-10 space-y-6">
          {experiences.map((exp) => (
            <article
              key={`${exp.organization}-${exp.title}`}
              className="rounded-2xl border border-white/15 bg-slate-950/85 p-6 shadow-xl backdrop-blur-md"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                  <p className="text-slate-300">{exp.organization}</p>
                </div>
                <span className="text-sm text-cyan-400">{exp.period}</span>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-400">
                {exp.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
