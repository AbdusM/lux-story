import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const typographyVariants = cva("", {
  variants: {
    variant: {
      // Headings
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",

      // Body text
      body: "leading-7",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",

      // Game-specific variants
      narrator: "text-base italic text-slate-600 dark:text-slate-300 leading-relaxed",
      dialogue: "text-base leading-relaxed",
      whisper: "text-sm italic opacity-75",
      caption: "text-sm text-muted-foreground",

      // UI text
      button: "text-sm font-medium",
      label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",

      // Special
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
    },

    font: {
      default: "",
      narrative: "font-serif", // Will use Crimson Pro when configured
      dialogue: "font-serif",  // Will use Source Serif Pro when configured
      ui: "font-sans",
      mono: "font-mono",
    },

    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },

    color: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",

      // Character-specific colors (Birmingham theme)
      samuel: "text-amber-700 dark:text-amber-300",
      maya: "text-blue-600 dark:text-blue-400",
      devon: "text-orange-600 dark:text-orange-400",
      jordan: "text-purple-600 dark:text-purple-400",
      you: "text-emerald-600 dark:text-emerald-400",
    }
  },
  defaultVariants: {
    variant: "body",
    font: "default",
    align: "left",
    color: "default",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "blockquote" | "code" | "pre" | "label"
  children?: React.ReactNode
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, font, align, color, as, children, ...props }, ref) => {
    // Determine the component to render based on variant or as prop
    const Component = as || getComponentFromVariant(variant) || "p"

    return React.createElement(
      Component,
      {
        className: cn(
          typographyVariants({ variant, font, align, color }),
          className
        ),
        ref,
        ...props,
      },
      children
    )
  }
)

Typography.displayName = "Typography"

// Helper function to determine HTML element from variant
function getComponentFromVariant(
  variant?: string | null
): "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "code" | "span" | "div" {
  switch (variant) {
    case "h1":
      return "h1"
    case "h2":
      return "h2"
    case "h3":
      return "h3"
    case "h4":
      return "h4"
    case "blockquote":
      return "blockquote"
    case "code":
      return "code"
    case "label":
      return "span"
    default:
      return "p"
  }
}

export { Typography, typographyVariants }