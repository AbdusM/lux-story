"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const gameChoiceVariants = cva(
  "w-full justify-start text-left p-4 h-auto transition-all duration-200 border-2 relative group",
  {
    variants: {
      variant: {
        default: "border-transparent hover:border-primary/50 hover:bg-accent/5",
        selected: "border-primary bg-primary/5 shadow-sm",
        disabled: "opacity-50 cursor-not-allowed",
        highlight: "border-amber-500/50 bg-amber-50/10 animate-pulse",
      },
      pattern: {
        helping: "hover:border-green-500/50 hover:bg-green-50/5",
        analytical: "hover:border-blue-500/50 hover:bg-blue-50/5",
        building: "hover:border-orange-500/50 hover:bg-orange-50/5",
        patience: "hover:border-purple-500/50 hover:bg-purple-50/5",
        exploring: "hover:border-emerald-500/50 hover:bg-emerald-50/5",
        default: "",
      },
      size: {
        default: "text-base",
        sm: "text-sm p-3",
        lg: "text-lg p-5",
      }
    },
    defaultVariants: {
      variant: "default",
      pattern: "default",
      size: "default",
    },
  }
)

export interface GameChoiceProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gameChoiceVariants> {
  choice: {
    text: string
    next?: string
    consequence?: string
    pattern?: "helping" | "analytical" | "building" | "patience" | "exploring"
  }
  onSelect?: () => void
  isSelected?: boolean
  index?: number
  showIcon?: boolean
  showIndex?: boolean
  animated?: boolean
}

const patternIcons: Record<string, string> = {
  helping: "❤️",
  analytical: "🧠",
  building: "🔨",
  patience: "⏳",
  exploring: "🗺️",
}

const GameChoice = React.forwardRef<HTMLButtonElement, GameChoiceProps>(
  ({
    className,
    choice,
    onSelect,
    isSelected,
    index = 0,
    showIcon = true,
    showIndex = true,
    animated = true,
    variant,
    pattern,
    size,
    disabled,
    ...props
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && onSelect) {
        // Add ripple effect
        const button = e.currentTarget
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const ripple = document.createElement("span")
        ripple.className = "absolute bg-primary/20 rounded-full animate-ping pointer-events-none"
        ripple.style.left = `${x}px`
        ripple.style.top = `${y}px`
        ripple.style.width = "20px"
        ripple.style.height = "20px"
        ripple.style.transform = "translate(-50%, -50%)"

        button.appendChild(ripple)
        setTimeout(() => ripple.remove(), 600)

        onSelect()
      }
    }

    const getIcon = () => {
      if (!showIcon && !showIndex) return null

      if (showIcon && choice.pattern && patternIcons[choice.pattern]) {
        return patternIcons[choice.pattern]
      }

      if (showIndex) {
        return `${index + 1}.`
      }

      return "→"
    }

    const icon = getIcon()
    const computedVariant = isSelected ? "selected" : (disabled ? "disabled" : variant)
    const computedPattern = choice.pattern || pattern

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          gameChoiceVariants({
            variant: computedVariant,
            pattern: computedPattern,
            size
          }),
          animated && "animate-in fade-in slide-in-from-left duration-500",
          className
        )}
        style={{
          animationDelay: animated ? `${index * 100}ms` : undefined,
        }}
        {...props}
      >
        {icon && (
          <span className={cn(
            "absolute left-4 text-muted-foreground transition-colors",
            "group-hover:text-primary",
            isSelected && "text-primary"
          )}>
            {icon}
          </span>
        )}
        <span className={icon ? "ml-8" : ""}>
          {choice.text}
        </span>
        {choice.consequence && (
          <span className="ml-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            ({choice.consequence})
          </span>
        )}
      </Button>
    )
  }
)

GameChoice.displayName = "GameChoice"

// Container component for choices
export const GameChoiceGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      role="group"
      aria-label="Story choices"
      {...props}
    >
      {children}
    </div>
  )
})

GameChoiceGroup.displayName = "GameChoiceGroup"

export { GameChoice, gameChoiceVariants }