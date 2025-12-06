import { PixelAvatar } from '@/components/PixelAvatar'

export default function TestPixelsPage() {
  return (
    <div className="min-h-screen bg-stone-950 p-8">
      <h1 className="text-2xl font-bold text-stone-100 mb-8">Zootopia-Style Pixel Avatars</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg text-stone-400 mb-4">Size Comparison</h2>
          <div className="flex gap-8 items-end">
            <div className="text-center">
              <PixelAvatar animal="fox" size={32} />
              <p className="text-xs mt-2 text-stone-500">32px</p>
            </div>
            <div className="text-center">
              <PixelAvatar animal="fox" size={48} />
              <p className="text-xs mt-2 text-stone-500">48px</p>
            </div>
            <div className="text-center">
              <PixelAvatar animal="fox" size={64} />
              <p className="text-xs mt-2 text-stone-500">64px</p>
            </div>
            <div className="text-center">
              <PixelAvatar animal="fox" size={96} />
              <p className="text-xs mt-2 text-stone-500">96px</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg text-stone-400 mb-4">Character Styles</h2>
          <div className="flex gap-8">
            <div className="bg-stone-900 p-6 rounded-lg text-center">
              <PixelAvatar animal="fox" size={96} />
              <p className="text-stone-200 mt-3 font-medium">Devon - Fox</p>
              <p className="text-xs text-stone-500">Smug. Half-lidded.</p>
              <p className="text-xs text-stone-600 mt-1">Green shirt + tie</p>
            </div>
            <div className="bg-stone-900 p-6 rounded-lg text-center">
              <PixelAvatar animal="owl" size={96} />
              <p className="text-stone-200 mt-3 font-medium">Rohan - Owl</p>
              <p className="text-xs text-stone-500">Wide-eyed. Alert.</p>
              <p className="text-xs text-stone-600 mt-1">Blue suit + bowtie</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg text-stone-400 mb-4">All Characters</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="fox" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Devon</p>
              <p className="text-xs text-stone-500">Fox</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="owl" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Rohan</p>
              <p className="text-xs text-stone-500">Owl</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="raccoon" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Maya</p>
              <p className="text-xs text-stone-500">Raccoon</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="bear" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Tess</p>
              <p className="text-xs text-stone-500">Bear</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="chameleon" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Jordan</p>
              <p className="text-xs text-stone-500">Chameleon</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="dog" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Kai</p>
              <p className="text-xs text-stone-500">Dog</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="mouse" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Silas</p>
              <p className="text-xs text-stone-500">Mouse</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="parrot" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Yaquin</p>
              <p className="text-xs text-stone-500">Parrot</p>
            </div>
          </div>
        </section>

        <section className="text-stone-600 text-xs">
          <p>Features: Multi-color palette, clothing, expressive eyelids, white sclera</p>
          <p>Fox defaults to half-lidded (smug). Owl stays wide-eyed (alert).</p>
        </section>
      </div>
    </div>
  )
}
