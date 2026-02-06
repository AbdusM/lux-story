# Development Guide

## Setup
1. Install dependencies: `npm install`
2. Configure environment variables (see `.env.example`)
3. Set up Supabase connection (optional for local-only gameplay)
4. Run development server: `npm run dev` (defaults to port 3005)

## Testing
- Typecheck: `npm run type-check`
- Unit/integration tests (Vitest): `npm run test:run`
- E2E tests (Playwright): `npm run test:e2e`
- Full verification: `npm run verify`

## Deployment
- Production (Vercel): `npm run deploy`
- Legacy static export (Cloudflare Pages): `npm run deploy:cloudflare:legacy` (may not work with API routes)

*Detailed procedures preserved in docs/archive/*
