# Deployment Checklist (Vercel + Supabase)

This repo ships as a Next.js App Router app with API routes under `app/api`, so **static export (`out/`) is not the production path**.

## Pre-Deploy

1. Confirm local verification is green:
   - `npm run verify`
2. Confirm required environment variables exist in Vercel (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_API_TOKEN`
   - (Optional) `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`
3. If you changed Supabase schema:
   - Apply migrations in Supabase (see `supabase/migrations/`).
4. (Optional) Admin smoke check:
   - `npm run verify:admin` (or `npm run verify:admin:prod`)

## Deploy

1. Deploy to production (runs `predeploy`: env validation, tests, build):
   - `npm run deploy`

## Post-Deploy Smoke Tests

1. Health endpoints:
   - `GET /api/health`
   - `GET /api/health/db` (will be unhealthy if Supabase env vars are missing/misconfigured)
2. Admin access:
   - Load `/admin` and verify auth gate works
   - Verify `/admin/users` populates
3. Core gameplay:
   - Load `/` and verify first-run flow (Atmospheric Intro → first dialogue) works

## Rollback

Use the Vercel dashboard to promote a previous deployment to production.

## Legacy Cloudflare Pages (Static Export)

There is a legacy command `npm run deploy:cloudflare:legacy` that assumes an `out/` static export. It is not compatible with App Router API routes and is kept only for historical reference.

