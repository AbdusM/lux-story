export type EventBusEventStatus = 'active' | 'planned' | 'deprecated'

export type EventBusEventMeta = {
  status: EventBusEventStatus
  owner: string
  description: string
}

/**
 * Event bus lifecycle registry (AAA)
 *
 * Purpose:
 * - Prevent spec bloat / "roadmap events" being treated as live contracts.
 * - Make ownership explicit.
 * - Enable debt-controlled cleanup (planned/deprecated) over time.
 *
 * Canonical event list remains `lib/event-bus.ts` (`GameEventMap`).
 * Tooling (report-feature-inventory + verify-analytics-dictionary) cross-checks this registry.
 */
export const EVENT_BUS_EVENT_META: Record<string, EventBusEventMeta> = {
  // ─────────────────────────────────────────────────────────────────────────
  // GAME (active surface)
  // ─────────────────────────────────────────────────────────────────────────
  'game:state:changed': { status: 'active', owner: 'core', description: 'Core state machine transitions (high-level).' },
  'game:scene:transition': { status: 'active', owner: 'core', description: 'Scene transitions (from/to + optional duration).' },
  'game:message:received': { status: 'active', owner: 'core', description: 'New message appended (non-streaming).' },
  'game:message:streaming': { status: 'active', owner: 'core', description: 'Streaming message chunks + completion signal.' },
  'game:presence:updated': { status: 'active', owner: 'core', description: 'Presence changes (typing/online/etc).' },
  'game:trust:changed': { status: 'active', owner: 'core', description: 'Trust delta for a character.' },

  // ─────────────────────────────────────────────────────────────────────────
  // GAME (planned surface)
  // ─────────────────────────────────────────────────────────────────────────
  'game:relationship:updated': { status: 'planned', owner: 'narrative-systems', description: 'Relationship type changes (beyond trust).' },
  'game:platform:updated': { status: 'planned', owner: 'systems', description: 'Platform state changes (station locations/surfaces).' },
  'game:pattern:updated': { status: 'planned', owner: 'systems', description: 'Pattern totals updated (low-level event).' },
  'game:choice:made': { status: 'planned', owner: 'core', description: 'Choice made (legacy-style event payload).' },
  'game:emotional:stress': { status: 'planned', owner: 'systems', description: 'Emotional stress change event.' },
  'game:emotional:calm': { status: 'planned', owner: 'systems', description: 'Emotional calm change event.' },
  'game:cognitive:flow': { status: 'planned', owner: 'systems', description: 'Cognitive flow state change.' },
  'game:skills:updated': { status: 'planned', owner: 'systems', description: 'Skills updated (bulk).' },
  'game:dialogue:started': { status: 'planned', owner: 'narrative', description: 'Dialogue node started.' },
  'game:dialogue:completed': { status: 'planned', owner: 'narrative', description: 'Dialogue node completed (duration).' },
  'game:character:met': { status: 'planned', owner: 'narrative', description: 'Player met a character (first encounter).' },
  'game:pattern:discovered': { status: 'planned', owner: 'systems', description: 'Pattern discovery milestone reached.' },
  'game:pattern:threshold': { status: 'planned', owner: 'systems', description: 'Pattern threshold crossed (emerging/developing/flourishing).' },
  'game:skill:unlocked': { status: 'planned', owner: 'systems', description: 'Skill unlocked (optionally tied to a pattern).' },
  'game:simulation:started': { status: 'planned', owner: 'simulations', description: 'Simulation started.' },
  'game:simulation:completed': { status: 'planned', owner: 'simulations', description: 'Simulation completed (score/duration).' },
  'game:golden_prompt:achieved': { status: 'planned', owner: 'simulations', description: 'Golden prompt achieved (reward).' },
  'game:interrupt:available': { status: 'planned', owner: 'systems', description: 'Interrupt became available.' },
  'game:interrupt:taken': { status: 'planned', owner: 'systems', description: 'Interrupt taken.' },
  'game:interrupt:missed': { status: 'planned', owner: 'systems', description: 'Interrupt missed (timeout/ignored).' },
  'game:knowledge:gained': { status: 'planned', owner: 'systems', description: 'Knowledge flag gained.' },
  'game:arc:completed': { status: 'planned', owner: 'narrative', description: 'Story arc completed.' },
  'game:vulnerability:revealed': { status: 'planned', owner: 'narrative', description: 'Vulnerability reveal moment.' },

  // ─────────────────────────────────────────────────────────────────────────
  // UI (active surface)
  // ─────────────────────────────────────────────────────────────────────────
  'ui:message:show': { status: 'active', owner: 'ui', description: 'Transient UI message displayed.' },
  'ui:message:hide': { status: 'active', owner: 'ui', description: 'Transient UI message hidden.' },
  'ui:scene:show': { status: 'active', owner: 'ui', description: 'UI scene/panel displayed.' },
  'ui:scene:hide': { status: 'active', owner: 'ui', description: 'UI scene/panel hidden.' },

  // UI (planned surface)
  'ui:animation:start': { status: 'planned', owner: 'ui', description: 'Animation started.' },
  'ui:animation:complete': { status: 'planned', owner: 'ui', description: 'Animation completed.' },
  'ui:error:show': { status: 'planned', owner: 'ui', description: 'Error shown to user.' },
  'ui:error:hide': { status: 'planned', owner: 'ui', description: 'Error hidden.' },
  'ui:notification:display': { status: 'planned', owner: 'ui', description: 'Notification displayed.' },
  'ui:modal:opened': { status: 'planned', owner: 'ui', description: 'Modal opened.' },
  'ui:modal:closed': { status: 'planned', owner: 'ui', description: 'Modal closed.' },

  // ─────────────────────────────────────────────────────────────────────────
  // PERF (planned surface)
  // ─────────────────────────────────────────────────────────────────────────
  'perf:memory:warning': { status: 'planned', owner: 'perf', description: 'Memory usage warning.' },
  'perf:render:slow': { status: 'planned', owner: 'perf', description: 'Render time exceeded threshold.' },
  'perf:bundle:large': { status: 'planned', owner: 'perf', description: 'Bundle size exceeded threshold.' },
  'perf:choice:slow': { status: 'planned', owner: 'perf', description: 'Choice handling exceeded threshold.' },
  'perf:api:slow': { status: 'planned', owner: 'perf', description: 'API response exceeded threshold.' },

  // ─────────────────────────────────────────────────────────────────────────
  // SYSTEM (active surface)
  // ─────────────────────────────────────────────────────────────────────────
  'system:error': { status: 'active', owner: 'infra', description: 'System-level error event.' },
  'system:warning': { status: 'active', owner: 'infra', description: 'System-level warning event.' },
  'system:info': { status: 'active', owner: 'infra', description: 'System-level info event.' },

  // SYSTEM (planned surface)
  'system:cleanup': { status: 'planned', owner: 'infra', description: 'Cleanup task executed.' },

  // ─────────────────────────────────────────────────────────────────────────
  // ANALYTICS (planned surface)
  // ─────────────────────────────────────────────────────────────────────────
  'analytics:tracked': { status: 'planned', owner: 'analytics', description: 'Meta analytics event routed through the bus.' },
}

