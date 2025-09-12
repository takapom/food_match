JWT認証の実装の流れを初心者向けに解説します。

  JWT認証の全体像

  📁 ディレクトリ構造と役割

  backend/
  ├── domain/           # ビジネスロジックの定義
  │   ├── model/       # データモデル（User, Credential等）
  │   ├── repository/  # データ操作のインターフェース
  │   └── service/     # ビジネスサービス（JWT, パスワード処理）
  ├── infrastructure/   # 技術的な実装
  │   └── jwt/         # JWT認証の具体的な実装
  ├── handler/         # HTTPリクエスト処理
  │   └── middleware/  # 認証チェック
  ├── usecase/         # ユースケース（ビジネスフロー）
  └── main.go          # アプリケーションの起動

  🔐 JWT認証の流れ

  1️⃣ ユーザー登録の流れ

  クライアント → [RegisterAPI] → AuthUsecase → UserRepository
                                       ↓
                                PasswordHasher（パスワード暗号化）
                                       ↓
                              CredentialRepository（保存）

  2️⃣ ログインの流れ

  1. クライアントがメールとパスワードを送信
     ↓
  2. auth_handler.go が受け取る
     ↓
  3. AuthUsecase.Login()を呼び出し
     ↓
  4. データベースからユーザー情報を取得
     ↓
  5. パスワードを検証
     ↓
  6. JWTトークンを生成して返す

  3️⃣ 認証が必要なAPIアクセス

  1. クライアントがトークンをHeaderに含めてリクエスト
     Authorization: Bearer <トークン>
     ↓
  2. AuthMiddleware が自動でチェック
     ↓
  3. トークンが有効なら処理を継続
     無効なら401エラーを返す

  📝 各ファイルの役割

  domain/service/jwt_issuer.go

  // JWTの仕様を定義（設計図）
  type JWTIssuer interface {
      Issue(...)     // トークンを作る
      ParseAndVerify(...) // トークンを検証
  }

  infrastructure/jwt/jwt_issuer.go

  // 実際のJWT処理の実装
  // ここで本当にトークンを作ったり検証したりする

  handler/middleware/auth.go

  // すべてのリクエストをチェックする門番
  // トークンがないor無効 → 通さない
  // トークンが有効 → 通す

  handler/auth_handler.go

  // ログイン処理
  // ID/パスワードを受け取って、トークンを返す

  usecase/auth_usecase.go

  // ビジネスロジック
  // ・ユーザー登録
  // ・ログイン認証
  // ・パスワードチェック

  🚀 実際の使用例

  ステップ1: サーバー起動

  cd backend
  go run main.go

  ステップ2: ログイン

  curl -X POST http://localhost:8080/api/login \
    -H "Content-Type: application/json" \
    -d '{"user_id":"test", "password":"password"}'

  # 返ってくるもの：
  {
    "token": "eyJhbGc...", # これがJWTトークン
    "expires_at": "..."     # 有効期限
  }

  ステップ3: 保護されたAPIにアクセス

  # トークンを使ってアクセス
  curl http://localhost:8080/api/protected \
    -H "Authorization: Bearer eyJhbGc..."

  💡 ポイント

  1. JWTトークンとは？
    - ユーザーの身分証明書のようなもの
    - サーバーが発行し、有効期限がある
    - 改ざんできない（署名付き）
  2. なぜミドルウェアを使うの？
    - すべてのAPIで同じ認証チェックを自動化
    - コードの重複を避ける
  3. セキュリティ対策
    - パスワードは暗号化して保存
    - トークンには秘密鍵で署名
    - 有効期限を設定（24時間）

  これで基本的なJWT認証が動作します！

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ >                                                                                                                                                    │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
  ⏵⏵ bypass permissions on (shift+tab to cycle)                                                                                                      ◯
