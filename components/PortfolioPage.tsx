"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import type {
  ContactContent,
  Experience as ExperienceType,
  Profile,
  Project,
  SkillGroup,
} from "@/lib/types/project";

const ScrollScene = dynamic(
  () => import("@/components/three/ScrollScene").then((m) => m.ScrollScene),
  { ssr: false }
);

export function PortfolioPage({
  projects,
  profile,
  skillGroups,
  experiences,
  contact,
}: {
  projects: Project[];
  profile: Profile;
  skillGroups: SkillGroup[];
  experiences: ExperienceType[];
  contact: ContactContent;
}) {
  return (
    <SmoothScroll>
      <ScrollScene />
      <Navbar profile={profile} />
      <main className="relative text-white">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skillGroups={skillGroups} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Contact profile={profile} contact={contact} />
        <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js & React Three Fiber.
        </footer>
      </main>
    </SmoothScroll>
  );
}
