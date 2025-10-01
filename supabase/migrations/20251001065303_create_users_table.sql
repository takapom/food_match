-- Create users table linked to Supabase Auth
create table if not exists public.users (
  id uuid primary key
    references auth.users(id) on delete cascade,     -- Supabase Auth のユーザーID
  display_name text not null,                        -- 表示名
  email text unique not null,                        -- メールアドレス
  favorite_store_id bigint,                          -- お気に入り店舗ID（単一）
  membership_type text not null
    check (membership_type in ('free', 'premium')),  -- 会員種別
  created_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);
create index if not exists users_favorite_store_idx on public.users (favorite_store_id);

-- 重要: RLS（行レベルセキュリティ）を有効化して、本人の行だけ読める/更新できるようにする
alter table public.users enable row level security;

-- 本人のみ参照可
create policy "Users can read own row"
on public.users
for select
using (auth.uid() = id);

-- 本人のみ更新可
create policy "Users can update own row"
on public.users
for update
using (auth.uid() = id);

-- 自分の行だけ作成可（id は auth.uid() に一致する必要あり）
create policy "Users can insert own row"
on public.users
for insert
with check (auth.uid() = id);
