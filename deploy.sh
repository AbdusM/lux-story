#!/bin/bash

set -euo pipefail

# Lux Story - Vercel Deployment Script
#
# Rationale:
# - This repo contains Next.js App Router API routes under app/api.
# - Static export (out/) is intentionally disabled (see scripts/validate-build-config.cjs).
#
# For the legacy Cloudflare Pages static-export deploy command, use:
#   npm run deploy:cloudflare:legacy

echo "🦥 Starting Lux Story deployment to Vercel..."
echo "📦 Running predeploy checks + deploying..."
# `npm run deploy` automatically runs the `predeploy` hook first.
npm run deploy

echo "✅ Deployment complete!"
