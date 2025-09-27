"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingDotsProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  className,
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2"
  }

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn(
            sizeClasses[size],
            "bg-slate-400 rounded-full animate-pulse"
          )}
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: "1.4s"
          }}
        />
      ))}
    </div>
  )
}