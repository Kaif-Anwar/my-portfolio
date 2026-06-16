# Vercel Deployment Guide

Follow these steps after the code is pushed to GitHub.

## 1. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Sign in with **GitHub**
3. If prompted, authorize Vercel to access **private** repositories
4. Import **`Kaif-Anwar/my-portfolio`**
5. Framework: **Next.js** (auto-detected)
6. Root directory: `./` (default)

## 2. Add environment variables

Before deploying (or immediately after import), go to **Environment Variables** and add **all 7** variables.

Copy the values from your local `.env.local` file (same names, same values).

| Variable | Environments to enable |
|----------|------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development |
| `ADMIN_EMAIL` | Production, Preview, Development |
| `ADMIN_PASSWORD` | Production, Preview, Development |
| `ADMIN_SESSION_SECRET` | Production, Preview, Development |

**Security rules:**
- Do **not** use `NEXT_PUBLIC_` prefix on secret keys
- Never paste these values into GitHub or commit them to the repo
- `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` are server-only

## 3. Deploy

Click **Deploy**. First build takes ~1–2 minutes.

## 4. Verify live site

1. Open your Vercel URL (e.g. `https://my-portfolio-xxx.vercel.app`)
2. Confirm homepage loads with projects from Supabase
3. Visit `/admin/login` and sign in with `ADMIN_EMAIL` + `ADMIN_PASSWORD`
4. Save a test edit in the admin panel

## 5. If you deployed without env vars first

Go to **Settings → Environment Variables**, add all 7 vars, then **Deployments → Redeploy** the latest deployment.

## Ongoing workflow

- Code change: `git push` → Vercel auto-redeploys
- Secret change: update in Vercel dashboard → Redeploy
- `.env.local` stays on your PC only — never push it to GitHub
