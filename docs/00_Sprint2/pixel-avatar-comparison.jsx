import React, { useState } from 'react';

// Current 16x16 Samuel (approximation based on uploaded image)
const current16x16 = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0],
  [0,0,1,2,3,1,0,0,0,0,1,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0],
  [0,0,4,4,4,4,4,4,4,4,4,4,4,4,0,0],
  [0,4,4,4,5,6,4,4,4,4,5,6,4,4,4,0],
  [0,4,4,4,6,6,4,4,4,4,6,6,4,4,4,0],
  [0,4,4,4,4,4,4,7,7,4,4,4,4,4,4,0],
  [0,4,4,4,4,4,7,8,8,7,4,4,4,4,4,0],
  [0,4,4,4,4,4,4,7,7,4,4,4,4,4,4,0],
  [0,0,4,4,4,4,4,4,4,4,4,4,4,4,0,0],
  [0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0],
  [0,0,0,0,4,4,4,4,4,4,4,4,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Simplified 16x16 - bigger eyes, simpler structure
const simplified16x16 = [
  [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0],
  [0,1,1,1,4,4,4,4,4,4,4,4,1,1,1,0],
  [0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0],
  [0,0,4,4,4,4,4,4,4,4,4,4,4,4,0,0],
  [0,4,4,5,6,6,4,4,4,4,5,6,6,4,4,0],
  [0,4,4,6,6,6,4,4,4,4,6,6,6,4,4,0],
  [0,4,4,5,6,6,4,4,4,4,5,6,6,4,4,0],
  [0,4,4,4,4,4,4,7,7,4,4,4,4,4,4,0],
  [0,4,4,4,4,4,4,7,7,4,4,4,4,4,4,0],
  [0,0,4,4,4,4,4,4,4,4,4,4,4,4,0,0],
  [0,0,4,4,4,4,4,4,4,4,4,4,4,4,0,0],
  [0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0],
  [0,0,0,0,4,4,4,4,4,4,4,4,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// New 32x32 design with proper detail
const expanded32x32 = [];
for(let y = 0; y < 32; y++) {
  expanded32x32[y] = [];
  for(let x = 0; x < 32; x++) {
    // Start with transparent
    let c = 0;
    
    // Ear tufts (triangular, rows 0-7)
    // Left ear
    if(y >= 0 && y <= 7) {
      if(x >= 4-y/2 && x <= 8 && y <= 6) {
        if(x <= 5) c = 1; // dark
        else if(x <= 6) c = 2; // mid
        else c = 3; // light
      }
      // Right ear
      if(x >= 23 && x <= 27+y/2 && y <= 6) {
        if(x >= 26) c = 1; // dark
        else if(x >= 25) c = 2; // mid
        else c = 3; // light
      }
    }
    
    // Face oval (rows 5-27)
    const cx = 16, cy = 16;
    const rx = 11, ry = 11;
    const dx = (x - cx) / rx;
    const dy = (y - cy) / ry;
    if(dx*dx + dy*dy <= 1 && y >= 5) {
      c = 4; // face base
      // Highlight
      if(dx*dx + dy*dy <= 0.3 && y < 14 && y > 8) c = 9; // subtle highlight
    }
    
    // Eyes (rows 11-17)
    // Left eye
    if(y >= 11 && y <= 16 && x >= 8 && x <= 13) {
      const eyeCx = 10.5, eyeCy = 13.5;
      const eyeDx = x - eyeCx, eyeDy = y - eyeCy;
      if(eyeDx*eyeDx + eyeDy*eyeDy <= 9) {
        c = 5; // white
        // Pupil
        if(eyeDx*eyeDx + eyeDy*eyeDy <= 3) {
          c = 6; // black
          // Highlight
          if(x === 9 && y === 12) c = 5;
        }
      }
    }
    // Right eye
    if(y >= 11 && y <= 16 && x >= 18 && x <= 23) {
      const eyeCx = 20.5, eyeCy = 13.5;
      const eyeDx = x - eyeCx, eyeDy = y - eyeCy;
      if(eyeDx*eyeDx + eyeDy*eyeDy <= 9) {
        c = 5; // white
        // Pupil
        if(eyeDx*eyeDx + eyeDy*eyeDy <= 3) {
          c = 6; // black
          // Highlight
          if(x === 19 && y === 12) c = 5;
        }
      }
    }
    
    // Beak (rows 17-22)
    if(y >= 17 && y <= 22) {
      const beakWidth = Math.max(0, 3 - Math.abs(y - 19));
      if(x >= 15 - beakWidth && x <= 16 + beakWidth) {
        c = 7; // beak primary
        if(y >= 20) c = 8; // beak shadow
      }
    }
    
    expanded32x32[y][x] = c;
  }
}

// Color palettes
const currentPalette = {
  0: 'transparent',
  1: '#5D4037', // dark brown
  2: '#8D6E63', // medium brown
  3: '#A1887F', // light brown
  4: '#EFEBE9', // cream white
  5: '#FAFAFA', // eye white
  6: '#212121', // black
  7: '#FFD54F', // golden yellow
  8: '#FFC107', // dark yellow
  9: '#FFF8E1', // warm white
};

const simplifiedPalette = {
  0: 'transparent',
  1: '#6D4C41', // unified brown
  4: '#F5F0E6', // flat face cream
  5: '#FFFFFF', // pure white
  6: '#1A1A1A', // pure black
  7: '#F9A825', // muted yellow
};

const expandedPalette = {
  0: 'transparent',
  1: '#4E342E', // ear dark
  2: '#6D4C41', // ear mid
  3: '#8D6E63', // ear light
  4: '#EFEBE9', // face base
  5: '#FFFFFF', // eye white
  6: '#212121', // eye black
  7: '#FFB300', // beak primary
  8: '#FF8F00', // beak shadow
  9: '#FFFAF0', // face highlight
};

const PixelGrid = ({ grid, palette, scale = 4, label }) => {
  const size = grid.length;
  return (
    <div className="flex flex-col items-center">
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${size}, ${scale}px)`,
          gap: 0,
          border: '1px solid #ddd',
          backgroundColor: '#f5f5f5'
        }}
      >
        {grid.flat().map((c, i) => (
          <div 
            key={i}
            style={{
              width: scale,
              height: scale,
              backgroundColor: palette[c] || 'transparent'
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
      <p className="text-xs text-gray-400">{size}×{size} @ {scale}x = {size*scale}px</p>
    </div>
  );
};

const ScalePreview = ({ grid, palette, scales, title }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="flex flex-wrap gap-6 items-end">
      {scales.map(s => (
        <PixelGrid 
          key={s.scale} 
          grid={grid} 
          palette={palette} 
          scale={s.scale} 
          label={s.label}
        />
      ))}
    </div>
  </div>
);

export default function PixelAvatarComparison() {
  const [view, setView] = useState('comparison');
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pixel Avatar Redesign</h1>
      <p className="text-gray-600 mb-6">Critical analysis & visual comparison for Grand Central Terminus</p>
      
      <div className="flex gap-2 mb-8">
        <button 
          onClick={() => setView('comparison')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            view === 'comparison' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Side-by-Side
        </button>
        <button 
          onClick={() => setView('scaling')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            view === 'scaling' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Scale Testing
        </button>
        <button 
          onClick={() => setView('issues')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            view === 'issues' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Issues Analysis
        </button>
      </div>
      
      {view === 'comparison' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Three Approaches Compared</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-50 rounded-lg p-4 mb-4 inline-block">
                <PixelGrid grid={current16x16} palette={currentPalette} scale={8} label="" />
              </div>
              <h3 className="font-semibold text-red-700">Current (16×16)</h3>
              <p className="text-sm text-gray-500 mt-1">9 colors, cramped detail</p>
              <ul className="text-xs text-left mt-3 text-gray-600 space-y-1">
                <li>❌ Eyes too small (2×2)</li>
                <li>❌ Gradient overload</li>
                <li>❌ Beak dominates</li>
                <li>❌ Illegible at 32px</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-50 rounded-lg p-4 mb-4 inline-block">
                <PixelGrid grid={simplified16x16} palette={simplifiedPalette} scale={8} label="" />
              </div>
              <h3 className="font-semibold text-yellow-700">Path A: Simplified (16×16)</h3>
              <p className="text-sm text-gray-500 mt-1">5 colors, iconic clarity</p>
              <ul className="text-xs text-left mt-3 text-gray-600 space-y-1">
                <li>✅ Big eyes (3×3)</li>
                <li>✅ Flat colors</li>
                <li>✅ Clear silhouette</li>
                <li>⚠️ Less personality</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-4 mb-4 inline-block">
                <PixelGrid grid={expanded32x32} palette={expandedPalette} scale={4} label="" />
              </div>
              <h3 className="font-semibold text-green-700">Path B: Expanded (32×32)</h3>
              <p className="text-sm text-gray-500 mt-1">10 colors, full expression</p>
              <ul className="text-xs text-left mt-3 text-gray-600 space-y-1">
                <li>✅ Large expressive eyes</li>
                <li>✅ Proper ear detail</li>
                <li>✅ Room for animation</li>
                <li>✅ Future-proof</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800">Recommendation: Path B (32×32)</h4>
            <p className="text-sm text-green-700 mt-1">
              More pixels = the design can breathe. Maintains pixel art aesthetic while enabling 
              the warmth and detail a mentor character needs. Scales cleanly to 2030 displays.
            </p>
          </div>
        </div>
      )}
      
      {view === 'scaling' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Scale Testing: UI Context Simulation</h2>
          
          <ScalePreview 
            grid={current16x16}
            palette={currentPalette}
            title="Current Design (16×16)"
            scales={[
              { scale: 2, label: 'Header (32px)' },
              { scale: 3, label: 'Dialogue (48px)' },
              { scale: 4, label: 'Profile (64px)' },
            ]}
          />
          
          <ScalePreview 
            grid={simplified16x16}
            palette={simplifiedPalette}
            title="Path A: Simplified (16×16)"
            scales={[
              { scale: 2, label: 'Header (32px)' },
              { scale: 3, label: 'Dialogue (48px)' },
              { scale: 4, label: 'Profile (64px)' },
            ]}
          />
          
          <ScalePreview 
            grid={expanded32x32}
            palette={expandedPalette}
            title="Path B: Expanded (32×32)"
            scales={[
              { scale: 1, label: 'Header (32px)' },
              { scale: 1.5, label: 'Dialogue (48px)' },
              { scale: 2, label: 'Profile (64px)' },
            ]}
          />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">Key Insight</h4>
            <p className="text-sm text-blue-700 mt-1">
              At header size (32px display), the current design loses all detail. 
              The simplified version reads as "owl" but lacks warmth. 
              The 32×32 version at 1:1 scale is immediately legible and expressive.
            </p>
          </div>
        </div>
      )}
      
      {view === 'issues' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Current Design Issues</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <PixelGrid grid={current16x16} palette={currentPalette} scale={12} label="Current at 12x magnification" />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-800">1. Palette Overload</h4>
                <p className="text-sm text-red-700">9 colors fighting for 256 pixels. 3-tone ear gradient consumes visual bandwidth without aiding recognition.</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800">2. Competing Focal Points</h4>
                <p className="text-sm text-orange-700">Dark ear tufts create high-contrast anchors that pull attention from the face. Eyes get lost.</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800">3. Undersized Eyes</h4>
                <p className="text-sm text-yellow-700">At 2×2 pixels, eyes lack the presence needed for a wise mentor character. Should be 15-20% of face area.</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800">4. Beak Dominance</h4>
                <p className="text-sm text-blue-700">Golden beak with shadow creates warm-color focal point that competes with eyes for attention.</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800">5. Silhouette Complexity</h4>
                <p className="text-sm text-purple-700">Irregular outline doesn't resolve at small scales. Effective 16×16 pixel art uses simpler shapes.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
