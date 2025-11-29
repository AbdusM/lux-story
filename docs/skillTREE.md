# Lightweight skill visualization for React without D3

Your constraints—React, Framer Motion, Tailwind, native SVG only, no canvas/WebGL, 50+ nodes, mobile-first, bundle-sensitive—are achievable with the right architectural patterns. The key insight: **you don't need force-directed layouts**. Your skills have fixed categories and a reflection-focused use case, making pre-computed positioning both simpler and more performant.

## Radial layouts beat force-directed graphs for categorized skills

For 8 fixed categories with ~6 skills each, a **radial/constellation layout** provides visual appeal without physics simulation overhead. The math is trivial:

```javascript
// Core positioning formula - zero dependencies
const getRadialPosition = (centerX, centerY, radius, angleDegrees) => ({
  x: centerX + radius * Math.cos((Math.PI * angleDegrees) / 180),
  y: centerY + radius * Math.sin((Math.PI * angleDegrees) / 180)
});

// 8 categories = 45° apart
const categoryPositions = (categoryIndex, skillIndex, totalInCategory) => {
  const baseAngle = categoryIndex * 45; // 0, 45, 90, 135...
  const skillRadius = 80 + (skillIndex * 35); // Nested rings
  const angleOffset = (skillIndex * 8) - (totalInCategory * 4); // Spread within category
  return getRadialPosition(250, 250, skillRadius, baseAngle + angleOffset);
};
```

This produces a constellation pattern where each category occupies a **45° wedge**, with skills radiating outward at increasing distances. The visual result resembles a star map—appropriate for career progression—rather than a fantasy RPG skill tree.

**Alternative positioning strategies** include CSS Grid with organic offsets (`transform: translate(${random()}px, ${random()}px)`), hexagonal grids using `clip-path: polygon()`, and pure Flexbox masonry layouts. For 50+ nodes, pre-compute all positions in a JSON file and load them statically—this eliminates runtime calculation entirely.

## Framer Motion handles 50+ nodes when configured correctly

The critical optimizations reduce both bundle size and runtime performance impact:

**Bundle reduction with LazyMotion** drops Framer Motion from **34kb to ~4.6kb** by loading animation features asynchronously:

```jsx
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

function SkillVisualization({ skills }) {
  return (
    <LazyMotion features={domAnimation}>
      <svg viewBox="0 0 500 500">
        {skills.map((skill, i) => (
          <m.g
            key={skill.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.02 }}
          >
            <circle cx={skill.x} cy={skill.y} r={20} fill={skill.color} />
          </m.g>
        ))}
      </svg>
    </LazyMotion>
  );
}
```

**GPU-accelerated properties only**: Animate `x`, `y`, `scale`, `rotate`, and `opacity`—these bypass layout recalculation. Never animate `width`, `height`, `cx`, `cy`, or `r` directly, as these trigger expensive repaints on every frame.

**Viewport-based triggering** with `whileInView` and `once: true` ensures each node animates exactly once when scrolled into view, using Intersection Observer (0.5kb) under the hood. Combined with staggered delays (`delay: index * 0.02`), this creates a wave effect without re-animation on scroll.

**Motion values prevent re-renders**: Use `useMotionValue` and `useTransform` for any value that changes during interaction. Unlike React state, motion values update the DOM directly without triggering component re-renders—essential when 50 nodes might otherwise cascade updates.

## Progressive disclosure solves the overwhelm problem

Showing 52 skills simultaneously violates every UX principle. The solution combines **category-first navigation** with **on-demand detail revelation**:

**Recommended architecture**: A hybrid radar-and-accordion pattern shows category-level progress at a glance while hiding individual skills until requested.

```jsx
const CareerSkillDashboard = ({ categories }) => (
  <div className="flex flex-col gap-6 p-4">
    {/* Summary radar showing 8 category averages */}
    <RadarSummary 
      data={categories.map(c => c.averageProgress)}
      labels={categories.map(c => c.name)}
    />
    
    {/* Expandable category sections */}
    {categories.map(category => (
      <details key={category.id} className="group">
        <summary className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
          <span className="font-medium">{category.name}</span>
          <ProgressBar value={category.averageProgress} className="w-32" />
        </summary>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          {category.skills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </details>
    ))}
  </div>
);
```

The native `<details>` element provides collapse/expand behavior with **zero JavaScript**, while Tailwind's `group` modifier enables styling changes based on open state. This pattern—used by Khan Academy's mastery grid and Codecademy's career paths—reduces initial cognitive load to **8 items** instead of 52.

For the radar summary, a pure SVG implementation requires ~40 lines of code calculating polygon vertices from category scores. Libraries like `react-svg-radar-chart` (~7kb) provide this out-of-the-box if bundle budget allows.

## Zustand outperforms Context for skill state management

With 52 skills tracked across sessions, state management choices significantly impact render performance. **Zustand** (~1kb gzipped) with atomic selectors prevents cascading re-renders:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSkillStore = create(
  persist(
    (set, get) => ({
      skills: {},
      
      updateSkill: (skillId, changes) => set(state => ({
        skills: {
          ...state.skills,
          [skillId]: { ...state.skills[skillId], ...changes }
        }
      })),
      
      getCategoryProgress: (categoryId) => {
        const skills = Object.values(get().skills)
          .filter(s => s.categoryId === categoryId);
        return skills.reduce((sum, s) => sum + s.progress, 0) / skills.length;
      }
    }),
    { name: 'skill-progress' } // Auto-persists to localStorage
  )
);

// Component subscribes to ONE skill only
const SkillNode = ({ skillId }) => {
  const progress = useSkillStore(state => state.skills[skillId]?.progress);
  return <div>{progress}%</div>;
};
```

The key pattern: **selector functions** that extract only the data each component needs. When skill #47 updates, only `<SkillNode skillId="47">` re-renders—not all 52 nodes. This granular subscription model, inspired by Jotai's atomic architecture, scales linearly (benchmarks show ~3ms overhead for 2,000 atoms).

For behavioral pattern tracking (exploring, helping, rushing, etc.), store these as separate top-level keys with their own selectors, avoiding any coupling with skill progression state.

## Mobile touch interactions require specific accommodations

**Touch targets must be 44×44px minimum** (WCAG 2.5.5, Apple HIG). For SVG skill nodes, this means either inflating visual elements or adding invisible hit areas:

```jsx
<g onClick={() => handleSkillTap(skill.id)}>
  {/* Invisible hit area */}
  <circle cx={skill.x} cy={skill.y} r={22} fill="transparent" />
  {/* Visible node - smaller */}
  <circle cx={skill.x} cy={skill.y} r={16} fill={skill.color} />
</g>
```

**Tap-to-expand** suits reflection use cases better than tap-to-select. Users viewing their progress want details on demand—implement this as modal overlays or inline expansions rather than navigation changes.

**Pinch-to-zoom** isn't natively supported by Framer Motion (confirmed wontfix in GitHub issue #617). For large visualizations, either use `react-zoom-pan-pinch` (~8kb) or implement basic zoom with touch event math:

```javascript
const handleTouchMove = (e) => {
  if (e.touches.length === 2) {
    const distance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    setScale(distance / initialDistance);
  }
};
```

For most mobile scenarios, **category-based navigation eliminates the need for pan/zoom entirely**—each category view contains only 6-8 skills, fitting comfortably on any screen.

## Duolingo and Khan Academy patterns worth adopting

**Duolingo's 2022 redesign** moved from flexible skill trees to guided linear paths. Key learnings: unit groupings reduce apparent complexity, floating navigation buttons help users return to their current position in long scrolls, and tapping nodes reveals details without page transitions. Their animations use Rive (not Framer Motion), which offers better cross-platform performance but requires learning a new tool.

**Khan Academy's mastery grid** displays skills as colored squares in a compact grid. Hover/tap reveals tooltips with progress details. The visual density—showing many skills simultaneously—works because each skill's representation is minimal (colored square + icon). This pattern adapts well to mobile with a tap-to-expand interaction replacing hover.

**beautiful-skill-tree** is the most capable open-source React library for traditional hierarchical trees. It offers three states (locked/unlocked/selected), localStorage persistence, keyboard navigation, and theming—but at ~50kb, it exceeds your bundle budget. Extract its patterns instead: use CSS custom properties for theming, implement the three-state model, and borrow its accessibility approach (Tab + Enter navigation).

## Accessibility requires ARIA tree patterns and keyboard support

SVG-based skill visualizations need explicit accessibility markup:

```jsx
<svg role="img" aria-labelledby="skillMapTitle">
  <title id="skillMapTitle">Career Skills Progress Map</title>
  <g role="group" aria-label="Technical Skills">
    {technicalSkills.map(skill => (
      <g
        key={skill.id}
        role="button"
        tabIndex={0}
        aria-label={`${skill.name}: ${skill.progress}% complete`}
        onKeyDown={(e) => e.key === 'Enter' && handleSkillTap(skill.id)}
      >
        <circle cx={skill.x} cy={skill.y} r={20} />
      </g>
    ))}
  </g>
</svg>
```

**Keyboard navigation** requires arrow key support for moving between nodes, Enter for activation, and visible focus indicators (use `:focus-visible` to avoid showing focus rings on mouse clicks).

**Reduced motion preferences** must be respected. Framer Motion provides `useReducedMotion()` hook and `<MotionConfig reducedMotion="user">` wrapper. For users who prefer reduced motion, replace scale/transform animations with simple opacity fades:

```jsx
const shouldReduceMotion = useReducedMotion();
const variants = shouldReduceMotion 
  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  : { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } };
```

**Color contrast** for locked/unlocked/mastered states shouldn't rely on color alone. Add icons (lock, checkmark, progress ring) and text labels. Aim for 4.5:1 contrast ratio on all text, with 3:1 minimum even for "disabled" locked states.

## Recommended implementation architecture

For your career learning game with 8 categories, 52 skills, and reflection focus:

**Layer 1 - Summary view**: Radar chart showing 8 category averages, implemented as pure SVG polygon with vertices calculated from normalized scores. Single tap navigates to category detail.

**Layer 2 - Category view**: Grid of 6-8 skill cards per category, using CSS Grid with Tailwind (`grid-cols-2 sm:grid-cols-3`). Each card shows skill name, icon, progress bar, and state indicator. Tap opens skill detail modal.

**Layer 3 - Skill detail**: Modal overlay with full skill description, progress history, related behaviors, and any unlockable content. Close returns to category view.

**State architecture**: Zustand store with `skills` object (keyed by ID), `behaviors` object for pattern tracking, and computed selectors for category aggregates. Persist to localStorage with Zustand's `persist` middleware.

**Animation approach**: Use Framer Motion's `AnimatePresence` for modal transitions, `whileInView` with staggered delays for initial skill card appearance, and `layoutId` for shared element transitions if navigating between views. Keep all animations under 300ms on mobile.

**Bundle budget**:
- Framer Motion (LazyMotion): ~5kb
- Zustand: ~1kb  
- Custom SVG radar + positioning: ~2kb
- Total animation/state overhead: **~8kb** (well under 30kb limit)

This architecture handles 50+ skills through progressive disclosure rather than virtualization—the simplest approach that works for your node count. If you later scale to 200+ skills, add Intersection Observer-based lazy rendering for skill cards outside the viewport.