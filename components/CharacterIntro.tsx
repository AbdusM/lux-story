"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, TrendingUp } from "lucide-react"

interface CharacterIntroProps {
  onStart: () => void
  onContinue?: () => void
  hasSavedProgress?: boolean
}

export function CharacterIntro({ onStart, onContinue, hasSavedProgress }: CharacterIntroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 grand-central-terminus">
      <Card className="max-w-md w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🚂</span>
          </div>
          <CardTitle className="text-2xl">Terminus</CardTitle>
          <CardDescription className="text-lg">Career Exploration Platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground italic">
            &quot;Your future awaits at Platform 7. Midnight. Don&apos;t be late.&quot;
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Career Values Discovery</p>
                <p className="text-sm text-muted-foreground">
                  Explore what truly drives your career choices
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Birmingham Connections</p>
                <p className="text-sm text-muted-foreground">
                  Meet mentors and discover local opportunities
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Action Planning</p>
                <p className="text-sm text-muted-foreground">
                  Transform insights into practical next steps
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={onStart}
              className="w-full" 
              size="lg"
            >
              Begin New Journey
            </Button>
            {hasSavedProgress && onContinue && (
              <Button 
                onClick={onContinue}
                className="w-full" 
                size="lg"
                variant="outline"
              >
                Continue Journey
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}