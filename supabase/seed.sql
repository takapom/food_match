-- 1. Auth ユーザー作成（Supabase Auth 側）
-- 必須カラム: id, email, encrypted_password など
-- 注意: 簡単なモック用なのでパスワードはハッシュ済み文字列を使う必要があります
-- bcrypt で "password" をハッシュした例を使います
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'taro@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8eG7z6R1uElJ1xH6h16wZMfj2Z/gFe', now(), now()),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'hanako@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8eG7z6R1uElJ1xH6h16wZMfj2Z/gFe', now(), now());

-- 2. public.users に対応するデータを挿入
insert into public.users (id, display_name, email, favorite_store_id, membership_type)
values
  ('11111111-1111-1111-1111-111111111111', 'Taro Yamada', 'taro@example.com', 101, 'free'),
  ('22222222-2222-2222-2222-222222222222', 'Hanako Suzuki', 'hanako@example.com', 202, 'premium');
