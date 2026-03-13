# Labor Signal Datasets

These JSON files are the repo-owned source of truth for the labor-market signal layer used on `/student/insights`.

## Files

- `observed-exposure-v1.json`: curated nowcasting map for `Observed Exposure`
- `entry-friction-v1.json`: curated nowcasting proxy map for `Entry Friction`

## Record Shape

Every record must include:

- `careerIds`: canonical Lux lane IDs covered by the record
- `aliases`: role names used for non-canonical alias matching
- `descriptor.level`: `low`, `medium`, `high`, or `unknown`
- `descriptor.confidence`: `low`, `medium`, or `high`
- `descriptor.reasons`: user-facing reasons shown in the insights UI
- `metadata.summary`
- `metadata.source`
- `metadata.updatedAtIso`
- `metadata.coverage`
- `metadata.confidence`
- `metadata.version`
- `metadata.methodology`

Runtime validation is enforced by [market-signal-loader.ts](/Users/abdusmuwwakkil/Development/30_lux-story/lib/labor-market/market-signal-loader.ts). Canonical-lane coverage and freshness are enforced by [labor-market-dataset-contract.test.ts](/Users/abdusmuwwakkil/Development/30_lux-story/tests/lib/labor-market-dataset-contract.test.ts).

## Matching Rules

- `canonical`: the user-selected Lux lane matched a `careerIds` entry
- `alias`: the displayed role name matched an `aliases` entry
- `fallback`: no curated record matched, so the app used deterministic fallback logic from [signals.ts](/Users/abdusmuwwakkil/Development/30_lux-story/lib/labor-market/signals.ts)

Alias-only compatibility rows are allowed for adjacent non-canonical role names. For those rows, keep `careerIds` empty and make the alias intent explicit in `metadata.coverage` and `metadata.methodology`.

## Freshness Policy

- `observedExposure`: must be updated within `45` days
- `entryFriction`: must be updated within `30` days

Stale timestamps fail the dataset contract test. Use the helper report before the policy boundary:

```bash
npm run report:market-signal-freshness
npm run report:market-signal-freshness -- --format=markdown
npm run report:market-signal-freshness -- --threshold-days=10
```

## Edit Checklist

1. Preserve complete canonical Birmingham lane coverage for both datasets.
2. Keep `updatedAtIso` truthful to the dataset edit or refresh date.
3. Keep `summary`, `coverage`, and `methodology` specific enough that a counselor can explain the label.
4. Use alias-only rows sparingly and only for adjacent role names that actually appear in the product.
5. After editing, run:

```bash
npm run test:run -- tests/lib/labor-market-signals.test.ts tests/lib/labor-market-dataset-contract.test.ts
npm run report:market-signal-freshness
```
