# Landing Page Strategy: Homepage vs Direct to Game

**Question:** Should the website URL go straight to the game or have a landing page first?

**Answer:** **Landing page first** (for web-first launch strategy)

---

## 🎯 Recommendation: Landing Page First

### Why Landing Page?

**For Web-First Launch Strategy:**
1. ✅ **Email capture** - Build your audience before Steam
2. ✅ **Context** - Explain what the game is (contemplative, no pressure, etc.)
3. ✅ **Shareability** - Better for social media (preview, description)
4. ✅ **SEO** - Better for search engines (meta description, keywords)
5. ✅ **Conversion** - Can A/B test messaging, CTAs
6. ✅ **Steam prep** - Can add "Wishlist on Steam" button later
7. ✅ **Analytics** - Track who visits vs who plays

**For Direct to Game:**
- ✅ Immediate play (no friction)
- ✅ Simple (one page)
- ❌ No email capture
- ❌ No context (people might not understand what it is)
- ❌ Harder to share (just a game, no explanation)
- ❌ Missed marketing opportunity

**Verdict:** Landing page is better for building an audience and validating traction.

---

## 🏗️ Recommended Structure

### Option 1: Landing Page + Separate Play Route (Recommended)

**URL Structure:**
```
lux-story.com/          → Landing page (marketing)
lux-story.com/play      → Game (StatefulGameInterface)
```

**Benefits:**
- Clean separation (marketing vs game)
- Can link directly to game if needed (`/play`)
- Landing page can be shared on social media
- Game URL can be shared separately

**Implementation:**
- `app/page.tsx` → Landing page component
- `app/play/page.tsx` → Game component (StatefulGameInterface)

### Option 2: Landing Page with Inline Game (Alternative)

**URL Structure:**
```
lux-story.com/          → Landing page with "Play Now" button
                         → Scrolls to game or opens in modal
```

**Benefits:**
- Everything on one page
- Can see game preview before playing
- Single URL to share

**Drawbacks:**
- Longer page load
- Less clean separation

---

## 📄 Landing Page Content

### Essential Elements

1. **Hero Section**
   - Game title: "Lux Story"
   - Tagline: "A contemplative game where nothing is urgent"
   - Subtitle: "Discover your career path through calm choices with Lux, a sloth in a digital forest"
   - CTA: "Play Free" button (links to `/play`)

2. **What Makes It Different**
   - "No scores, no achievements, no pressure"
   - "Career discovery through contemplation, not testing"
   - "Adapts to your pace"
   - "Hidden revelations for patient players"

3. **Screenshots/GIFs**
   - 3-5 images showing gameplay
   - Lux character
   - Digital forest atmosphere
   - Choice moments

4. **Email Signup**
   - "Get notified when we launch on Steam"
   - "Join our community"
   - Prominent but not pushy

5. **Social Proof** (if you have it)
   - "Played by X people"
   - Testimonials (if any)
   - "Featured on..." (if any)

6. **Footer**
   - Social links (TikTok, Twitter)
   - "Made with 🦥 by [Your Name]"
   - Links to Steam page (when ready)

### Optional Elements

- **About Section** - Story behind the game
- **Features List** - What the game offers
- **FAQ** - Common questions
- **Blog/Updates** - Dev log, updates

---

## 🎨 Example Landing Page Layout

```
┌─────────────────────────────────────┐
│  Hero Section                        │
│  - Title: "Lux Story"                │
│  - Tagline                           │
│  - "Play Free" button                │
│  - Email signup (optional)           │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  What Makes It Different             │
│  - 3-4 key points                    │
│  - Visual icons/illustrations        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Screenshots/Gallery                 │
│  - 3-5 images                        │
│  - Lightbox on click                 │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Email Signup (Prominent)            │
│  "Get notified when we launch on     │
│   Steam + exclusive updates"         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Footer                              │
│  - Social links                      │
│  - Steam wishlist (when ready)      │
│  - Credits                          │
└─────────────────────────────────────┘
```

---

## 💻 Implementation Options

### Option A: Simple Landing Page Component

Create `app/page.tsx` as landing page, move game to `app/play/page.tsx`:

```tsx
// app/page.tsx (Landing Page)
export default function Home() {
  return (
    <main>
      <HeroSection />
      <WhatMakesItDifferent />
      <Screenshots />
      <EmailSignup />
      <Footer />
    </main>
  )
}

// app/play/page.tsx (Game)
export default function Play() {
  return (
    <main>
      <StatefulGameInterface />
    </main>
  )
}
```

### Option B: Conditional Landing (First Visit Only)

Show landing page on first visit, then remember preference:

```tsx
// app/page.tsx
export default function Home() {
  const [showLanding, setShowLanding] = useState(true)
  
  useEffect(() => {
    const hasSeenLanding = localStorage.getItem('has-seen-landing')
    if (hasSeenLanding) {
      setShowLanding(false)
    }
  }, [])
  
  if (showLanding) {
    return <LandingPage onPlay={() => {
      localStorage.setItem('has-seen-landing', 'true')
      setShowLanding(false)
    }} />
  }
  
  return <StatefulGameInterface />
}
```

**Not recommended** - Confusing UX, better to have separate routes.

---

## 📊 A/B Testing Opportunity

**Test different approaches:**

1. **Landing page first** (recommended)
   - Track: Email signups, play button clicks, time on page

2. **Direct to game** (for comparison)
   - Track: Immediate plays, bounce rate, time in game

**Metrics to compare:**
- Email signups (landing page should win)
- Play rate (direct might win, but landing page can still have high play rate)
- Return visitors (landing page might win - people understand what it is)
- Social shares (landing page should win - better for sharing)

---

## 🚀 Quick Implementation

### Minimal Landing Page (Can Build Today)

**Create `app/page.tsx`:**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Lux Story</h1>
        <p className="text-xl text-slate-600 mb-2">
          A contemplative game where nothing is urgent
        </p>
        <p className="text-lg text-slate-500 mb-8">
          Discover your career path through calm choices with Lux, a sloth in a digital forest
        </p>
        <Link href="/play">
          <Button size="lg" className="text-lg px-8">
            Play Free
          </Button>
        </Link>
      </section>

      {/* Email Signup */}
      <section className="container mx-auto px-4 py-12 text-center bg-white">
        <h2 className="text-2xl font-bold mb-4">Coming to Steam</h2>
        <p className="text-slate-600 mb-6">
          Get notified when we launch on Steam + exclusive updates
        </p>
        {/* Add email form here */}
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-500">
        <p>Made with 🦥 by Lux Story Team</p>
      </footer>
    </main>
  )
}
```

**Create `app/play/page.tsx`:**

```tsx
import StatefulGameInterface from '@/components/StatefulGameInterface'

export default function Play() {
  return (
    <main className="min-h-screen" style={{ willChange: 'auto', contain: 'layout style paint' }}>
      <StatefulGameInterface />
    </main>
  )
}
```

**That's it!** Minimal landing page, game on separate route.

---

## 🎯 Recommendation Summary

**For Web-First Launch:**
- ✅ **Landing page first** (`/`)
- ✅ **Game on separate route** (`/play`)
- ✅ **Email signup on landing page**
- ✅ **"Play Free" button** (prominent CTA)
- ✅ **Screenshots/GIFs** (show what it is)
- ✅ **Steam wishlist button** (when ready)

**Why:**
- Builds audience (email list)
- Better for sharing (social media preview)
- Explains what the game is (contemplative, no pressure)
- Sets up for Steam launch (wishlist button)
- Professional appearance

**Start simple, add more later!**

---

## 📝 Next Steps

1. **Create landing page** (`app/page.tsx`)
2. **Move game to `/play`** (`app/play/page.tsx`)
3. **Add email signup form** (Mailchimp, ConvertKit, etc.)
4. **Add screenshots** (3-5 images)
5. **Test both routes** (landing page and game)
6. **Deploy and share!**

**Time investment:** 2-4 hours for a simple landing page that will significantly help with audience building.

---

*"A landing page is your game's first impression. Make it count."*
