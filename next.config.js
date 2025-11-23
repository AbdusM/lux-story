import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Vercel handles serverless functions automatically - no static export needed
  // (Removed output: 'export' to enable API routes in production)

  images: {
    unoptimized: true
  },

  // Ensure clean asset URLs
  basePath: '',

  // Fix workspace root warning - specify correct project directory
  outputFileTracingRoot: __dirname,

  // SYSTEMATIC FIX (Oct 17, 2025): Pragmatic validation approach
  // ESLint enabled, TypeScript warnings-only for logger type refactoring
  eslint: {
    ignoreDuringBuilds: false  // ✅ Re-enabled - catching real issues
  },

  // TypeScript: Strict type checking enabled ✅
  typescript: {
    ignoreBuildErrors: false  // ✅ All 162 type errors resolved
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@/hooks', '@/lib', '@/components'],
    serverActions: {
      bodySizeLimit: '2mb'  // Prevent DoS via large payloads
    }
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
              value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://api.dicebear.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://tavalvqcebosfxamuvlx.supabase.co;"
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