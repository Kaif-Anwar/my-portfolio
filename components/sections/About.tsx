import type { Profile } from "@/lib/types/project";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="relative px-6 py-24 md:px-12 lg:px-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/80 to-[#0a0a0f]/95" />
      <div className="relative mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
          About
        </p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">Who I am</h2>
        <p className="mt-6 text-lg leading-relaxed text-slate-300">{profile.bio}</p>

        <div className="mt-10 rounded-2xl border border-white/15 bg-slate-950/85 p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-lg font-semibold text-white">Education</h3>
          <p className="mt-2 text-slate-300">{profile.education.degree}</p>
          <p className="text-slate-400">{profile.education.school}</p>
          <p className="mt-1 text-sm text-cyan-400">Expected {profile.education.expected}</p>
        </div>
      </div>
    </section>
  );
}
