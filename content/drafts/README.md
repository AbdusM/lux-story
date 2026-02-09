# Draft Content Quarantine

This directory contains tooling to **exclude known-quarantined nodes** from the
runtime dialogue graphs by default.

Why:
- The repo historically accumulated large blocks of narrative/simulation nodes
  that were not structurally connected to any entry point.
- For AAA-style "content as code" gates, we want active graphs to have **zero**
  structurally unreachable / unreferenced nodes.

How it works:
- `quarantined-node-ids.ts` is a snapshot of node IDs that are treated as **draft**
  (not shipped) content. It is generated from the current unreachable report.
- `draft-filter.ts` filters those nodes out when building the `nodes: Map` for
  each graph.

Opt-in:
- Set `NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT=true` to include quarantined nodes at
  runtime (dev-only use).

Regenerate the quarantine list:
1. `NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT=true npm run verify:unreachable-dialogue-nodes`
2. `npm run write:content-quarantine`
