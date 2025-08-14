/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for Cloudflare Pages
  output: 'export',
  images: {
    unoptimized: true
  },
  // Use trailing slash only for production (Cloudflare Pages)
  trailingSlash: process.env.NODE_ENV === 'production',
  // Ensure clean asset URLs
  basePath: '',
}

module.exports = nextConfig