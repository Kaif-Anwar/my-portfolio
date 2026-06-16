import type { Profile } from "@/lib/types/project";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section
      id="hero"
      className="flex min-h-screen flex-col justify-center px-6 py-24 md:px-12 lg:px-20"
    >
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
        Portfolio
      </p>
      <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">
        {profile.name}
      </h1>
      <p className="mt-6 max-w-2xl text-xl text-slate-300 md:text-2xl">
        {profile.title}
      </p>
      <p className="mt-4 max-w-xl text-slate-400">{profile.location}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
