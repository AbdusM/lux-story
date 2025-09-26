"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  platform?: "healthcare" | "technology" | "engineering" | "sustainability"
  character?: "samuel" | "maya" | "devon" | "jordan" | "you"
  variant?: "default" | "dialogue" | "narration" | "choice"
  glow?: boolean
  animated?: boolean
}

const platformStyles = {
  healthcare: "border-green-500/20 bg-green-50/5 dark:bg-green-950/10",
  technology: "border-purple-500/20 bg-purple-50/5 dark:bg-purple-950/10",
  engineering: "border-orange-500/20 bg-orange-50/5 dark:bg-orange-950/10",
  sustainability: "border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/10",
}

const characterStyles = {
  samuel: "border-amber-500/20",
  maya: "border-blue-500/20",
  devon: "border-orange-500/20",
  jordan: "border-purple-500/20",
  you: "border-emerald-500/20",
}

const variantStyles = {
  default: "",
  dialogue: "shadow-lg",
  narration: "border-0 bg-transparent shadow-none",
  choice: "hover:shadow-xl transition-all duration-200",
}

export const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
  ({ className, children, platform, character, variant = "default", glow, animated, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border-2 transition-colors duration-300",
          platform && platformStyles[platform],
          character && characterStyles[character],
          variantStyles[variant],
          glow && "shadow-lg shadow-primary/20",
          animated && "animate-in fade-in slide-in-from-bottom-4 duration-700",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    )
  }
)

GameCard.displayName = "GameCard"

// Compound components for easier usage
export const GameCardHeader = CardHeader
export const GameCardContent = CardContent
export const GameCardTitle = CardTitle
export const GameCardDescription = CardDescription