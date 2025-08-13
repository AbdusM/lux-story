"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Sparkles } from "lucide-react"

interface CharacterIntroProps {
  onStart: () => void
}

export function CharacterIntro({ onStart }: CharacterIntroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🦥</span>
          </div>
          <CardTitle className="text-2xl">Lux</CardTitle>
          <CardDescription className="text-lg">The Meditative Sloth</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            "mm... Wisdom moves slowly but arrives with certainty"
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Meditation</p>
                <p className="text-sm text-muted-foreground">
                  Restore energy through breathing exercises
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Third Eye</p>
                <p className="text-sm text-muted-foreground">
                  See hidden truths in the network
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Kinetic Vortex</p>
                <p className="text-sm text-muted-foreground">
                  Channel energy to solve crisis moments
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onStart}
            className="w-full" 
            size="lg"
          >
            Begin Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}