-- Create User table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Supabase Auth のユーザーID
    display_name TEXT NOT NULL,       -- 表示名
    email TEXT UNIQUE NOT NULL,       -- メールアドレス
    favorite_store_id BIGINT,         -- お気に入り店舗ID
    membership_type TEXT NOT NULL CHECK (membership_type IN ('free', 'premium')), -- 会員種別
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 作成日時
);
