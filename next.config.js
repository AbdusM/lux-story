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
  // Re-enable ESLint for security
  eslint: {
    ignoreDuringBuilds: false
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@/hooks', '@/lib', '@/components']
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          hooks: {
            test: /[\\/]hooks[\\/]/,
            name: 'hooks',
            priority: 10,
            chunks: 'all',
          },
          lib: {
            test: /[\\/]lib[\\/]/,
            name: 'lib',
            priority: 10,
            chunks: 'all',
          }
        }
      }
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

export default nextConfig