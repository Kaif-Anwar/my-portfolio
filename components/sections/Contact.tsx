import type { ContactContent, Profile } from "@/lib/types/project";

export function Contact({
  profile,
  contact,
}: {
  profile: Profile;
  contact: ContactContent;
}) {
  return (
    <section id="contact" className="px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center shadow-xl backdrop-blur-md md:p-12">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
          Contact
        </p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">{contact.heading}</h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">{contact.message}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
