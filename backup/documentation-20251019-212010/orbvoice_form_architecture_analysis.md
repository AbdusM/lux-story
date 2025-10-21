# OrbVoice Form Architecture Analysis
**Repository:** `/Users/abdusmuwwakkil/Development/03_OrbVoice`
**Analyzed:** October 2025
**Current Branch:** `feature/hpi-safe-implementation` (64 commits ahead of main)

---

## Executive Summary

OrbVoice is a React Native medical documentation application featuring **AI-powered assessment forms** that transform voice transcriptions into CMS-compliant clinical documentation. The architecture follows a **consistent pattern-based approach** across 7+ form types (SOAP, Discharge, AWV, BHI, TCM, PHQ-9, SDOH), with a recent migration to an **iOS Notes-style primitive UI system** for premium medical aesthetics.

**Key Characteristics:**
- **Monorepo architecture** (Turborepo-style workspaces)
- **Full-stack TypeScript** with Eden Treaty for end-to-end type safety
- **AI-first workflow**: Voice → Transcription → AI Analysis → Structured Form
- **Non-blocking persistence**: Forms generate even if database persistence fails
- **Medical UI primitives**: Typography-first, minimal chrome, iOS Health Records aesthetic

---

## 1. Form Architecture Patterns

### 1.1 Component Hierarchy

```
📱 Frontend (React Native + Expo)
├── BottomSheetModal (container)
│   ├── Header (close, title, copy, share)
│   ├── BottomSheetScrollView (content)
│   │   ├── Loading State (ActivityIndicator)
│   │   ├── Empty State (generate prompt)
│   │   └── Generated Form (DocumentSection tree)
│   │       ├── SectionHeader (title, subtitle, badge)
│   │       ├── DataField (label/value pairs)
│   │       ├── DocumentText (narrative)
│   │       └── SectionDivider (subtle separator)
│   └── Footer (generate button - SDOH only)

🔧 Backend (Elysia/Bun.js)
├── Router (/api/{feature}/generate)
├── Service (AI endpoint caller)
├── Encounters Service (unified persistence)
└── AI Service (04_OrbVoiceServices repo)
```

### 1.2 State Management Architecture

**Two-Tier State System:**

1. **Legend State Stores** (Local reactive state)
   - Purpose: UI reactivity, optimistic updates
   - Files: `/apps/expo/src/features/notes/store/*.tsx`
   - Stores: `noteStore`, `soapStore`, `dischargeStore`, `sdohStore`
   - Pattern: Observable reactive state with `.peek()` and `.set()` methods

2. **TanStack Query** (Server state)
   - Purpose: Server data fetching, caching, mutations
   - File: `/apps/expo/src/lib/tanstackQuery.tsx`
   - Pattern: React Query v5 with MMKV persistence

**State Flow:**
```
User Action → Hook (useDocumentGeneration) → API Call → AI Service
                ↓                                          ↓
         Loading State                              AI Response
                ↓                                          ↓
         Local Store Update ← Transform Data ← Backend Validation
                ↓
         UI Re-render (observer)
```

### 1.3 Data Flow: Generation to Display

**End-to-End Flow:**

```mermaid
graph LR
    A[Voice Recording] --> B[Deepgram Transcription]
    B --> C[Note Stored in DB]
    C --> D[User Opens Form Tab]
    D --> E[Hook: useDocumentGeneration]
    E --> F[Backend: /api/feature/generate]
    F --> G[Service: getNoteTranscriptions]
    G --> H[AI Service: /generate-feature]
    H --> I[Zod Validation]
    I --> J[Encounters Persistence]
    J --> K[Return to Frontend]
    K --> L[Legend State Update]
    L --> M[UI Renders DocumentSection]
```

**Key Pattern:** Auto-generation on modal open
```typescript
// AWVDocumentBottomSheet.tsx:52-56
useEffect(() => {
  if (open && !awvDocument && !isGenerating) {
    generateAWV(noteId)
  }
}, [open, awvDocument, isGenerating, generateAWV, noteId])
```

### 1.4 UI Component Patterns

**Medical Primitives System** (`/apps/expo/src/components/medical/`)

1. **DocumentSection** - Container with configurable spacing
   - Props: `spacing` (tight/base/relaxed), `children`
   - Renders: Flex column with gap from design tokens

2. **SectionHeader** - iOS-style header with optional badge
   - Props: `title`, `subtitle`, `badge` (text + severity)
   - Severity colors: critical/warning/stable/info
   - Typography: 2xl bold title, base subtitle

3. **DataField** - Label/value pair with severity coloring
   - Props: `label`, `value`, `valueSeverity`, `orientation`
   - Orientations: vertical (default) or horizontal
   - Medical severity color system

4. **DocumentText** - Body text with medical typography
   - Props: `variant` (body/caption), `children`
   - Consistent medical text styling

5. **SectionDivider** - Subtle section separator
   - 1px gray-200 divider with vertical spacing

**Design Tokens** (`/apps/expo/src/lib/design-tokens.ts`)
```typescript
export const ui = {
  spacing: { tight: 8, base: 16, relaxed: 24 },
  medical: {
    critical: "#dc2626",  // red-600
    warning: "#f59e0b",   // amber-500
    stable: "#10b981",    // emerald-500
    info: "#3b82f6"       // blue-500
  },
  shadows: {
    subtle: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, ... }
  }
}
```

---

## 2. Technology Stack Analysis

### 2.1 Frontend (React Native + Expo)

**Core Technologies:**
- **React Native**: 0.79.2 (latest)
- **Expo SDK**: 53.0.9
- **React**: 19.0.0

**State Management:**
- **Legend State**: 3.0.0-beta.26 (reactive observables)
- **TanStack Query**: 5.76.0 (server state)
- **React Hook Form**: 7.56.3 (form validation)

**UI Framework:**
- **NativeWind**: 4.1.23 (Tailwind for React Native)
- **Bottom Sheet**: @gorhom/bottom-sheet 5.1.4
- **Gestures**: react-native-gesture-handler 2.24.0
- **Reanimated**: 3.17.5 (animations)
- **Moti**: 0.30.0 (declarative animations)

**Medical-Specific:**
- **Medical Primitives**: Custom components in `/apps/expo/src/components/medical/`
- **Design Tokens**: Centralized medical color system
- **Typography System**: iOS Health Records inspired

### 2.2 Backend (Elysia + Bun.js)

**Runtime & Framework:**
- **Bun**: 1.2.12 (JavaScript runtime, 3x faster than Node.js)
- **Elysia**: 1.3.1 (type-safe web framework for Bun)
- **TypeScript**: 5.8.3

**Database:**
- **PostgreSQL**: GCP Cloud SQL (34.72.76.216)
- **Drizzle ORM**: Type-safe SQL toolkit
- **Schema Pattern**: Feature-based schemas (`/packages/db/src/schema/`)

**External Services:**
- **Deepgram SDK**: 4.1.0 (audio transcription)
- **Google Cloud Storage**: 7.16.0 (audio file storage)
- **Firebase Admin**: Authentication

**Validation:**
- **Zod**: 3.24.4 (schema validation)
- **TypeBox**: 0.34.33 (@sinclair/typebox)

### 2.3 Type Safety (Eden Treaty)

**Pattern:** End-to-end type inference from server to client

**Backend Type Export:**
```typescript
// /apps/server/src/index.ts:26-35
export * from "./features/soap/soap.types"
export * from "./features/discharge/discharge.types"
export * from "./features/billing/billing.types"
export * from "./features/awv/awv.types"
export * from "./features/bhi/bhi.types"
export * from "./features/phq9/phq9.types"
export * from "./features/sdoh/sdoh.types"
export * from "./features/tcm/tcm.types"

export type ServerType = typeof app
```

**Frontend Type Usage:**
```typescript
// /apps/expo/src/lib/api.ts
import { treaty } from "@elysiajs/eden"
import type { ServerType } from "@orbvoice/server"

export const api = treaty<ServerType>(Env.EXPO_PUBLIC_BASE_URL)

// Usage in hooks
const { data: awvResponse, error: apiError } =
  await api.awv.generate.post({ note_id: id })
```

**Benefits:**
- ✅ Compile-time API contract validation
- ✅ Auto-complete for all endpoints
- ✅ Type inference for request/response
- ✅ No manual API type definitions

### 2.4 AI Integration Architecture

**Two-Repository Pattern:**

1. **OrbVoice** (this repo): Mobile + Backend
2. **OrbVoiceServices** (`../04_OrbVoiceServices`): Python FastAPI AI service

**Service Communication:**
```typescript
// /apps/server/src/features/awv/awv.service.ts:89-95
const formData = new FormData()
formData.append("transcription", transcription)
formData.append("prompt_version", "latest")

const awvUrl = `${Env.AI_SERVICE_URL}/generate-awv`
const res = await fetch(awvUrl, { method: "POST", body: formData })
```

**AI Service URL:** Environment variable `AI_SERVICE_URL`
- Local: `http://localhost:8001`
- Production: (configured in deployment)

**AI Endpoints:**
- `/generate-soap` - SOAP notes
- `/generate-discharge` - Discharge summaries
- `/generate-awv` - Annual Wellness Visit
- `/generate-bhi` - Behavioral Health Integration
- `/generate-tcm` - Transition Care Management
- `/phq9/generate` - PHQ-9 depression screening
- `/generate-sdoh` - Social Determinants of Health
- `/generate-billing-simplified` - Billing optimization

---

## 3. Developer Workflow

### 3.1 Creating a New Form (Step-by-Step)

**Prerequisites:**
1. AI endpoint exists in `04_OrbVoiceServices` repository
2. Test AI endpoint with `curl localhost:8001/endpoint`

**Phase 1: Backend Implementation**

1. **Create Types** (`/apps/server/src/features/{feature}/{feature}.types.ts`)
```typescript
export interface FeatureDocument {
  id?: string
  note_id: string
  created_at?: string
  updated_at?: string
  document: {
    // Feature-specific fields
  }
  suggested_billing_code: string
  estimated_revenue: string
  completeness_score: number
  missing_components: string[]
  compliance_notes: string[]
}

export type FeatureResponse = FeatureDocument
```

2. **Create Service** (`/apps/server/src/features/{feature}/{feature}.service.ts`)
```typescript
import { Env } from "~/config"

export class FeatureService {
  constructor(private userId: string) {}

  async generateFeature(transcription: string, noteId: string): Promise<FeatureResponse> {
    const formData = new FormData()
    formData.append("transcription", transcription)

    const res = await fetch(`${Env.AI_SERVICE_URL}/generate-feature`, {
      method: "POST",
      body: formData
    })

    const json = await res.json()
    return FeatureResponseSchema.parse(json) // Zod validation
  }
}
```

3. **Create Router** (`/apps/server/src/features/{feature}/{feature}.router.ts`)
```typescript
export const featureRouter = new Elysia({ name: "feature", prefix: "/feature" })
  .use(setupContext)
  .use(rateLimitPerNote)
  .post("/generate", async ({ services, body }) => {
    const [err, transcript] = await asyncWrap(() =>
      services.note.getNoteTranscriptions(body.note_id)
    )

    const [generateErr, doc] = await asyncWrap(() =>
      services.feature.generateFeature(transcript, body.note_id)
    )

    // Optional: Persist to encounters table
    await services.encounters.upsert(body.note_id, clinicalFacts, "feature", metadata)

    return doc
  }, {
    body: t.Object({ note_id: t.String() })
  })
```

4. **Register Router** (`/apps/server/src/index.ts`)
```typescript
import { featureRouter } from "./features/feature/feature.router"
export * from "./features/feature/feature.types"

const app = new Elysia()
  .group("/api", (app) => app
    .use(featureRouter)  // Add this line
    // ... other routers
  )
```

**Phase 2: Frontend Implementation**

5. **Create Hook** (`/apps/expo/src/features/notes/hooks/useFeatureDocumentGeneration.ts`)
```typescript
export interface FeatureDocument {
  // Mirror backend types
}

export function useFeatureDocumentGeneration(_noteId: string) {
  const { generate, isGenerating, document, error } =
    useDocumentGeneration<FeatureDocument>({
      featureName: "Feature document",
      endpoint: async (id) => {
        const { data, error } = await api.feature.generate.post({ note_id: id })
        if (error) return { data: null, error }

        return {
          data: { ...data, note_id: id, created_at: new Date().toISOString() },
          error: null
        }
      },
      toastId: "feature-generation",
      performanceId: "genFeature_performance"
    })

  return { generateFeature: generate, isGenerating, featureDocument: document, error }
}
```

6. **Create Bottom Sheet** (`/apps/expo/src/features/notes/components/FeatureDocumentBottomSheet.tsx`)
```typescript
export default function FeatureDocumentBottomSheet({ open, onClose }) {
  const { generateFeature, isGenerating, featureDocument } = useFeatureDocumentGeneration(noteId)

  // Auto-generate on open
  useEffect(() => {
    if (open && !featureDocument && !isGenerating) {
      generateFeature(noteId)
    }
  }, [open, featureDocument, isGenerating, generateFeature, noteId])

  return (
    <BottomSheetModal ref={bottomSheetRef} snapPoints={["92%"]}>
      <View className="flex-1">
        {/* Header with close, title, copy, share */}
        <BottomSheetScrollView>
          {isGenerating ? <LoadingState /> :
           !featureDocument ? <EmptyState /> :
           <DocumentSection spacing="relaxed">
             <SectionHeader title="Section" subtitle="Description" />
             <DataField label="Field" value={featureDocument.field} />
             <SectionDivider />
             {/* More sections */}
           </DocumentSection>
          }
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  )
}
```

7. **Add to Note Details** (`/apps/expo/src/app/(authenticated)/notes/[id]/note-details.page.tsx`)
```typescript
// Add state
const [featureOpen, setFeatureOpen] = useState(false)

// Add to carousel sections
{ label: "Feature", onPress: () => setFeatureOpen(true) }

// Add bottom sheet
<FeatureDocumentBottomSheet open={featureOpen} onClose={() => setFeatureOpen(false)} />
```

**Phase 3: Testing & Deployment**

8. **Local Testing**
```bash
# Terminal 1: Start backend
cd apps/server
bun --env-file=.env dev

# Terminal 2: Start AI service
cd ../04_OrbVoiceServices/pydantic-backend
python3 -m uvicorn app.main:app --port 8001 --reload

# Terminal 3: Start mobile app
cd apps/expo
npm start  # Press 'i' for iOS
```

9. **Use Existing Note** (CRITICAL: Do NOT create new recordings)
```sql
-- Find existing notes in local DB
SELECT n.id, n.title FROM notes n
WHERE n.user_id = 'uQa9XtC0tNhSdypvIWdpPAcI6mh2'
ORDER BY n.created_at DESC LIMIT 10;
```

10. **Create PR for Jamal Review**
```bash
git checkout -b feature/add-feature-form
git add .
git commit -m "Add Feature form with medical primitives"
git push origin feature/add-feature-form
# Open PR on GitHub
```

### 3.2 File Structure Conventions

**Backend Pattern:**
```
/apps/server/src/features/{feature}/
├── {feature}.router.ts      # Elysia routes
├── {feature}.service.ts     # Business logic, AI calls
└── {feature}.types.ts       # TypeScript interfaces
```

**Frontend Pattern:**
```
/apps/expo/src/features/notes/
├── components/
│   └── {Feature}DocumentBottomSheet.tsx
├── hooks/
│   └── use{Feature}DocumentGeneration.ts
└── store/
    └── {feature}Store.tsx (if needed)
```

**Medical UI Components:**
```
/apps/expo/src/components/medical/
├── DocumentSection.tsx
├── SectionHeader.tsx
├── DataField.tsx
├── DocumentText.tsx
├── SectionDivider.tsx
└── index.ts
```

### 3.3 Testing Approach

**Current State:** ❌ No automated tests

**Test Files Found:** Only in node_modules (third-party libraries)

**Testing Pattern (Manual):**
1. Use existing notes in local database
2. Test form generation with real transcriptions
3. Verify UI renders all sections correctly
4. Test copy/share functionality
5. Check billing code accuracy
6. Validate completeness scoring

**Recommended (Not Implemented):**
```bash
# Unit tests (proposed)
/apps/expo/src/__tests__/
  hooks/useDocumentGeneration.test.ts
  components/medical/DataField.test.tsx

# Integration tests (proposed)
/apps/server/src/__tests__/
  features/awv/awv.integration.test.ts
```

### 3.4 Deployment Considerations

**Backend Deployment:**
- **Platform:** Google Cloud Run
- **Command:** `gcloud run deploy orbvoice-v2 --source .`
- **Container:** Built from `/Dockerfile`
- **Environment:** Production DATABASE_URL configured via Cloud Run environment variables

**Mobile Deployment:**
- **Platform:** TestFlight (iOS), Google Play (Android)
- **Build Commands:**
  ```bash
  # iOS Production
  cd apps/expo
  eas build -p ios --profile production --local

  # Android APK
  eas build -p android --profile preview --local

  # Android AAB
  eas build -p android --profile production --local
  ```

**Database Migrations:**
- ⚠️ **CRITICAL:** All database changes require Jamal approval
- **Safety:** Additive only (CREATE TABLE, ALTER TABLE ADD COLUMN)
- **Forbidden:** DROP, TRUNCATE, UPDATE, DELETE, materialized views
- **Protection:** Automated safety checks via `/packages/db/scripts/validate-schema-safety.ts`

**Deployment Checklist:**
1. ✅ Local testing with `DEV_DATABASE_URL`
2. ✅ PR created with clear description
3. ✅ Jamal approval (especially for DB changes)
4. ✅ Backend deployed to Cloud Run
5. ✅ Mobile build submitted to TestFlight
6. ✅ Monitor production logs for errors

---

## 4. Code Duplication Analysis

### 4.1 Common Patterns Across Forms

**Duplicated Pattern: Bottom Sheet Structure**

All 7 forms follow identical structure:
```typescript
// AWVDocumentBottomSheet, BHIDocumentBottomSheet, TCMDocumentBottomSheet, SDOHDocumentBottomSheet

const bottomSheetRef = useRef<BottomSheetModal>(null)
const snapPoints = useMemo(() => ["92%"], [])
const { top } = useSafeAreaInsets()

// Auto-generate on open
useEffect(() => {
  if (open && !document && !isGenerating) {
    generateDocument(noteId)
  }
}, [open, document, isGenerating, generateDocument, noteId])

// Header: close button, title, copy button, share button
// Content: Loading state, empty state, or DocumentSection tree
// Copy/Share: Identical logic with different content formatting
```

**Duplication Metrics:**
- **Bottom Sheet Setup:** ~50 lines duplicated across 7 forms
- **Copy/Share Logic:** ~100 lines duplicated per form (formatting differs)
- **Loading/Empty States:** ~30 lines duplicated across 7 forms

**Duplicated Pattern: Hook Structure**

All generation hooks follow same pattern:
```typescript
// useAWVDocumentGeneration, useBHIDocumentGeneration, useTCMDocumentGeneration

export function useFeatureDocumentGeneration(_noteId: string) {
  const { generate, isGenerating, document, error } =
    useDocumentGeneration<FeatureDocument>({
      featureName: "Feature document",
      endpoint: async (id) => {
        const { data, error } = await api.feature.generate.post({ note_id: id })
        if (error) return { data: null, error }
        return { data: { ...data, note_id: id, created_at: new Date().toISOString() }, error: null }
      },
      toastId: "feature-generation",
      performanceId: "genFeature_performance"
    })

  return { generateFeature: generate, isGenerating, featureDocument: document, error }
}
```

**Duplication Metrics:**
- **Hook Boilerplate:** ~30 lines duplicated across 7 forms
- **Helper Functions:** 3-5 helper functions per form (status colors, completion summary, billing text)

**Duplicated Pattern: Backend Service**

All services follow same structure:
```typescript
// AWVService, BHIService, TCMService

export class FeatureService {
  constructor(private userId: string) {}

  async generateFeature(transcription: string, noteId: string): Promise<FeatureResponse> {
    console.log(`[FEATURE_SERVICE] Starting generation for user ${this.userId}, note ${noteId}`)

    const formData = new FormData()
    formData.append("transcription", transcription)
    formData.append("prompt_version", "latest")

    const featureUrl = `${Env.AI_SERVICE_URL}/generate-feature`
    const res = await fetch(featureUrl, { method: "POST", body: formData })

    if (!res.ok) {
      throw logError("FEATURE_SERVICE", `User (${this.userId}) failed to generate. Error: ${res.status}`)
    }

    const json = await res.json()
    const { data, error } = FeatureResponseSchema.safeParse(json)
    if (error) throw logError("FEATURE_SERVICE_VALIDATION", error)

    return data
  }
}
```

**Duplication Metrics:**
- **Service Boilerplate:** ~60 lines duplicated across 7 services
- **Zod Validation Schemas:** 30-100 lines per feature (similar structure)

### 4.2 Duplicated Logic

**Copy/Share Content Formatting**

Every form duplicates copy/share logic:
```typescript
// Duplicated in AWVDocumentBottomSheet:58-105, BHIDocumentBottomSheet:58-101, etc.

const copyContent = useCallback(() => {
  if (!document) return

  let content = "DOCUMENT TITLE\n"
  content += `${"=".repeat(50)}\n\n`

  // Section-specific formatting (varies per form)
  content += "SECTION:\n"
  content += `Field: ${document.field}\n\n`

  // Billing (identical across all forms)
  content += "BILLING INFORMATION:\n"
  content += `CPT Code: ${document.suggested_billing_code}\n`
  content += `Est. Revenue: ${document.estimated_revenue}\n\n`

  content += `${"=".repeat(50)}\n`
  content += `Generated: ${fullDateFormat(new Date())}\n`
  content += "Source: OrbVoice Tool"

  Clipboard.setString(content)
  Alert.alert("Copied", "Document copied to clipboard!")
}, [document])
```

**Estimated Lines Duplicated:** ~700 lines total (100 lines × 7 forms)

**Completeness/Status Logic**

Every form duplicates status color logic:
```typescript
// Duplicated in useAWVDocumentGeneration:139-151, useBHIDocumentGeneration:149-161, etc.

export function getFeatureStatusColor(
  document: FeatureDocument | undefined
): "critical" | "at_risk" | "stable" | "neutral" {
  if (!document) return "neutral"

  const completion = document.completeness_score ?? 0
  const missingComponents = document.missing_components.length

  if (missingComponents > 0) return "critical"
  if (completion < 80) return "at_risk"
  if (completion >= 90) return "stable"
  return "neutral"
}
```

**Estimated Lines Duplicated:** ~350 lines total (50 lines × 7 forms)

### 4.3 Opportunities for Abstraction

**Opportunity 1: Generic Bottom Sheet Component**

Create `GenericDocumentBottomSheet.tsx`:
```typescript
interface GenericDocumentBottomSheetProps<T> {
  open: boolean
  onClose: () => void
  title: string
  useGeneration: (noteId: string) => {
    generate: (id: string) => void
    isGenerating: boolean
    document: T | undefined
    error: any
  }
  renderContent: (document: T) => React.ReactNode
  formatCopyContent: (document: T) => string
}

export function GenericDocumentBottomSheet<T>({ ... }) {
  // Common bottom sheet logic
  // Common header with close, copy, share
  // Common loading/empty states
  // Render content via renderContent prop
}
```

**Savings:** ~350 lines (eliminate 50 lines × 7 forms)

**Opportunity 2: Generic Generation Hook**

Already partially abstracted via `useDocumentGeneration` - could extract more:
```typescript
// Current abstraction (apps/expo/src/features/notes/hooks/useDocumentGeneration.ts:27-101)
export function useDocumentGeneration<TData>({ featureName, endpoint, toastId, performanceId }) {
  // Handles: mutation, loading, error, query invalidation, performance logging
}

// Further abstraction: createFeatureGenerationHook factory
export function createFeatureGenerationHook<T>(config: {
  featureName: string
  apiEndpoint: (api: typeof api) => (params: { note_id: string }) => Promise<T>
}) {
  return (noteId: string) => useDocumentGeneration<T>({ ... })
}
```

**Savings:** ~140 lines (eliminate 20 lines × 7 hooks)

**Opportunity 3: Generic Service Class**

Create `BaseDocumentService`:
```typescript
export abstract class BaseDocumentService<TResponse> {
  constructor(protected userId: string) {}

  abstract get endpointPath(): string
  abstract get validationSchema(): z.ZodSchema<TResponse>

  async generate(transcription: string, noteId: string): Promise<TResponse> {
    // Common FormData creation
    // Common fetch logic
    // Common validation
    // Feature-specific endpoint via abstract property
  }
}

export class AWVService extends BaseDocumentService<AWVResponse> {
  get endpointPath() { return "/generate-awv" }
  get validationSchema() { return AWVResponseSchema }
}
```

**Savings:** ~280 lines (eliminate 40 lines × 7 services)

**Opportunity 4: Copy/Share Utilities**

Create `documentCopyUtils.ts`:
```typescript
export interface DocumentCopyConfig<T> {
  title: string
  sections: Array<{
    heading: string
    formatter: (doc: T) => string
  }>
  toolName: string
}

export function createCopyHandler<T>(config: DocumentCopyConfig<T>) {
  return (document: T | undefined) => {
    if (!document) return

    let content = `${config.title}\n${"=".repeat(50)}\n\n`

    config.sections.forEach(section => {
      content += `${section.heading}:\n${section.formatter(document)}\n\n`
    })

    content += `${"=".repeat(50)}\n`
    content += `Generated: ${fullDateFormat(new Date())}\n`
    content += `Source: ${config.toolName}`

    Clipboard.setString(content)
    Alert.alert("Copied", `${config.title} copied to clipboard!`)
  }
}
```

**Savings:** ~420 lines (eliminate 60 lines × 7 forms)

### 4.4 Total Duplication Summary

**Current Duplication:**
- Bottom Sheet Structure: ~350 lines
- Hook Boilerplate: ~140 lines
- Service Boilerplate: ~280 lines
- Copy/Share Logic: ~420 lines
- Status/Helper Functions: ~350 lines

**Total Duplicated Lines:** ~1,540 lines across 7 forms

**Potential Savings with Abstraction:** ~1,190 lines (77% reduction)

**Trade-offs:**
- ✅ Pro: Significant code reduction, easier maintenance
- ✅ Pro: Consistent behavior across all forms
- ❌ Con: Additional abstraction complexity
- ❌ Con: Less explicit, harder to customize individual forms
- ❌ Con: Requires TypeScript generics expertise

**Recommendation:**
- **High Priority:** Extract copy/share utilities (~420 lines saved)
- **Medium Priority:** Create generic bottom sheet component (~350 lines saved)
- **Low Priority:** Abstract services (stable pattern, low change frequency)

---

## 5. Architecture Decision Records (ADRs)

### ADR-001: Medical Primitives Migration (October 2025)

**Status:** ✅ In Progress (PHQ-9 complete, BHI/AWV/TCM ready)

**Context:**
- Forms were using Card-based components (shadcn/ui style)
- Needed iOS Health Records aesthetic for premium medical feel
- Copy/paste to EHR workflow requires clean, typography-first design

**Decision:**
- Migrate reimbursement forms to medical primitives
- Typography-first, minimal chrome, subtle dividers
- Card-less display (like iOS Notes app)

**Consequences:**
- ✅ Consistent premium UI across all forms
- ✅ Better EHR integration (clean copy/paste)
- ✅ CMS-compliant field presentation
- ❌ Manual migration effort per form
- ❌ Two UI systems temporarily coexist

**Forms NOT Migrating:**
- SOAP/Discharge: Editable, different UX requirements
- Billing: Complex tables, different visualization needs
- Timeline: Unique chronological view

### ADR-002: Unified Encounters Table (September 2025)

**Status:** ✅ Complete

**Context:**
- Each form had separate database table
- Duplicate patient data across tables
- Difficult to query unified patient record

**Decision:**
- Two-tier JSONB model:
  - `clinical_facts`: Shared data (medications, allergies, vitals)
  - `form_metadata`: Form-specific compliance fields
- Non-blocking persistence pattern (form generation succeeds even if persistence fails)

**Consequences:**
- ✅ Unified patient data model
- ✅ Easier cross-form queries
- ✅ Reduced data duplication
- ❌ JSONB schema complexity
- ❌ Migration effort for existing forms

**Implementation:**
```typescript
// /apps/server/src/features/awv/awv.router.ts:39-99
await services.encounters.upsert(
  body.note_id,
  {
    medications: awv.document.medical_history?.current_medications ?? [],
    allergies: awv.document.medical_history?.allergies ?? [],
    chronic_conditions: awv.document.medical_history?.chronic_conditions ?? [],
    // ... more clinical facts
  },
  "awv",
  {
    visit_type: awv.document.visit_type,
    completeness_score: awv.completeness_score,
    // ... form-specific metadata
  }
)
```

### ADR-003: Eden Treaty for Type Safety (2025)

**Status:** ✅ Complete

**Context:**
- Manual API type definitions led to type mismatches
- Frontend/backend type drift caused runtime errors
- No compile-time API contract validation

**Decision:**
- Use Eden Treaty (@elysiajs/eden) for end-to-end type inference
- Export server types via `export type ServerType = typeof app`
- Frontend uses `treaty<ServerType>()` for typed API client

**Consequences:**
- ✅ Compile-time API contract validation
- ✅ Auto-complete for all endpoints
- ✅ Zero manual type definitions
- ✅ Type-safe request/response
- ❌ Tight coupling between frontend/backend
- ❌ Requires monorepo or published types package

**Example:**
```typescript
// Backend exports types automatically
export type ServerType = typeof app

// Frontend gets full type safety
const api = treaty<ServerType>(baseUrl)
const { data } = await api.awv.generate.post({ note_id: "123" })
// `data` is fully typed as AWVResponse
```

### ADR-004: Legend State vs useState (2024)

**Status:** ✅ Complete

**Context:**
- React useState caused excessive re-renders in complex forms
- Needed fine-grained reactivity for large documents
- Required optimistic updates without re-render storms

**Decision:**
- Use Legend State for local form state
- Observables with `.peek()` (read without subscribing) and `.set()` (update)
- Pair with TanStack Query for server state

**Consequences:**
- ✅ Fine-grained reactivity (only re-render what changed)
- ✅ Excellent performance for large documents
- ✅ Optimistic updates without flicker
- ❌ Learning curve for team
- ❌ Two state systems to understand (Legend + React Query)

**Pattern:**
```typescript
// Create observable store
export const useSDOHStore = observable({
  sdohDocument: { ... }
})

// Read without subscribing (no re-render)
const noteId = store$.id.peek()

// Subscribe to updates (component re-renders on change)
const sdohDocument = useSelector(sdohStore$.sdohDocument)

// Update
sdohStore$.sdohDocument.set(newDocument)
```

### ADR-005: Non-Blocking Persistence (2025)

**Status:** ✅ Complete

**Context:**
- Database persistence failures should not block AI-generated forms
- Users need to see forms even if database is down
- Form generation is the critical path, persistence is secondary

**Decision:**
- Form generation returns success even if encounters persistence fails
- Log errors but don't throw on persistence failures
- Frontend gets form data regardless of database state

**Consequences:**
- ✅ Better user experience (always see generated forms)
- ✅ Resilient to database issues
- ✅ AI generation is the source of truth
- ❌ Potential data loss if persistence consistently fails
- ❌ Harder to debug missing encounter data

**Implementation:**
```typescript
// /apps/server/src/features/awv/awv.router.ts:93-99
const [encounterErr] = await asyncWrap(() =>
  services.encounters.upsert(...)
)
if (encounterErr) {
  console.error("[AWV_GENERATE] Error persisting to encounters:", encounterErr)
  // Don't fail the request - AWV was generated successfully
}

console.log("[AWV_GENERATE] Successfully generated AWV document")
return awv  // Return even if persistence failed
```

---

## 6. Key Insights & Recommendations

### 6.1 Architecture Strengths

1. **Consistent Pattern-Based Approach**
   - All 7 forms follow identical architecture
   - Easy to onboard new developers (learn one, know all)
   - Predictable file locations and naming conventions

2. **Type Safety End-to-End**
   - Eden Treaty eliminates API type mismatches
   - Zod validation on backend
   - TypeScript strict mode throughout

3. **Medical-First Design System**
   - Custom medical primitives for healthcare UX
   - iOS Health Records aesthetic
   - Color-coded severity system (critical/warning/stable/info)

4. **Resilient Architecture**
   - Non-blocking persistence (forms succeed even if DB fails)
   - Queue system prevents concurrent generation race conditions
   - Graceful error handling with user-friendly messages

5. **AI-First Workflow**
   - Voice → Transcription → AI → Form pipeline
   - Automatic form generation on tab open
   - CMS-compliant output optimized for billing

### 6.2 Architecture Weaknesses

1. **High Code Duplication** (~1,540 lines duplicated)
   - Bottom sheet structure repeated 7 times
   - Copy/share logic duplicated across all forms
   - Helper functions (status colors, completion summary) duplicated

2. **No Automated Testing**
   - Zero unit tests for hooks/components
   - Zero integration tests for backend services
   - Manual testing only (error-prone, time-consuming)

3. **Tight Coupling to AI Service**
   - All forms depend on external Python FastAPI service
   - No fallback if AI service is down
   - No caching of AI responses (regenerate on every open)

4. **Database Migration Risk**
   - Manual migration process (no automated rollback)
   - June 3, 2025 disaster: TRUNCATE wiped production data
   - Protection system added, but process still manual

5. **Two-Repository Complexity**
   - AI service in separate repo (`04_OrbVoiceServices`)
   - Requires running two services for development
   - Version sync challenges between repos

### 6.3 Immediate Improvement Opportunities

**High Priority:**

1. **Extract Copy/Share Utilities** (~420 lines saved)
   - Create `documentCopyUtils.ts` with generic formatter
   - Reduce duplication by 30%
   - Effort: 1-2 days

2. **Add Basic Unit Tests**
   - Test medical primitives components
   - Test `useDocumentGeneration` hook
   - Test Zod validation schemas
   - Effort: 3-5 days

3. **Cache AI Responses**
   - Store generated forms in database
   - Only regenerate if transcription changed
   - Reduce AI service load by ~80%
   - Effort: 2-3 days

**Medium Priority:**

4. **Generic Bottom Sheet Component** (~350 lines saved)
   - Extract common modal structure
   - Props for content rendering
   - Effort: 2-3 days

5. **Integration Tests for Backend**
   - Test full generation flow (transcription → AI → persistence)
   - Mock AI service responses
   - Effort: 3-5 days

6. **Deployment Automation**
   - CI/CD pipeline for backend
   - Automated TestFlight builds
   - Database migration safety checks
   - Effort: 5-7 days

**Low Priority:**

7. **Abstract Service Layer** (~280 lines saved)
   - Create `BaseDocumentService`
   - DRY principle for AI service calls
   - Effort: 2-3 days

8. **Progressive Form Features**
   - Progressive HPI (AI endpoint exists, no mobile UI)
   - Timeline feature (AI endpoint exists, shows "under construction")
   - Effort: 5-10 days per feature

### 6.4 Long-Term Architectural Considerations

1. **Offline Support**
   - Current: Requires network for AI generation
   - Future: Cache transcriptions, queue AI requests offline
   - Impact: Alabama GI Center feature request (PR #13)

2. **Real-Time Collaboration**
   - Current: Single-user note editing
   - Future: Multi-provider collaboration on same note
   - Impact: Requires WebSocket or polling infrastructure

3. **Form Versioning**
   - Current: No versioning, forms overwrite on regenerate
   - Future: Track form versions, allow rollback
   - Impact: Audit trail for compliance

4. **AI Response Caching Strategy**
   - Current: Regenerate on every modal open
   - Future: Smart cache invalidation based on transcription changes
   - Impact: 80% reduction in AI service costs

5. **Database Schema Evolution**
   - Current: Manual migrations with safety checks
   - Future: Automated migration system with rollback
   - Impact: Reduce deployment risk, faster iteration

6. **Modular AI Service**
   - Current: Monolithic Python FastAPI service
   - Future: Microservices per form type (AWV, BHI, etc.)
   - Impact: Independent scaling, faster deployments

---

## 7. Technology Stack Summary

### Frontend Dependencies (React Native)
```json
{
  "react": "19.0.0",
  "react-native": "0.79.2",
  "expo": "^53.0.9",
  "@legendapp/state": "^3.0.0-beta.26",
  "@tanstack/react-query": "^5.76.0",
  "@gorhom/bottom-sheet": "^5.1.4",
  "nativewind": "4.1.23",
  "@elysiajs/eden": "^1.3.2",
  "zod": "^3.24.4"
}
```

### Backend Dependencies (Bun.js)
```json
{
  "bun": "1.2.12",
  "elysia": "^1.3.1",
  "@elysiajs/swagger": "^1.3.0",
  "@orbvoice/db": "workspace:*",
  "@deepgram/sdk": "^4.1.0",
  "@google-cloud/storage": "^7.16.0",
  "pino": "^9.6.0",
  "uuid": "^11.1.0"
}
```

### Database Stack
```
PostgreSQL (GCP Cloud SQL)
├── Drizzle ORM (type-safe queries)
├── Zod (runtime validation)
└── TypeBox (compile-time schemas)
```

### AI Integration
```
OrbVoiceServices (Python FastAPI)
├── Endpoints: /generate-{awv,bhi,tcm,sdoh,phq9,soap,discharge,billing}
├── Input: Transcription text + prompt version
└── Output: Structured medical document (validated via Zod)
```

---

## 8. Developer Quick Reference

### Key File Locations

**Frontend:**
- Bottom Sheets: `/apps/expo/src/features/notes/components/*DocumentBottomSheet.tsx`
- Hooks: `/apps/expo/src/features/notes/hooks/use*Generation.ts`
- Stores: `/apps/expo/src/features/notes/store/*Store.tsx`
- Medical UI: `/apps/expo/src/components/medical/`
- API Client: `/apps/expo/src/lib/api.ts`

**Backend:**
- Routers: `/apps/server/src/features/*/router.ts`
- Services: `/apps/server/src/features/*/service.ts`
- Types: `/apps/server/src/features/*/types.ts`
- Main Entry: `/apps/server/src/index.ts`

**Database:**
- Schemas: `/packages/db/src/schema/`
- Migrations: `/packages/db/drizzle/`
- Safety Script: `/packages/db/scripts/validate-schema-safety.ts`

### Common Commands

**Development:**
```bash
# Start backend (Terminal 1)
cd apps/server && bun --env-file=.env dev

# Start AI service (Terminal 2)
cd ../04_OrbVoiceServices/pydantic-backend
python3 -m uvicorn app.main:app --port 8001 --reload

# Start mobile app (Terminal 3)
cd apps/expo && npm start

# Database studio
cd packages/db && bun db:studio
```

**Deployment:**
```bash
# Backend to Cloud Run
gcloud run deploy orbvoice-v2 --source .

# iOS to TestFlight
cd apps/expo && eas build -p ios --profile production --local

# Android APK
eas build -p android --profile preview --local
```

**Database:**
```bash
# Generate migration (local only)
cd packages/db && bun db:gen

# Run migration (local only)
bun db:migrate

# Safety check
bun run db:check-safety
```

### Environment Variables

**Backend (`/apps/server/.env`):**
```bash
DB_HOST=localhost              # Production: 34.72.76.216
DB_USER=abdusmuwwakkil        # Production: orbvoice-prod
DB_PASS=                       # Production: [encrypted]
DB_NAME=orbdoc_dev            # Production: postgres
AI_SERVICE_URL=http://localhost:8001  # Production: [deployed URL]
```

**Frontend (`/apps/expo/.env`):**
```bash
EXPO_PUBLIC_BASE_URL=http://127.0.0.1:3001  # Local backend
# Production: https://orbvoice-v2-405707887245.us-central1.run.app
```

### Medical Severity Colors

```typescript
critical: "#dc2626"  // Red-600  - High risk, immediate attention
warning:  "#f59e0b"  // Amber-500 - At risk, monitor closely
stable:   "#10b981"  // Green-500 - Normal, within range
info:     "#3b82f6"  // Blue-500  - Informational, neutral
```

### API Endpoints

**Form Generation:**
- `POST /api/awv/generate` - Annual Wellness Visit
- `POST /api/bhi/generate` - Behavioral Health Integration
- `POST /api/tcm/generate` - Transition Care Management
- `POST /api/sdoh/generate` - Social Determinants of Health
- `POST /api/phq9/generate` - PHQ-9 Depression Screening
- `POST /api/soap/generate` - SOAP Notes
- `POST /api/discharge/generate` - Discharge Summaries
- `POST /api/billing/generate-direct` - Billing Optimization

**Utilities:**
- `GET /healthcheck` - Server health
- `GET /warmup` - Container warmup (reduces cold start)

---

## 9. Glossary

**AWV** - Annual Wellness Visit (Medicare preventive care visit)
**BHI** - Behavioral Health Integration (psychiatric care coordination)
**TCM** - Transition Care Management (post-discharge care)
**SDOH** - Social Determinants of Health (social needs screening)
**PHQ-9** - Patient Health Questionnaire-9 (depression screening)
**SOAP** - Subjective, Objective, Assessment, Plan (clinical note format)
**CPT Code** - Current Procedural Terminology (billing code)
**ICD-10** - International Classification of Diseases, 10th Edition
**CMS** - Centers for Medicare & Medicaid Services
**EHR** - Electronic Health Record
**Eden Treaty** - TypeScript library for end-to-end type safety with Elysia
**Legend State** - Observable-based reactive state management
**Drizzle ORM** - TypeScript ORM for SQL databases
**Zod** - TypeScript schema validation library
**Bun** - JavaScript runtime (3x faster than Node.js)
**Elysia** - Type-safe web framework for Bun

---

## Appendices

### Appendix A: Form Type Comparison Matrix

| Form | CPT Code | Revenue | Auto-Generate | Medical Primitives | Database Persistence | Editable |
|------|----------|---------|---------------|-------------------|---------------------|----------|
| AWV | G0438/G0439 | $166-232 | ✅ | ✅ Ready | ✅ Encounters | ❌ |
| BHI | 99484 | $64-72/mo | ✅ | ✅ Ready | ✅ Encounters | ❌ |
| TCM | 99495/99496 | $200-270 | ✅ | ✅ Ready | ✅ Encounters | ❌ |
| SDOH | G0136 | $18 | ✅ | ✅ Complete | ✅ Encounters | ❌ |
| PHQ-9 | 96127 | $5-15 | ✅ | ✅ Complete | ✅ Encounters | ✅ |
| SOAP | 99213-99215 | $110-210 | ✅ | ❌ Card-based | ✅ Direct table | ✅ |
| Discharge | N/A | N/A | ✅ | ❌ Card-based | ✅ Direct table | ✅ |
| Billing | Multiple | Optimized | ✅ | ❌ Table-based | ⚠️ Schema ready | ❌ |

### Appendix B: AI Service Endpoint Specification

**Request Format:**
```typescript
POST /generate-{feature}
Content-Type: multipart/form-data

{
  transcription: string       // Full conversation text
  prompt_version: "latest"    // AI prompt version
}
```

**Response Format:**
```typescript
{
  document: {
    // Feature-specific nested structure
    // Example: AWV has health_risk_assessment, medical_history, etc.
  },
  missing_components: string[],      // CMS-required fields not found
  compliance_notes: string[],        // Warnings/recommendations
  suggested_billing_code: string,    // CPT code
  estimated_revenue: string,         // Dollar amount
  completeness_score: number         // 0-100 percentage
}
```

### Appendix C: Database Schema Pattern

**Encounters Table (Unified Storage):**
```sql
CREATE TABLE encounters (
  id UUID PRIMARY KEY,
  note_id UUID REFERENCES notes(id),
  user_id TEXT NOT NULL,

  -- Clinical Facts (JSONB - shared across forms)
  clinical_facts JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Form-specific Metadata (JSONB)
  form_type TEXT NOT NULL,  -- 'awv', 'bhi', 'tcm', etc.
  form_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Clinical Facts Structure:**
```json
{
  "medications": ["Lisinopril 10mg daily", "Metformin 500mg BID"],
  "allergies": ["Penicillin - Rash"],
  "chronic_conditions": ["Type 2 Diabetes", "Hypertension"],
  "vital_signs": {
    "blood_pressure": "130/80",
    "heart_rate": "72",
    "weight": "180 lbs"
  },
  "immunizations": ["Flu vaccine 2024", "Pneumococcal vaccine"],
  "screenings": {
    "vision": true,
    "hearing": false,
    "depression": true
  }
}
```

**Form Metadata Structure (AWV Example):**
```json
{
  "visit_type": "Initial AWV",
  "visit_date": "2025-10-04",
  "provider_name": "Dr. Smith",
  "advance_directive_discussed": true,
  "cognitive_assessment_performed": true,
  "completeness_score": 95,
  "suggested_billing_code": "G0438",
  "estimated_revenue": "$166",
  "missing_components": [],
  "compliance_notes": ["Advance directive on file"]
}
```

---

**Document Version:** 1.0
**Last Updated:** October 4, 2025
**Next Review:** After BHI/AWV/TCM medical primitives migration complete
