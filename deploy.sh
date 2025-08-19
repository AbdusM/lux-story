#!/bin/bash

# Lux Story - Cloudflare Pages Deployment Script

echo "🦥 Starting Lux Story deployment to Cloudflare Pages..."

# Build the Next.js app for production with static export
echo "📦 Building Next.js app..."
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Build failed - no 'out' directory found"
    exit 1
fi

# Deploy to Cloudflare Pages
echo "☁️ Deploying to Cloudflare Pages..."
npx wrangler pages deploy out --project-name=lux-story

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://lux-story.pages.dev"
echo ""
echo "💡 First deployment? You may need to:"
echo "   1. Log in with: npx wrangler login"
echo "   2. Create the project first: npx wrangler pages project create lux-story"