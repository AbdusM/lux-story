# Deployment Guide

## Quick Deploy

### Cloudflare Pages (Recommended)

```bash
# One-command deploy
npm run deploy
```

This will:
1. Build the static export
2. Deploy to Cloudflare Pages
3. Provide you with a URL

## Deployment Options

### Option 1: Cloudflare Pages (Primary)

#### Initial Setup
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
npx wrangler login

# Create project (first time only)
npx wrangler pages project create lux-story
```

#### Deploy
```bash
# Build
npm run build

# Deploy to production
npx wrangler pages deploy out --project-name=lux-story

# Deploy to specific branch
npx wrangler pages deploy out \
  --project-name=lux-story \
  --branch=career-exploration-birmingham
```

#### URLs
- Production: `https://lux-story.pages.dev`
- Branch: `https://[branch-name].lux-story.pages.dev`
- Preview: `https://[deployment-id].lux-story.pages.dev`

### Option 2: Vercel

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

#### Deploy
```bash
# Build and deploy
vercel

# Production deploy
vercel --prod
```

### Option 3: Netlify

#### Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login
```

#### Deploy
```bash
# Build locally
npm run build

# Deploy
netlify deploy --dir=out

# Production deploy
netlify deploy --dir=out --prod
```

### Option 4: GitHub Pages

#### Setup
1. Enable GitHub Pages in repository settings
2. Set source to `gh-pages` branch

#### Deploy
```bash
# Build
npm run build

# Push to gh-pages branch
git subtree push --prefix out origin gh-pages
```

### Option 5: Self-Hosted

#### Requirements
- Node.js 18+
- PM2 or similar process manager
- Nginx or Apache for reverse proxy

#### Steps
```bash
# On your server
git clone https://github.com/AbdusM/lux-story.git
cd lux-story
npm install
npm run build

# Serve with PM2
pm2 serve out 3000 --spa

# Or with nginx
# Copy out/ contents to /var/www/lux-story
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/lux-story;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Environment Variables

### Development
Create `.env.local`:
```bash
# Optional debug flags
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_SHOW_METRICS=false
```

### Production
Set in your hosting provider's dashboard:
```bash
# No required variables for basic deployment
# All configuration is client-side
```

## Build Configuration

### next.config.js
```javascript
{
  output: 'export',        // Required for static hosting
  images: {
    unoptimized: true     // Required for static export
  },
  trailingSlash: true     // Recommended for most hosts
}
```

## Pre-Deployment Checklist

- [ ] Run `npm run build` locally
- [ ] Test production build: `npx serve out`
- [ ] Clear browser cache and test
- [ ] Check all routes work
- [ ] Verify localStorage persistence
- [ ] Test on mobile devices
- [ ] Check performance metrics
- [ ] Validate no console errors

## Post-Deployment

### Verify Deployment
```bash
# Check if site is live
curl -I https://your-deployment-url.com

# Test key features
- Character intro loads
- Choices work
- State persists on refresh
- Performance adaptations trigger
```

### Monitor Performance
- Use Lighthouse for performance audit
- Check Core Web Vitals
- Monitor bundle size (should be < 200KB)
- Verify no 404s in console

## Rollback Procedure

### Cloudflare Pages
```bash
# List deployments
npx wrangler pages deployment list --project-name=lux-story

# Rollback to previous
npx wrangler pages deployment rollback --project-name=lux-story
```

### Git-based Rollback
```bash
# Find previous working commit
git log --oneline

# Reset to that commit
git reset --hard [commit-hash]

# Force push (careful!)
git push --force origin [branch-name]
```

## Custom Domain Setup

### Cloudflare Pages
1. Go to Pages project settings
2. Custom domains → Add domain
3. Follow DNS configuration steps

### DNS Records
```
Type: CNAME
Name: @
Value: lux-story.pages.dev
```

Or for subdomain:
```
Type: CNAME
Name: play
Value: lux-story.pages.dev
```

## Troubleshooting

### Build Fails
```bash
# Clear all caches
npm run clean
rm -rf node_modules
npm install
npm run build
```

### 404 Errors
- Ensure `trailingSlash: true` in next.config.js
- Check `output: 'export'` is set
- Verify all routes are static

### Blank Page
- Check browser console for errors
- Verify JavaScript is enabled
- Clear browser cache
- Check CSP headers

### Performance Issues
- Enable Cloudflare caching
- Compress assets
- Use CDN for global distribution
- Minimize bundle size

## CI/CD Setup

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main, career-exploration-birmingham]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - run: npm ci
      - run: npm run build
      
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy out --project-name=lux-story
```

## Security Considerations

### Headers
Add security headers in Cloudflare:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### CSP Policy
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self' data:;
```

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/AbdusM/lux-story/issues)
- Review [Cloudflare Pages docs](https://developers.cloudflare.com/pages)
- Contact the maintainers

---

*Last Updated: January 2025*