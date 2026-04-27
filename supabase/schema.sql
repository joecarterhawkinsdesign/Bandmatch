create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null default '',
  bio text not null default '',
  instruments text[] not null default '{}',
  genres text[] not null default '{}',
  city text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid not null references public.profiles(id) on delete cascade,
  swiped_id uuid not null references public.profiles(id) on delete cascade,
  direction text not null check (direction in ('left', 'right')),
  created_at timestamptz not null default now(),
  unique(swiper_id, swiped_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_a, user_b)
);

alter table public.profiles enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;

create policy "profiles are readable by authenticated users"
on public.profiles for select to authenticated using (true);

create policy "users manage own profile"
on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "users insert own swipes"
on public.swipes for insert to authenticated with check (auth.uid() = swiper_id);

create policy "users read own swipes"
on public.swipes for select to authenticated using (auth.uid() = swiper_id or auth.uid() = swiped_id);

create policy "users read own matches"
on public.matches for select to authenticated using (auth.uid() = user_a or auth.uid() = user_b);

create policy "users can create match rows they are part of"
on public.matches for insert to authenticated with check (auth.uid() = user_a or auth.uid() = user_b);
