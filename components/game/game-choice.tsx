"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { LoadingDots } from "@/components/ui/loading-dots"
import { cn } from "@/lib/utils"

export interface GameChoiceProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  choice: {
    text: string
    subtext?: string
    next?: string
    consequence?: string
    pattern?: "helping" | "analytical" | "building" | "patience" | "exploring"
  }
  onSelect?: () => void
  isSelected?: boolean
  loading?: boolean
  index?: number
  animated?: boolean
}

const GameChoice = React.forwardRef<HTMLButtonElement, GameChoiceProps>(
  ({
    className,
    choice,
    onSelect,
    isSelected,
    loading = false,
    index = 0,
    animated = true,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onSelect}
        disabled={disabled || loading || isSelected}
        className={cn(
          // Base styles - clean and minimal
          "w-full text-left",
          "px-4 py-3.5",
          "rounded-xl",
          "transition-all duration-200 ease-out",

          // Typography - optimal readability
          "text-[17px] leading-relaxed",
          "text-slate-900 dark:text-slate-100",
          "font-normal",

          // Interactive states - clear feedback
          "hover:bg-slate-50 dark:hover:bg-slate-800",
          "active:bg-slate-100 dark:active:bg-slate-700",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",

          // Selected state
          isSelected && "bg-slate-100 dark:bg-slate-800",

          // Disabled/Loading state
          (disabled || loading || isSelected) && "cursor-not-allowed",
          loading && "opacity-60",

          // Layout
          "flex items-center justify-between group",

          // Animation
          animated && "animate-in fade-in slide-in-from-bottom-2",

          className
        )}
        style={{
          animationDelay: animated ? `${index * 50}ms` : undefined,
          animationDuration: "200ms"
        }}
        {...props}
      >
        <div className="flex-1 pr-3">
          <div>{choice.text}</div>
          {choice.subtext && (
            <div className="text-[15px] text-slate-500 dark:text-slate-400 mt-0.5">
              {choice.subtext}
            </div>
          )}
        </div>

        {loading ? (
          <LoadingDots size="sm" className="mr-1" />
        ) : !isSelected && (
          <ChevronRight className={cn(
            "w-5 h-5 text-slate-300 dark:text-slate-600",
            "transition-all duration-200",
            "group-hover:text-slate-500 dark:group-hover:text-slate-400",
            "group-hover:translate-x-0.5"
          )} />
        )}
      </button>
    )
  }
)

GameChoice.displayName = "GameChoice"

// Container component for choices - minimal spacing
export const GameChoiceGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-3", className)}
      role="group"
      aria-label="Story choices"
      {...props}
    >
      {children}
    </div>
  )
})

GameChoiceGroup.displayName = "GameChoiceGroup"

export { GameChoice }