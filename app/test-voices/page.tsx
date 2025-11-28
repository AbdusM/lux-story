
"use client"

import { StoryMessage } from "@/components/StoryMessage"
import { DialogueDisplay } from "@/components/DialogueDisplay"
import { CharacterAvatar } from "@/components/CharacterAvatar"

export default function TestVoicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 space-y-12 max-w-4xl mx-auto">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Voice & Effect Verification</h1>
        <p className="text-slate-600 dark:text-slate-400">Testing typographic personalities and text effects.</p>
      </header>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold border-b pb-2">1. Character Voices (Typography)</h2>
        
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Samuel (Serif, Warm, Station Keeper)</p>
          <StoryMessage 
            speaker="Samuel" 
            text="Welcome to Grand Central Terminus. The trains run on time, but the passengers... they run on stories." 
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-500">Maya (Sans, Clean, Scientific)</p>
          <StoryMessage 
            speaker="Maya" 
            text="The data indicates a 98% probability of success. We just need to calibrate the instruments." 
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-500">Devon (Slab, Strong, Construction)</p>
          <StoryMessage 
            speaker="Devon" 
            text="Foundation looks solid. I can build anything on this bedrock. Just give me the tools." 
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-500">Kai (Mono, Tech, Intense)</p>
          <StoryMessage 
            speaker="Kai" 
            text="System interrupt. I'm seeing ghost data in the stream. Who authorized this access?" 
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-500">System (Mono, Terminal-style)</p>
          <StoryMessage 
            speaker="System" 
            text="INITIALIZING... CONNECTION ESTABLISHED. UPLOAD COMPLETE." 
            type="narration"
          />
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold border-b pb-2">2. Text Interactions</h2>
        
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Glitch Effect</h3>
          <DialogueDisplay 
            text="The system is <glitch>CORRUPTED</glitch>. Please <glitch>RESET</glitch> immediately." 
            richEffects={{ mode: 'static' }}
          />
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Shake & Jitter</h3>
          <DialogueDisplay 
            text="I'm <shake>shaking</shake> with fear! And now I'm <jitter>jittery</jitter> with caffeine!" 
            richEffects={{ mode: 'static' }}
          />
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Bloom (Glowing)</h3>
          <DialogueDisplay 
            text="I have a <bloom>brilliant</bloom> idea." 
            richEffects={{ mode: 'static' }}
          />
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold border-b pb-2">3. Reactive Portraits</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold">Maya (Happy)</span>
                <CharacterAvatar characterName="Maya" size="xl" emotion="happy" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold">Samuel (Concerned)</span>
                <CharacterAvatar characterName="Samuel" size="xl" emotion="concerned" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold">Devon (Angry)</span>
                <CharacterAvatar characterName="Devon" size="xl" emotion="angry" />
            </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold">Kai (Surprised)</span>
                <CharacterAvatar characterName="Kai" size="xl" emotion="surprised" />
            </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold">Samuel (Trust 2/10)</span>
                <CharacterAvatar characterName="Samuel" size="xl" trustLevel={2} />
            </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold">Samuel (Trust 9/10)</span>
                <CharacterAvatar characterName="Samuel" size="xl" trustLevel={9} />
            </div>
        </div>
      </section>
    </div>
  )
}
