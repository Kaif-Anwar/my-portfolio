import type { SkillGroup } from "@/lib/types/project";

export function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section id="skills" className="relative px-6 py-24 md:px-12 lg:px-20">
      <div className="pointer-events-none absolute inset-0 bg-[#0a0a0f]/90" />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
          Skills
        </p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">Technologies</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-white/15 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-md"
            >
              <h3 className="text-lg font-semibold text-white">{group.category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
