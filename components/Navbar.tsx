import Link from "next/link";
import { PROFILE } from "@/lib/seed";
import type { Profile } from "@/lib/types/project";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({ profile = PROFILE }: { profile?: Profile }) {
  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-[#0a0a0f]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="text-sm font-semibold tracking-wide text-white">
          {profile.name}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Link
          href="/admin/login"
          className="text-xs text-slate-500 transition hover:text-slate-300"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
