import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css", // Include CSS files for better purging
  ],
  // Add safelist for dynamically generated classes that are actually used
  safelist: [
    // Character glow effects
    'lux-text-glow',
    'swift-text-glow',
    'sage-text-glow',
    'buzz-text-glow',
    // Apple design system classes that need to be preserved
    'apple-container',
    'apple-loading',
    'grand-central-terminus',
  ],
  theme: {
    extend: {
      // Responsive Breakpoints
      screens: {
        xs: '400px',   // Small phone breakpoint for container sizing
      },

      // Design System Colors
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Game-Specific Character Colors
        lux: {
          DEFAULT: "#a855f7", // Purple-500
          light: "#e9d5ff",   // Purple-200
          dark: "#581c87",    // Purple-900
          glow: "rgba(168, 85, 247, 0.4)",
        },
        swift: {
          DEFAULT: "#4ade80", // Green-400
          light: "#bbf7d0",   // Green-200
          dark: "#14532d",    // Green-900
          glow: "rgba(74, 222, 128, 0.4)",
        },
        sage: {
          DEFAULT: "#3b82f6", // Blue-500
          light: "#bfdbfe",   // Blue-200
          dark: "#1e3a8a",    // Blue-900
          glow: "rgba(59, 130, 246, 0.4)",
        },
        buzz: {
          DEFAULT: "#facc15", // Yellow-400
          light: "#fef3c7",   // Yellow-100
          dark: "#713f12",    // Yellow-900
          glow: "rgba(250, 204, 21, 0.4)",
        },
      },

      // Design System Spacing
      spacing: {
        // Game-specific spacing scale
        'game-xs': '0.375rem',  // 6px
        'game-sm': '0.75rem',   // 12px
        'game-md': '1.5rem',    // 24px
        'game-lg': '3rem',      // 48px
        'game-xl': '4.5rem',    // 72px
        'game-2xl': '6rem',     // 96px

        // Component-specific spacing
        'card-padding': '1.5rem',
        'button-padding-x': '1.25rem',
        'button-padding-y': '0.625rem',
        'message-gap': '1rem',
        'scene-gap': '2rem',
      },

      // Typography Scale
      fontSize: {
        // Game text sizes
        'narration': ['1.125rem', { lineHeight: '2', letterSpacing: '0.05em' }],
        'dialogue': ['1rem', { lineHeight: '1.625', letterSpacing: '0.025em' }],
        'choice': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'hud': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }], // 10px
        '3xs': ['0.5rem', { lineHeight: '0.625rem' }], // 8px
        'celebration': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0' }],
      },

      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-crimson-pro)", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        slab: ["var(--font-roboto-slab)", "serif"],
      },

      // Component Heights/Widths
      height: {
        'game-panel': '400px',
        'message-area': '50vh',
        'meditation-circle': '10rem',
        'companion': '5rem',
      },

      width: {
        'game-container': '48rem', // max-w-3xl equivalent
        'meditation-circle': '10rem',
        'companion': '5rem',
      },

      // Border Radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'game': '0.75rem',
        'button': '0.5rem',
        'card': '1rem',
      },

      // Animation Durations (matching animations.css)
      transitionDuration: {
        'instant': '100ms',
        'quick': '200ms',
        'medium': '300ms',
        'slow': '600ms',
        'slower': '1000ms',
        'slowest': '2000ms',
      },

      // Animation Timing Functions
      transitionTimingFunction: {
        'game': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      // Box Shadows
      boxShadow: {
        'game-sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'game-md': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'game-lg': '0 8px 16px rgba(0, 0, 0, 0.2)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
        'glow-green': '0 0 20px rgba(74, 222, 128, 0.4)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-yellow': '0 0 20px rgba(250, 204, 21, 0.4)',
        'pokemon': 'inset 2px 2px 0 rgba(255, 255, 255, 0.8), inset -2px -2px 0 rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)',
      },

      // Backdrop Filters
      backdropBlur: {
        'game': '8px',
      },

      // Z-Index Scale
      zIndex: {
        'behind': '-1',
        'hud': '40',
        'modal': '50', // Legacy, keeping for safety
        'celebration': '60',
        'tooltip': '70',
        // New Semantic Layers
        'dropdown': '90',
        'sticky': '100', // Headers, Nav
        'overlay': '110', // Backdrops
        'modal-content': '120', // The actual modal dialog
        'popover': '200',
        'toast': '300',
        'cursor': '999',
      },

      // Game-specific animations
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'platform-pulse': 'resonant-platform 2s ease-in-out infinite',
        'time-slow': 'time-slow 2s linear infinite',
        'helping-aura': 'helping-aura 5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
      },

      // Keyframes for animations
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'resonant-platform': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.01)' },
        },
        'time-slow': {
          '0%': { filter: 'brightness(1) saturate(1)' },
          '50%': { filter: 'brightness(1.1) saturate(1.2)' },
          '100%': { filter: 'brightness(1) saturate(1)' },
        },
        'helping-aura': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(74, 222, 128, 0.6)' },
        },
        'glow-pulse': {
          '0%, 100%': { textShadow: '0 0 20px currentColor' },
          '50%': { textShadow: '0 0 40px currentColor, 0 0 60px currentColor' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'beckon': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(251, 191, 36, 0.2)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 25px rgba(251, 191, 36, 0.5)', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;