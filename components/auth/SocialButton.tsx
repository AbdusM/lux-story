'use client'

import { Github } from 'lucide-react'
import { cn } from '@/lib/utils'

type SocialProvider = 'discord' | 'github' | 'linkedin' | 'twitch'

interface SocialButtonProps {
  provider: SocialProvider
  disabled?: boolean
  onClick?: () => void
}

// Brand SVG Icons
const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitchIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
)

// Provider metadata
const providerConfig: Record<SocialProvider, {
  name: string
  icon: React.ReactNode
  bgColor: string
  borderColor: string
  bgHover: string
}> = {
  discord: {
    name: 'Discord',
    icon: <DiscordIcon />,
    bgColor: 'bg-[#5865F2]/20',
    borderColor: 'border-[#5865F2]/30',
    bgHover: 'hover:bg-[#5865F2]/30',
  },
  github: {
    name: 'GitHub',
    icon: <Github className="w-5 h-5" />,
    bgColor: 'bg-[#24292e]/20',
    borderColor: 'border-[#24292e]/30',
    bgHover: 'hover:bg-[#24292e]/30',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: <LinkedInIcon />,
    bgColor: 'bg-[#0A66C2]/20',
    borderColor: 'border-[#0A66C2]/30',
    bgHover: 'hover:bg-[#0A66C2]/30',
  },
  twitch: {
    name: 'Twitch',
    icon: <TwitchIcon />,
    bgColor: 'bg-[#9146FF]/20',
    borderColor: 'border-[#9146FF]/30',
    bgHover: 'hover:bg-[#9146FF]/30',
  },
}

export function SocialButton({ provider, disabled = false, onClick }: SocialButtonProps) {
  const config = providerConfig[provider]

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={disabled ? `${config.name} login coming soon! Currently available: Google` : `Sign in with ${config.name}`}
      className={cn(
        // Layout & sizing
        'flex items-center justify-center gap-2',
        'w-full min-h-[44px] px-4 py-3',
        'rounded-lg border transition-all duration-200',

        // Typography
        'text-white text-sm font-medium',

        // Brand-specific colors
        config.bgColor,
        config.borderColor,
        !disabled && config.bgHover,

        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',

        // Focus state (accessibility)
        'focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900'
      )}
      aria-label={`Sign in with ${config.name}${disabled ? ' (coming soon)' : ''}`}
    >
      {config.icon}
      <span className="sr-only">{config.name} login</span>
    </button>
  )
}
