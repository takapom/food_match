# Food Matching（フロントエンド）— プロジェクト概要

このリポジトリは、スワイプ操作で「自分に合う飲食店」とマッチングできる Web アプリのフロントエンド実装です。Next.js 15（App Router）と React 19 を用いた TypeScript 構成で、UI は CSS Modules でスタイリングされています。

## これは何のプロジェクト？
- 飲食店をカードで1件ずつ表示し、左右（パス/いいね）・上（スーパーいいね）のスワイプやボタン操作で直感的に探索できるアプリ。
- Discover 画面から飲食店データを取得し、簡易アニメーション・ドラッグ操作・進捗バーを備えたスワイプ UI を提供。
- Next.js の API Routes を使い、モックデータや外部 API からの取得をフロント側で一部完結。

## 主な技術
- Next.js 15.5（App Router） / React 19 / TypeScript
- CSS Modules（コンポーネント単位のスタイル分離）
- フロント内 API Routes（`/src/app/api/*`）

## 主要機能（フロント）
- ホーム（`/`）: アプリ紹介とカード UI のデモ。
- Discover（`/discover`）: 1件表示のスワイプ UI。ボタン/ドラッグ/タッチ操作に対応。
- API Routes:
  - `/api/restaurants` 外部 API（ホットペッパーグルメ API）の代理取得。
  - `/api/food` モックデータ（検索/簡易 POST バリデーション付き）。
  - `/api/health` ヘルスチェック。
- UI コンポーネント: `components/ui/*`（`Button`, `UserIcon`, `LoadingSpinner` など）、プロフィール表示用の部品群（`components/profile/*`）。

## ディレクトリの見どころ
- `src/app` … 画面と API Routes。`/discover` のスワイプ画面が中心。
- `src/components` … UI/プロフィール/レストラン関連の再利用コンポーネント。
- `src/lib` … 定数や外部 API 連携の型/関数（例: `lib/api/restaurants.ts`）。
- `src/services/api.ts` … ベースとなるフェッチラッパー。
- `public` … 画像などの静的アセット。

※ リポジトリ直下に `backend/` ディレクトリがありますが、本 README はフロントエンドの概要に限定しています（バックエンドの詳細調査は対象外）。

## 動かし方（フロント）
1. Node.js 20 以上を推奨
2. 依存インストール: `npm install`
3. 環境変数（任意だが推奨）:
   - `HOTPEPPER_API_KEY` … `/api/restaurants` が外部 API にアクセスするために使用（未設定だと Discover 画面のデータ取得でエラーになります）。
4. 開発起動: `npm run dev`（http://localhost:3000）

## 補足
- リポジトリ名は `food_mathching`（表記にタイプミスがあります）が、アプリ名は “Food Matching” です。
- 今後の拡張余地として、詳細ページ、いいね/ブックマークの永続化、検索/フィルタ UI、認証などが想定されています。

## フロントエンドのディレクトリ調査（詳細）

以下は `src/` 配下の主要ディレクトリと役割です。実装済みかプレースホルダーかも併記します。

- `src/app`
  - `page.tsx` … ホーム。カード UI デモと導線。
  - `discover/page.tsx` … スワイプ UI の本体。`/api/restaurants` へフェッチし、ボタン/ドラッグ/タッチ操作とアニメーションを実装。
  - `api/restaurants/route.ts` … 外部 API（ホットペッパーグルメ）へのプロキシ。`HOTPEPPER_API_KEY` 必須。
  - `api/food/route.ts` … モックデータ API（GET/POST バリデーションあり）。
  - `api/health/route.ts` … ヘルスチェック。
  - `user_page/page.tsx` … プロフィール風 UI のデモ。
  - `restaurant/[id]/` … 詳細ページの器（現状プレースホルダー）。
  - `globals.css` / `layout.tsx` … 全体スタイルと App ルートレイアウト。

- `src/components`
  - `ui/` … 汎用 UI。
    - `Button/`, `Input/`, `LoadingSpinner/`, `UserIcon/`（実装済み）／`Modal/`（プレースホルダー）。
  - `profile/` … プロフィール画面用部品。
    - `HeaderNavigation/`, `ProfileSection/`, `ProfileStats/`, `NavigationTab/`, `BottomNavigation/`, `CreateVideoCard/`（実装済み）。
  - `restaurant/`
    - `RestaurantCard/` … 店舗カード（実装済み、`RestaurantCard.tsx`）。
    - `RestaurantInfo/` … 店舗詳細の器（簡易プレースホルダー）。
  - `icons/` … SVG アイコン（複数実装済み）。
  - `layout/`, `swipe/`, `filter/` … ディレクトリは用意済み（現状プレースホルダー）。

- `src/lib`
  - `api/restaurants.ts` … ホットペッパー API 取得ロジックと型（`fetchRestaurants`, `fetchRandomRestaurants` など）。
  - `constants.ts` … アプリ名/説明、API ルート、カテゴリ定数。
  - `validators.ts` … 簡易バリデーション群。
  - `db.ts` … DB 連携の将来拡張用スタブ。
  - `hooks/`, `stores/`, `types/` … 将来拡張スペース（現状空）。

- `src/services`
  - `api.ts` … フェッチラッパー（タイムアウト/JSON 返却）。`config.api.baseUrl` を使用。

- `src/config`
  - `index.ts` … アプリ名/URL/環境、API ベース URL、タイムアウト、認証クッキー名などの設定。`isDevelopment`/`isProduction` を提供。

- `src/hooks`
  - `useMediaQuery.ts` / `useLocalStorage.ts` / `useDebounce.ts` … クライアント用の便利フック群（実装済み）。

- `src/utils`
  - `format.ts` … 通貨/数値/割合/ファイルサイズ/文字列整形などのユーティリティ。
  - `index.ts` … クラス結合 `cn`、日付整形、`sleep`、`randomId`。

- `src/styles`
  - `theme.css` … テーマ変数。`globals.css` と合わせて配色・フォントを管理。

- `src/types`
  - `index.ts` … `User`/`FoodItem`/`Match` などアプリ横断の型定義。

### 実装状況の要点
- 完了: ホーム/Discover 画面、レストランカード、プロフィール部品群、基本 UI、API ルート（restaurants/food/health）。
- 進行/未着手: 詳細ページ（`restaurant/[id]`）、`components/{layout,swipe,filter}` の実装、データ永続化/認証など。

## 主要処理の概要（フロント）

### Discover 画面（`src/app/discover/page.tsx`）
- 状態管理: `restaurants`（取得データ配列）、`currentIndex`、`loading`、`error`、ドラッグ用の `isDragging`/`startX`/`translateX`、アニメーション多重実行防止の `isAnimating`、`containerRef`。
- データ取得: マウント時に `loadRestaurants()` を実行し、`/api/restaurants?count=10` を `fetch`。`response.ok` と `data.error` をチェックし、配列であることを検証後に `setRestaurants`。`try/finally` で `loading` を制御し、失敗時は `error` をセット。
- スワイプ/アクション: `handleAction('pass'|'like'|'superlike')` が CSS クラス（`swipeLeft`/`swipeRight`/`swipeUp`）を `.cardSlide` 要素へ付与。`setTimeout(300ms)` 後にクラス除去・`translateX` リセット・`currentIndex` 前進（末尾なら再取得→先頭へ）。
- ドラッグ判定: `handleMouseDown/Move/Up` と `handleTouchStart/Move/End` で `translateX` を更新。|`translateX| > 80` で pass/like を確定、±50px で前後ナビゲーション、その他はリセット。
- UI 表現: 次カードのプレビュー、`PASS/LIKE` オーバーレイ、進捗バー（`((currentIndex+1)/restaurants.length)*100%`）、アクションボタン（✕/⭐/♥）。`loading`/`error`/空配列でそれぞれ専用表示とリトライ。

### ホーム画面（`src/app/page.tsx`）
- モックデータ `sampleRestaurants` を 3 枚スタック表示。`currentCard` を更新する `handleLike/Dislike/Superlike` によりカードを循環。スタイル内の `z-index`・`transform`・`top`・`opacity` を計算して“重なり”感を演出。CTA で `/discover` へ誘導。

### API Routes（フロント内, `src/app/api/*`）
- `restaurants/route.ts`
  - クエリ: `area`/`genre`/`count`/`start` を受け取り、`HOTPEPPER_API_KEY` 必須。エリア未指定時は東京のプリセットからランダム選択、`genre` はコード表でマッピング。
  - 外部呼び出し: Recruit ホットペッパー API へ `GET`、`ok` 判定→JSON 変換→`results.shop` を返却。失敗時は 500 とメッセージを返す。
- `food/route.ts`
  - GET: モック配列を `category`/`search` でフィルタし、`{ items, total }` を返す。
  - POST: `name/description/category` を必須バリデーションし、`id`（timestamp 文字列）と `createdAt/updatedAt` を付与して 201 を返す。
- `health/route.ts`: 稼働確認用に `status/timestamp/service/version` を返す。

### 外部 API ラッパー（`src/lib/api/restaurants.ts`）
- `fetchRestaurants(params)`: ランダム/指定の `area`・`genre` を組み立ててホットペッパー API を呼び出し、`shops` と件数情報を返す。Next の `revalidate: 3600` を設定。
- `fetchRandomRestaurants()`: 多めに取得→シャッフル→上位 3 件を返却（詳細を `console.log` 出力）。
- `searchRestaurants(opts)`: 条件を反映して取得し、総件数/返却件数をログ化して返す。

### コンポーネント処理
- `RestaurantCard`（`components/restaurant/RestaurantCard/RestaurantCard.tsx`）
  - `Shop` 型を受け取り、画像/ジャンル/予算/アクセスなどを表示。WiFi・個室・カード可・禁煙・駐車場・ランチ等を条件表示（値が `'あり'` などの場合にバッジ表示）。公式ページへ外部リンク。
- `profile/*`: 表示ロジック中心（ナビゲーション、統計、セクション等）。
- `ui/*`: 小粒な汎用 UI。`Button` は HTML 属性透過、`Input` は既存属性を拡張、`LoadingSpinner` はサイズ切替、`UserIcon` はサイズ/クラス付与。

### フック（`src/hooks`）
- `useLocalStorage`:
  - 初期化時にキーを `localStorage` から JSON で読み込み（なければ初期値）。更新時は `JSON.stringify` で保存。
- `useMediaQuery`: `matchMedia` の変更イベントで一致状態を追従。
- `useDebounce`: 指定 delay で値をディレイ更新（`setTimeout`/cleanup）。

### サービス/設定/ユーティリティ
- `services/api.ts`: `AbortController` によるタイムアウト付き `request<T>()` を提供（`GET/POST/PUT/DELETE`）。`!response.ok` で例外、成功時は JSON 返却。
- `config/index.ts`: アプリ名/URL/環境、API ベース URL（既定は `/api`）、タイムアウト、認証 Cookie 名。`isDevelopment`/`isProduction` をエクスポート。
- `utils/format.ts`: 通貨/数値/割合/ファイルサイズ/文字列整形（`truncate`/`slug` 等）。
- `utils/index.ts`: クラス結合 `cn`、日付整形 `formatDate`、`sleep`、`randomId`。

### スタイル（例: `src/app/discover/page.module.css`）
- アニメーション: `.swipeLeft/.swipeRight/.swipeUp` と `@keyframes swipe*Out` を用意し、Discover の `handleAction` からクラスを付与して発火。
- インジケーター: `.passIndicator/.likeIndicator` を `translateX` しきい値に応じて表示。進捗は `.progressFill` の width を動的制御。


プロトタイプで行うこと
-ログインログアウト機能
-飲食店のありなしの選択画面
-個人ページ
-飲食店の店舗詳細の表示
-UIの完成度