import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { GLASS_BUTTON } from "@/lib/ui-constants"
import { hapticFeedback } from "@/lib/haptic-feedback"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        "ghost-dark": "text-slate-200 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 transition-all duration-200",
        glass: GLASS_BUTTON,  // From lib/ui-constants.ts - single source of truth for glass styling
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",  // Agent 8: Changed from h-10 to h-11 (44px touch target)
        sm: "h-10 rounded-md px-3",  // Agent 8: Changed from h-9 to h-10 (40px - acceptable for sm)
        lg: "h-12 rounded-md px-8",  // Agent 8: Changed from h-11 to h-12 (48px)
        icon: "h-11 w-11",           // Agent 8: Changed from h-10 to h-11 (44px)
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Disable haptic feedback for this button */
  noHaptic?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, noHaptic = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Wrap onClick to add haptic feedback
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!noHaptic) {
          hapticFeedback.light()
        }
        onClick?.(e)
      },
      [noHaptic, onClick]
    )

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }