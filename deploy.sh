#!/bin/bash

# Lux Story - Cloudflare Pages Deployment Script

echo "🦥 Starting Lux Story deployment to Cloudflare Pages..."

# Build the Next.js app for production with static export
echo "📦 Building Next.js app..."
npm run build

# Create out directory for static export if using Next.js 13+
echo "📁 Creating static export..."
npx next export

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Build failed - no 'out' directory found"
    echo "💡 Trying alternative build approach..."
    
    # For Next.js 13+ with app directory, we need to configure static export
    echo "Updating next.config.js for static export..."
    exit 1
fi

# Deploy to Cloudflare Pages
echo "☁️ Deploying to Cloudflare Pages..."
npx wrangler pages deploy out --project-name=lux-story --compatibility-date=2024-08-10

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://lux-story.pages.dev"
echo ""
echo "💡 First deployment? You may need to:"
echo "   1. Log in with: npx wrangler login"
echo "   2. Create the project first: npx wrangler pages project create lux-story"