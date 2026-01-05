# Cloudflare Pages Deployment Instructions

## Environment Variables Required

Add these environment variables in the Cloudflare Pages dashboard:
**Settings > Environment Variables > Production**

⚠️ **SECURITY WARNING**: Never commit actual credentials to version control!

```
# Get these from your Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>

SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>

# Admin authentication token (generate with: openssl rand -base64 32)
ADMIN_API_TOKEN=<YOUR_SECURE_ADMIN_TOKEN>
```

## Build Configuration

In Cloudflare Pages dashboard:
**Settings > Builds & deployments**

```
Build command: npm run build
Build output directory: .next
Root directory: /
Node version: 18 (or higher)
```

## Important Notes

1. **Next.js + Cloudflare Pages Compatibility**
   - The app uses Next.js API routes which are supported via Cloudflare Functions
   - Static pages are pre-rendered, dynamic content loads client-side
   - API routes at `/api/*` are automatically deployed as Cloudflare Functions

2. **Admin Dashboard SSR Fix**
   - The admin page now properly handles server-side rendering
   - Shows loading state during initial mount
   - All data fetching happens client-side after mount
   - No more blank page issues in production

3. **Environment Variable Access**
   - `NEXT_PUBLIC_*` variables are inlined at build time
   - Server-side variables are available in API routes
   - Supabase client uses proxied access for security

## Deployment Steps

1. Push changes to your repository
2. Cloudflare Pages will auto-deploy on push (if connected to Git)
3. Or manually deploy:
   ```bash
   npm run build
   npm run deploy
   ```

## Troubleshooting

### Blank Admin Page
- **Cause**: Missing environment variables or SSR issues
- **Fix**: Ensure all environment variables are set in Cloudflare dashboard
- **Fix**: Clear build cache and redeploy

### API Routes Not Working
- **Cause**: Cloudflare Functions not properly configured
- **Fix**: Check that build output directory is `.next`
- **Fix**: Ensure Next.js config doesn't use `output: 'export'`

### Database Connection Issues
- **Cause**: RLS policies blocking access
- **Fix**: Use service role key for admin API routes
- **Fix**: Check Supabase RLS policies

## Verification

After deployment, verify:
1. Visit `/admin` - should show loading then dashboard
2. Visit `/` - game should load normally
3. Check browser console for errors
4. Test API routes: `/api/admin-proxy/urgency?limit=1`
