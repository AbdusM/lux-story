"use client"

import { useState } from "react"
import { Typography } from "@/components/ui/typography"
import { GameCard, GameCardHeader, GameCardContent, GameCardTitle } from "@/components/game/game-card"
import { GameChoice, GameChoiceGroup } from "@/components/game/game-choice"
import { GameMessage } from "@/components/game/game-message"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ShadcnPreview() {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showTypewriter, setShowTypewriter] = useState(false)

  const sampleChoices = [
    { text: "Explore Platform 1: The Care Line", pattern: "helping" as const, consequence: "healthcare" },
    { text: "Visit Platform 7: The Data Stream", pattern: "analytical" as const, consequence: "technology" },
    { text: "Check Platform 3: The Builder's Track", pattern: "building" as const, consequence: "engineering" },
    { text: "Find the Station Keeper for guidance", pattern: "patience" as const, consequence: "exploring" }
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Typography variant="h1" className="mb-2">
            shadcn Component Preview
          </Typography>
          <Typography variant="muted">
            Testing new shadcn-based game components
          </Typography>
        </div>

        <Separator />

        {/* Typography Examples */}
        <GameCard>
          <GameCardHeader>
            <GameCardTitle>Typography Component</GameCardTitle>
          </GameCardHeader>
          <GameCardContent className="space-y-4">
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="narrator">
              This is narrator text with italic styling for scene descriptions.
            </Typography>
            <Typography variant="dialogue" font="dialogue">
              &quot;This is dialogue text with special font family for character speech.&quot;
            </Typography>
            <Typography variant="whisper">
              *whispered text with reduced opacity*
            </Typography>
            <div className="flex gap-4">
              <Typography color="samuel">Samuel</Typography>
              <Typography color="maya">Maya</Typography>
              <Typography color="devon">Devon</Typography>
              <Typography color="jordan">Jordan</Typography>
              <Typography color="you">You</Typography>
            </div>
          </GameCardContent>
        </GameCard>

        <Separator />

        {/* Game Card Examples */}
        <div className="grid grid-cols-2 gap-4">
          <GameCard platform="healthcare" animated>
            <GameCardHeader>
              <GameCardTitle>Healthcare Platform</GameCardTitle>
            </GameCardHeader>
            <GameCardContent>
              <Typography variant="small" className="text-muted-foreground">
                Platform 1: The Care Line - Green themed
              </Typography>
            </GameCardContent>
          </GameCard>

          <GameCard platform="technology" animated>
            <GameCardHeader>
              <GameCardTitle>Technology Platform</GameCardTitle>
            </GameCardHeader>
            <GameCardContent>
              <Typography variant="small" className="text-muted-foreground">
                Platform 7: The Data Stream - Purple themed
              </Typography>
            </GameCardContent>
          </GameCard>
        </div>

        <Separator />

        {/* Game Choices */}
        <GameCard>
          <GameCardHeader>
            <GameCardTitle>Game Choices Component</GameCardTitle>
          </GameCardHeader>
          <GameCardContent>
            <GameChoiceGroup>
              {sampleChoices.map((choice, index) => (
                <GameChoice
                  key={index}
                  choice={choice}
                  index={index}
                  isSelected={selectedChoice === index}
                  onSelect={() => setSelectedChoice(index)}
                  animated
                />
              ))}
            </GameChoiceGroup>
            {selectedChoice !== null && (
              <div className="mt-4 p-3 bg-muted rounded">
                <Typography variant="small">
                  Selected: {sampleChoices[selectedChoice].text}
                </Typography>
              </div>
            )}
          </GameCardContent>
        </GameCard>

        <Separator />

        {/* Game Messages */}
        <GameCard>
          <GameCardHeader>
            <GameCardTitle>Game Messages</GameCardTitle>
            <Button
              onClick={() => setShowTypewriter(!showTypewriter)}
              variant="outline"
              size="sm"
            >
              Toggle Typewriter: {showTypewriter ? "ON" : "OFF"}
            </Button>
          </GameCardHeader>
          <GameCardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <GameMessage
                  speaker="narrator"
                  text="Grand Central Terminus stretches before you, vast and alive with possibility."
                  type="narration"
                />

                <GameMessage
                  speaker="Samuel Washington (Station Keeper)"
                  text="Welcome to Grand Central. It seems your train has yet to arrive on the platform. That's quite alright, young traveler."
                  type="dialogue"
                  typewriter={showTypewriter}
                />

                <GameMessage
                  speaker="Maya Chen (Pre-med Student)"
                  text="I got a 524 on the MCAT but I dream in ***circuit boards***."
                  type="dialogue"
                  typewriter={showTypewriter}
                />

                <GameMessage
                  speaker="You"
                  text="I don't feel brave. I feel like everyone else knows what they're doing except me."
                  type="dialogue"
                />

                <GameMessage
                  speaker="Inner Voice"
                  text="*Perhaps the answer isn't in rushing forward, but in understanding where you stand.*"
                  type="whisper"
                />
              </div>
            </ScrollArea>
          </GameCardContent>
        </GameCard>

        <Separator />

        {/* Platform-specific Cards */}
        <div className="space-y-4">
          <Typography variant="h3">Character Cards</Typography>
          {(["samuel", "maya", "devon", "jordan", "you"] as const).map(character => (
            <GameCard
              key={character}
              character={character}
              variant="dialogue"
              animated
            >
              <GameCardContent>
                <Typography variant="h4" className="capitalize mb-2">
                  {character}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Character-specific border and styling
                </Typography>
              </GameCardContent>
            </GameCard>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <Typography variant="muted">
            Open console and type: featureFlags.list() to see feature flag controls
          </Typography>
        </div>
      </div>
    </div>
  )
}