# System Stack Context

Date: March 3, 2026
Project: `lux-story`

## Frontend

- Framework: Next.js `^15.5.7`
- UI: React `^19.1.1`, React DOM `^19.1.1`
- Language: TypeScript `^5.9.2`
- Styling: Tailwind CSS `^3.4.17`, CSS variables in `app/globals.css`
- Component primitives: Radix UI packages (`@radix-ui/react-*`), shadcn-style composition patterns
- Motion: Framer Motion `^12.23.24`
- Client state: Zustand `^5.0.8` + local component state

## Backend / Runtime

- Server model: Next.js App Router + Route Handlers under `app/api/*`
- Data/Auth: Supabase (`@supabase/supabase-js` `^2.58.0`)
- AI integrations:
  - Gemini via `@google/generative-ai` `^0.24.1`
  - Anthropic via `@anthropic-ai/sdk` `^0.65.0`
- Monitoring: Sentry (`@sentry/nextjs` `^10.17.0`)

## Testing

- Unit/integration: Vitest `^3.2.4`
- E2E: Playwright `^1.56.1`
- CI workflows include both test/build and segmented Playwright jobs.

## Deploy

- Deploy target/scripts: Vercel (`npm run deploy:vercel` -> `vercel --prod`)
- CI: GitHub Actions workflows in `.github/workflows/`

