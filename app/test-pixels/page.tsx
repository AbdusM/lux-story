import { PixelAvatar } from '@/components/PixelAvatar'

export default function TestPixelsPage() {
  return (
    <div className="min-h-screen bg-stone-950 p-8">
      <h1 className="text-2xl font-bold text-stone-100 mb-8">32×32 Pixel Avatars - GCT Characters</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg text-stone-400 mb-4">Size Comparison (Samuel - Owl)</h2>
          <div className="flex gap-8 items-end">
            <div className="text-center">
              <PixelAvatar animal="owl" size={32} />
              <p className="text-xs mt-2 text-stone-500">32px</p>
            </div>
            <div className="text-center">
              <PixelAvatar animal="owl" size={48} />
              <p className="text-xs mt-2 text-stone-500">48px</p>
            </div>
            <div className="text-center">
              <PixelAvatar animal="owl" size={64} />
              <p className="text-xs mt-2 text-stone-500">64px</p>
            </div>
            <div className="text-center">
              <PixelAvatar animal="owl" size={96} />
              <p className="text-xs mt-2 text-stone-500">96px</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg text-stone-400 mb-4">Main Cast (Large Preview)</h2>
          <div className="flex flex-wrap gap-6">
            <div className="bg-stone-900 p-6 rounded-lg text-center">
              <PixelAvatar animal="owl" size={96} />
              <p className="text-stone-200 mt-3 font-medium">Samuel</p>
              <p className="text-xs text-stone-500">Owl - The Conductor</p>
              <p className="text-xs text-stone-600 mt-1">Wise, observant</p>
            </div>
            <div className="bg-stone-900 p-6 rounded-lg text-center">
              <PixelAvatar animal="cat" size={96} />
              <p className="text-stone-200 mt-3 font-medium">Maya</p>
              <p className="text-xs text-stone-500">Cat - Clever</p>
              <p className="text-xs text-stone-600 mt-1">Resourceful, quick</p>
            </div>
            <div className="bg-stone-900 p-6 rounded-lg text-center">
              <PixelAvatar animal="fox" size={96} />
              <p className="text-stone-200 mt-3 font-medium">Tess</p>
              <p className="text-xs text-stone-500">Fox - Warm</p>
              <p className="text-xs text-stone-600 mt-1">Guiding, supportive</p>
            </div>
            <div className="bg-stone-900 p-6 rounded-lg text-center">
              <PixelAvatar animal="deer" size={96} />
              <p className="text-stone-200 mt-3 font-medium">Devon</p>
              <p className="text-xs text-stone-500">Deer - Gentle</p>
              <p className="text-xs text-stone-600 mt-1">Thoughtful, kind</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg text-stone-400 mb-4">All Characters (32×32 Native)</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="owl" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Samuel</p>
              <p className="text-xs text-stone-500">Owl</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="cat" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Maya</p>
              <p className="text-xs text-stone-500">Cat</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="fox" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Tess</p>
              <p className="text-xs text-stone-500">Fox</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="deer" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Devon</p>
              <p className="text-xs text-stone-500">Deer</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="bear" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Marcus</p>
              <p className="text-xs text-stone-500">Bear</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="raven" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Rohan</p>
              <p className="text-xs text-stone-500">Raven</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="rabbit" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Yaquin</p>
              <p className="text-xs text-stone-500">Rabbit</p>
            </div>
            <div className="bg-stone-900 p-4 rounded-lg text-center">
              <PixelAvatar animal="butterfly" size={64} />
              <p className="text-stone-200 mt-2 text-sm font-medium">Lira</p>
              <p className="text-xs text-stone-500">Butterfly</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg text-stone-400 mb-4">Legacy Characters (Backwards Compat)</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-stone-800 p-4 rounded-lg text-center opacity-60">
              <PixelAvatar animal="raccoon" size={64} />
              <p className="text-stone-300 mt-2 text-sm font-medium">Raccoon</p>
              <p className="text-xs text-stone-500">Legacy</p>
            </div>
            <div className="bg-stone-800 p-4 rounded-lg text-center opacity-60">
              <PixelAvatar animal="chameleon" size={64} />
              <p className="text-stone-300 mt-2 text-sm font-medium">Chameleon</p>
              <p className="text-xs text-stone-500">Legacy</p>
            </div>
            <div className="bg-stone-800 p-4 rounded-lg text-center opacity-60">
              <PixelAvatar animal="dog" size={64} />
              <p className="text-stone-300 mt-2 text-sm font-medium">Dog</p>
              <p className="text-xs text-stone-500">Legacy</p>
            </div>
            <div className="bg-stone-800 p-4 rounded-lg text-center opacity-60">
              <PixelAvatar animal="mouse" size={64} />
              <p className="text-stone-300 mt-2 text-sm font-medium">Mouse</p>
              <p className="text-xs text-stone-500">Legacy</p>
            </div>
          </div>
        </section>

        <section className="text-stone-600 text-xs space-y-1">
          <p>32×32 native resolution with imageRendering: pixelated</p>
          <p>Eyes: 3-4px with visible pupils and highlights</p>
          <p>Consistent face positioning (eyes at row 12-15)</p>
        </section>
      </div>
    </div>
  )
}
