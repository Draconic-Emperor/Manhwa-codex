-- OPTIONAL schema upgrades for Manhwa Codex.
-- The app runs fine WITHOUT any of this. These are only needed if you want
-- to turn on the feature flags in src/constants/index.js and move certain
-- features (character stats, favorites) from client-only to shared/synced.

-- 1. Character stat bars (strength/speed/intelligence/endurance/mana/influence)
--    Enables FEATURES.CHARACTER_STATS in src/constants/index.js.
alter table characters
  add column if not exists stats jsonb default '{}'::jsonb;

-- 2. Aliases / abilities (the original UI already read character.aliases and
--    character.abilities as arrays - this assumes those columns already
--    exist. If they don't yet, this adds them safely.)
alter table characters
  add column if not exists aliases text[] default '{}';
alter table characters
  add column if not exists abilities text[] default '{}';

-- 3. Shared favorites/bookmarks (replaces the localStorage-only
--    implementation in src/hooks/useFavorites.js with one synced across
--    devices and visible to other signed-in users, i.e. real "Community
--    Favorites").
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('manhwa', 'character')),
  target_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, target_type, target_id)
);
alter table favorites enable row level security;
create policy "Users manage their own favorites" on favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. Theory voting on insights.
create table if not exists insight_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  insight_id uuid references insights(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique (user_id, insight_id)
);
alter table insight_votes enable row level security;
create policy "Users manage their own votes" on insight_votes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
