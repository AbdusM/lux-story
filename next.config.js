/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment-specific configuration
  ...(process.env.NODE_ENV === 'production' && {
    // Enable static export for Cloudflare Pages (production only)
    output: 'export',
    trailingSlash: true,
  }),

  images: {
    unoptimized: true
  },

  // Ensure clean asset URLs
  basePath: '',

  // Temporarily disable ESLint for legacy components during Phase 2 testing
  eslint: {
    ignoreDuringBuilds: true
  },

  // Disable TypeScript checking during builds for legacy scripts
  typescript: {
    ignoreBuildErrors: true
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@/hooks', '@/lib', '@/components']
  },

  // Temporarily disable custom webpack config to fix runtime errors
  // webpack: (config, { isServer }) => {
  //   // Optimize bundle splitting
  //   if (!isServer) {
  //     config.optimization.splitChunks = {
  //       chunks: 'all',
  //       cacheGroups: {
  //         default: {
  //           minChunks: 2,
  //           priority: -20,
  //           reuseExistingChunk: true,
  //         },
  //         vendor: {
  //           test: /[\\/]node_modules[\\/]/,
  //           name: 'vendors',
  //           priority: -10,
  //           chunks: 'all',
  //         },
  //         hooks: {
  //           test: /[\\/]hooks[\\/]/,
  //           name: 'hooks',
  //           priority: 10,
  //           chunks: 'all',
  //         },
  //         lib: {
  //           test: /[\\/]lib[\\/]/,
  //           name: 'lib',
  //           priority: 10,
  //           chunks: 'all',
  //         }
  //       }
  //     }
  //   }
  //   return config
  // },

  // Security headers only for development server (not compatible with static export)
  ...(process.env.NODE_ENV !== 'production' && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self';"
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
  })
}

export default nextConfig