# Kaif Anwar — 3D Interactive Portfolio

A scroll-driven 3D portfolio built with **Next.js**, **React Three Fiber**, and **Supabase**. Host on **GitHub** and deploy to **Vercel**.

## Features

- Scroll-driven 3D background with abstract geometry and stars
- Smooth scrolling via Lenis
- Sections: Hero, About, Skills, Experience, Projects, Contact
- Admin panel at `/admin` to create/edit projects and upload images & videos
- Supabase PostgreSQL and Storage
- Falls back to seeded CV content when Supabase is not configured

## Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- React Three Fiber + drei + Three.js
- Supabase (Database, Storage)
- Lenis + Framer Motion

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy [`.env.local.example`](.env.local.example) to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, for admin writes/uploads) |
| `ADMIN_EMAIL` | **Required** — only this email can access `/admin` |
| `ADMIN_PASSWORD` | **Required** — your admin login password |
| `ADMIN_SESSION_SECRET` | **Recommended** — random string for signing admin session cookies (32+ chars) |

Generate `ADMIN_SESSION_SECRET` in PowerShell:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**There are no default credentials in the source code.** Admin login only works when these variables are set.

`.env.local` is gitignored and never pushed to GitHub.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run (in order):
   - [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)
   - [`supabase/migrations/003_site_content.sql`](supabase/migrations/003_site_content.sql)
   - [`supabase/migrations/004_experience_contact.sql`](supabase/migrations/004_experience_contact.sql)
3. Go to **Storage** and create two **public** buckets: `project-images`, `project-videos`
4. Run [`supabase/migrations/002_storage.sql`](supabase/migrations/002_storage.sql)
5. (Optional) Seed CV data: `npm run seed`

## Admin Panel

### Credentials

Admin login uses **environment variables only** — not hardcoded in the repo.

| Where you run the app | Where secrets live |
|-----------------------|-------------------|
| Local (`npm run dev`) | [`.env.local`](.env.local) on your PC |
| Live (Vercel) | **Vercel → Settings → Environment Variables** |

`.env.local` does **not** travel to GitHub or Vercel automatically. For production, add the **same variable names and values** manually in the Vercel dashboard.

### Routes

- **Login:** `/admin/login`
- **Dashboard:** `/admin`
- **Edit about:** `/admin/about`
- **Edit technologies:** `/admin/skills`
- **Edit experience:** `/admin/experience`
- **Edit contact:** `/admin/contact`
- **New project:** `/admin/projects/new`
- **Edit project:** `/admin/projects/[id]/edit`

## Security

| Protection | How it works |
|------------|--------------|
| **No secrets in code** | `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and keys live only in env vars |
| **Login required** | Middleware redirects unauthenticated users away from `/admin` |
| **Email allowlist** | Only `ADMIN_EMAIL` can sign in |
| **Brute-force limit** | 5 failed logins → 15 minute lockout |
| **Server-only writes** | Admin saves use service role after session check |
| **Security headers** | X-Frame-Options, nosniff, referrer policy |

### What is safe to push to GitHub?

| Safe (gitignored or public by design) | Never commit |
|---------------------------------------|--------------|
| `.env.local.example` (placeholders only) | `.env.local` (real secrets) |
| Source code (no passwords in `.ts` files) | `SUPABASE_SERVICE_ROLE_KEY` |
| | `ADMIN_PASSWORD` |

A **private GitHub repo** hides your code from the public, but **Vercel Environment Variables** are what protect secrets on the live site — not repo visibility alone.

**Before going live:** use a strong unique `ADMIN_PASSWORD` and consider regenerating your Supabase `service_role` key if it was ever shared.

## Deploy to GitHub + Vercel

### GitHub (private repo recommended)

```bash
git init
git add .
git commit -m "Initial portfolio setup"
git branch -M main
git remote add origin https://github.com/Kaif-Anwar/my-portfolio.git
git push -u origin main
```

Verify `.env.local` is not tracked: `git status` should not list it.

### Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository (private repos work)
3. **Settings → Environment Variables** — add all 6 variables from `.env.local`:

| Variable | Exposed to browser? |
|----------|---------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (OK) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (OK — public key) |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** (server only) |
| `ADMIN_EMAIL` | **No** |
| `ADMIN_PASSWORD` | **No** |
| `ADMIN_SESSION_SECRET` | **No** |

4. Deploy — visit `https://your-site.vercel.app/admin/login` to sign in

Vercel auto-deploys on every push to `main`.

## Project Structure

```
app/                  # Pages (home, admin)
components/
  three/              # React Three Fiber scenes
  sections/           # Portfolio sections
  admin/              # Admin forms & uploaders
lib/
  supabase/           # Supabase clients & middleware
  seed.ts             # CV seed data
  actions/admin.ts    # Server actions
supabase/migrations/  # Database & storage SQL
```

## License

Private — personal portfolio.
