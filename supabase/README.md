# Supabase ローカル環境（Docker Compose）

`supabase/docker` ディレクトリに Supabase スタックを自前で起動するための Compose 定義と関連リソースを追加しました。`npx supabase start` を使わずに Docker Compose で同等のコンテナ群を立ち上げられます。

## 前提条件
- Docker Desktop（あるいは互換の Docker Engine）と Compose V2 がインストール済みであること
- 既に `npx supabase start` で立ち上げたプロセスがある場合は、ポート競合を避けるために先に停止してください
  ```bash
  npx supabase stop
  ```

## 起動手順
1. `supabase/docker/.env` にホスト側ポートや JWT シークレットなどを定義しています。必要に応じて値を変更します。
   - 既定では `API (Kong)` → `http://127.0.0.1:54321`、`Studio` → `http://127.0.0.1:54323`、`Mailpit` → `http://127.0.0.1:54324`、`Postgres` → `127.0.0.1:54322` に公開されます。
   - `ANON_KEY` / `SERVICE_ROLE_KEY` / `JWT_SECRET` は Supabase CLI が生成した値を入れてあります。Next.js 側で同じキーを使っている場合はそのまま利用できます。
    - Postgres のデータは Docker 名称ボリューム（`db-data`）に保持されるので、リポジトリ配下にファイルは作成されません。
2. プロジェクトルートで以下を実行してコンテナを起動します。
   ```bash
   docker compose --env-file supabase/docker/.env \
     -f supabase/docker/docker-compose.yml up -d
   ```
3. スタックの状態を確認します。
   ```bash
   docker compose --env-file supabase/docker/.env \
     -f supabase/docker/docker-compose.yml ps
   ```
4. ブラウザから各種エンドポイントへアクセスできます。
   - API Gateway (Kong): `http://127.0.0.1:54321`
   - Supabase Studio: `http://127.0.0.1:54323`
   - Mailpit (メール確認用): `http://127.0.0.1:54324`
   - Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## 停止・再起動
- 停止: `docker compose --env-file supabase/docker/.env -f supabase/docker/docker-compose.yml down`
- 再起動: `docker compose --env-file supabase/docker/.env -f supabase/docker/docker-compose.yml up -d`
- データを完全に消す場合は `down -v` を使います（`db-data` ボリュームなども削除されます）。

## マイグレーション/Seed
- `supabase/config.toml` の設定や `supabase/seed.sql` をそのまま利用できます。
- 例) マイグレーションを適用したい場合は CLI を使って `supabase db push --db-url postgresql://postgres:postgres@127.0.0.1:54322/postgres` のように実行します。

## Tips
- 既存の Supabase CLI スタックと同じポートを使用しているので、両方を同時に起動しないでください。
- Next.js 側で環境変数を参照する場合は、`ANON_KEY` / `SERVICE_ROLE_KEY` などを `.env.local` に設定しておくと便利です。
