# Manual SQL

This directory holds SQL that is intentionally not part of the numbered
`supabase/migrations` chain.

Use it for one-off dashboard/SQL-editor setup that should not participate in
`supabase migration list`, `supabase migration fetch`, or `supabase db push`.

Current contents:
- `auth_setup.sql`: manual auth/bootstrap setup for the `profiles` table and
  related role helpers.
