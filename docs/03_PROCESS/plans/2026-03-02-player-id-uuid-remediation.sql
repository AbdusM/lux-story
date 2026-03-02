-- Purpose:
--   Remediate legacy non-UUID player identifiers in production while preserving data.
-- Scope:
--   Migrates non-UUID values in public.player_profiles.user_id to UUIDs and rewires all
--   single-column FK references to public.player_profiles(user_id).
-- Safety:
--   - Transactional: all-or-nothing.
--   - Idempotent: safe to re-run.
--   - Writes backup artifacts to public.user_id_uuid_migration_* tables.
--
-- Run in Supabase SQL Editor on project: tavalvqcebosfxamuvlx (actualizeme)

-- 0) Preflight snapshot (read-only)
select
  case
    when user_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then 'uuid'
    when user_id ~* '^player[_-]' then 'player_prefixed'
    else 'other'
  end as kind,
  count(*) as count
from public.player_profiles
group by kind
order by count desc;

create table if not exists public.user_id_uuid_migration_map (
  old_user_id text primary key,
  new_user_id text not null unique,
  created_at timestamptz not null default now(),
  migrated_at timestamptz
);

create table if not exists public.user_id_uuid_migration_profile_backup (
  old_user_id text primary key,
  profile_row jsonb not null,
  captured_at timestamptz not null default now()
);

begin;

set local lock_timeout = '15s';
set local statement_timeout = '15min';

-- 1) Map every currently non-UUID user_id to a deterministic migration target
insert into public.user_id_uuid_migration_map (old_user_id, new_user_id)
select
  p.user_id as old_user_id,
  uuid_generate_v4()::text as new_user_id
from public.player_profiles p
where p.user_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  and not exists (
    select 1
    from public.user_id_uuid_migration_map m
    where m.old_user_id = p.user_id
  );

-- 2) Back up profile rows before rewiring
insert into public.user_id_uuid_migration_profile_backup (old_user_id, profile_row)
select
  p.user_id,
  to_jsonb(p)
from public.player_profiles p
join public.user_id_uuid_migration_map m
  on m.old_user_id = p.user_id
on conflict (old_user_id) do nothing;

-- 3) Clone legacy profiles under their new UUID user_id
do $$
declare
  insert_columns text;
  select_columns text;
  inserted_count bigint;
begin
  select string_agg(format('%I', c.column_name), ', ' order by c.ordinal_position)
  into insert_columns
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'player_profiles'
    and c.column_name <> 'id';

  select string_agg(
    case
      when c.column_name = 'user_id' then 'm.new_user_id as user_id'
      else format('p.%I', c.column_name)
    end,
    ', '
    order by c.ordinal_position
  )
  into select_columns
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'player_profiles'
    and c.column_name <> 'id';

  if insert_columns is null or select_columns is null then
    raise exception 'Unable to resolve player_profiles column set.';
  end if;

  execute format(
    $sql$
      insert into public.player_profiles (%s)
      select %s
      from public.player_profiles p
      join public.user_id_uuid_migration_map m
        on m.old_user_id = p.user_id
      left join public.player_profiles existing
        on existing.user_id = m.new_user_id
      where existing.user_id is null
    $sql$,
    insert_columns,
    select_columns
  );

  get diagnostics inserted_count = row_count;
  raise notice 'Inserted cloned profile rows: %', inserted_count;
end $$;

-- 4) Rewire every single-column FK that points to player_profiles(user_id)
do $$
declare
  target_attnum int2;
  fk record;
  updated_count bigint;
begin
  select a.attnum
  into target_attnum
  from pg_attribute a
  where a.attrelid = 'public.player_profiles'::regclass
    and a.attname = 'user_id'
    and not a.attisdropped;

  if target_attnum is null then
    raise exception 'player_profiles.user_id attribute not found.';
  end if;

  for fk in
    select
      n.nspname as schema_name,
      c.relname as table_name,
      a.attname as column_name
    from pg_constraint con
    join pg_class c
      on c.oid = con.conrelid
    join pg_namespace n
      on n.oid = c.relnamespace
    join pg_attribute a
      on a.attrelid = con.conrelid
     and a.attnum = con.conkey[1]
    where con.contype = 'f'
      and con.confrelid = 'public.player_profiles'::regclass
      and array_length(con.conkey, 1) = 1
      and array_length(con.confkey, 1) = 1
      and con.confkey[1] = target_attnum
      and n.nspname = 'public'
    order by n.nspname, c.relname, a.attname
  loop
    execute format(
      'update %I.%I t set %I = m.new_user_id from public.user_id_uuid_migration_map m where t.%I = m.old_user_id',
      fk.schema_name,
      fk.table_name,
      fk.column_name,
      fk.column_name
    );
    get diagnostics updated_count = row_count;
    raise notice 'Updated %.% (%): % rows', fk.schema_name, fk.table_name, fk.column_name, updated_count;
  end loop;
end $$;

-- 5) Remove legacy player_profiles rows only after references are rewired
do $$
declare
  deleted_count bigint;
begin
  delete from public.player_profiles p
  using public.user_id_uuid_migration_map m
  where p.user_id = m.old_user_id;

  get diagnostics deleted_count = row_count;
  raise notice 'Deleted legacy profile rows: %', deleted_count;
end $$;

-- 6) Mark rows as migrated only if old profile is gone and new profile exists
update public.user_id_uuid_migration_map m
set migrated_at = now()
where m.migrated_at is null
  and not exists (
    select 1
    from public.player_profiles p_old
    where p_old.user_id = m.old_user_id
  )
  and exists (
    select 1
    from public.player_profiles p_new
    where p_new.user_id = m.new_user_id
  );

commit;

-- 7) Postflight checks (must all pass before release)
select
  case
    when user_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then 'uuid'
    when user_id ~* '^player[_-]' then 'player_prefixed'
    else 'other'
  end as kind,
  count(*) as count
from public.player_profiles
group by kind
order by count desc;

select
  count(*) as unmigrated_map_rows
from public.user_id_uuid_migration_map
where migrated_at is null;

