バックエンドの依存関係をリポジトリ内から洗い出して整理し
  ました。対象は backend/ ディレクトリです（フロントエンドは
  Next.js/TypeScript で別管理）。

  全体像

  - 言語/ランタイム: Go（go.mod は go 1.25.0 指定）
  - Webサーバ: 標準の net/http と http.ServeMux（外部ルータ未
  使用）
  - データベース: MySQL 8（Docker Compose で起動）
  - ORM/DB層: GORM（gorm.io/gorm）+ MySQL ドライバ（gorm.io/
  driver/mysql と github.com/go-sql-driver/mysql）
  - 認証/認可: JWT（github.com/golang-jwt/jwt/v5）+ 自前ミドル
  ウェア
  - 設定/環境変数: github.com/joho/godotenv
  - 補助: UUID 生成（github.com/google/uuid）
  - コンテナ: backend/Dockerfile と backend/docker-compose.yml

  Go モジュール依存（backend/go.mod）

  - gorm.io/gorm v1.30.5 … ORM 本体
  - gorm.io/driver/mysql v1.6.0 … GORM MySQL ドライバ
  - github.com/go-sql-driver/mysql v1.9.3 … ネイティブ MySQL ド
  ライバ
  - github.com/golang-jwt/jwt/v5 v5.3.0 … JWT 発行/検証
  - github.com/joho/godotenv v1.5.1 … .env ロード
  - github.com/google/uuid v1.6.0 … UUID 生成
  - その他（現状コードからは未使用/または間接参照扱い）:
      - ariga.io/atlas（DB スキーマツール）
      - golang.org/x/text などのユーティリティ群
      - gopkg.in/yaml.v3 など

  注: go.mod 上は “// indirect” が多いですが、実装上は直接使用
  しているもの（例: GORM, JWT, godotenv, uuid）もあります。バー
  ジョン固定は go.mod を参照してください。

  外部サービス/周辺依存

  - MySQL 8.0（backend/docker-compose.yml）
      - ポート: 3306:3306
      - ボリューム: mysql_data
      - 初期化スクリプト: backend/mysql/init/ を docker-
  entrypoint-initdb.d にマウント
  - バックエンドアプリ（app サービス）
      - ポート: 8080:8080
      - 依存: db（ヘルスチェックで起動順制御）
      - 環境変数: DB_HOST/PORT/USER/PASSWORD/NAME, JWT_SECRET,
  PORT
  - コンテナビルド（backend/Dockerfile）
      - ビルド: golang:1.25-alpine ベース → CGO 無効の静的バイ
  ナリ
      - 実行: alpine:3.19 非 root ユーザー
      - 注意: ビルドベースの Go 1.25 イメージが環境にない場合は
  1.22〜1.23 等へ見直し検討

  コード上の依存の使われ方（主要ファイル）

  - backend/main.go
      - godotenv で .env 読み込み（ローカルのみ）
      - GORM + MySQL で接続し AutoMigrate 実行（model.User,
  model.Credential）
      - JWT 秘密鍵（JWT_SECRET）で jwtIssuer を初期化
      - AuthUsecase を組み立て、/api/login, /api/register, /api/
  protected を ServeMux に登録
  - backend/infrastructure/jwt/jwt_issuer.go
      - github.com/golang-jwt/jwt/v5 による HS256 署名/検証
  - backend/infrastructure/user_repository.go,
  credential_repository.go
      - gorm.io/gorm を直接利用したリポジトリ実装
  - backend/domain/model/*.go
      - github.com/google/uuid による ID 採番（BeforeCreate）
  - backend/config/config.go
      - 環境変数の読み出し（godotenv）

  セキュリティ/実装上の重要ポイント

  - パスワードハッシュ
      - backend/infrastructure/bcrypt_hasher.go は名前に反して実
  装は crypto/sha256 の簡易ハッシュです（ソルトなし）。本番用途
  には不適。
      - 推奨: golang.org/x/crypto/bcrypt へ置換（コストパラメー
  タ化、CompareHashAndPassword 使用）。
  - JWT
      - HS256 対称鍵方式で検証。JWT_SECRET は必ず強度の高い値を
  環境変数で投入。
      - aud, iss, exp 等は設定済み。トークンの失効/ローテーショ
  ン方針は別途検討。
  - マイグレーション
      - AutoMigrate を起動時に実行しており、backend/migrations/
  *.sql は現状空ファイル。将来的に Atlas/DDL を使うならどちらか
  に統一。

  エンドポイントと依存の関係

  - POST /api/register … GORM（永続化）+ Hasher（要 bcrypt 化）
  - POST /api/login … GORM（認証情報参照）+ Hasher + JWT（発行）
  - GET /api/protected … ミドルウェアで JWT 検証

  依存関係の図（テキスト）

  - HTTP 層: net/http → Handler/Middleware
  - 認証: Handler → Usecase → PasswordHasher, JWTIssuer
  - 永続化: Usecase → Repository（GORM）→ MySQL（docker-
  compose）
  - 設定: godotenv + 環境変数
  - 補助: uuid（ID 採番）

  把握しづらい/未完成ポイント

  - backend/infrastructure/external/hotpepper_client.go は空
  （README に将来案あり）
  - backend/migrations/*.sql は空
  - go.mod の “indirect” 表示が多い（go mod tidy -v で整理可能）

  次アクション（希望あれば対応します）

  - bcrypt 実装に差し替え（golang.org/x/crypto/bcrypt を導入）
  - go バージョン/イメージの妥当性確認（必要なら 1.22 or 1.23 に
  揃える）
  - docker-compose の .env サンプル追加と DB 初期化 SQL の整備
  - HotPepper クライアントの実装と API キー連携
  （HOTPEPPER_API_KEY）

  他にも「依存関係グラフ（dot/mermaid）を出したい」「go mod why
  で間接依存の理由も出したい」などあれば教えてください。