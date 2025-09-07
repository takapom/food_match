# 食べ物とマッチングしよう！！ プロジェクト構造

## プロジェクト概要
- **アプリ名**: 食べ物とマッチングしよう！！
- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**: CSS Modules
- **外部API**: ホットペッパーグルメAPI

## ディレクトリ構造

### `/src/app` - ページとルーティング
- **`page.tsx`**: ホームページ - スワイプデモ、特徴紹介
- **`layout.tsx`**: ルートレイアウト
- **`globals.css`**: グローバルスタイル
- **`/discover`**: レストラン一覧表示ページ
- **`/api/food`**: 食べ物API（モックデータ）
- **`/api/health`**: ヘルスチェックAPI

### `/src/components` - UIコンポーネント
#### UI基本コンポーネント (`/ui`)
- **`Button`**: ボタンコンポーネント
- **`Input`**: 入力フィールド
- **`LoadingSpinner`**: ローディング表示
- **`UserIcon`**: ユーザーアイコン
- **`Modal`**: モーダルウィンドウ

#### レストラン関連 (`/restaurant`)
- **`RestaurantCard`**: レストラン情報カード
- **`RestaurantInfo`**: レストラン詳細情報

#### レイアウト (`/layout`)
- **`Header`**: ヘッダー
- **`Navigation`**: ナビゲーション

#### その他
- **`Card.tsx`**: 汎用カードコンポーネント
- **`Footer.tsx`**: フッター
- **`Header.tsx`**: ヘッダー

### `/src/lib` - ライブラリ・ユーティリティ
- **`/api/restaurants.ts`**: ホットペッパーAPI連携、レストランデータ取得
- **`constants.ts`**: 定数定義
- **`validators.ts`**: バリデーション
- **`db.ts`**: データベース関連

### `/src/hooks` - カスタムフック
- **`useMediaQuery.ts`**: メディアクエリ
- **`useLocalStorage.ts`**: ローカルストレージ
- **`useDebounce.ts`**: デバウンス処理

### `/src/services` - サービス層
- **`api.ts`**: API通信処理

### `/src/utils` - ユーティリティ関数
- **`format.ts`**: フォーマット処理
- **`index.ts`**: ユーティリティエクスポート

### `/src/styles` - スタイル関連
- **`theme.css`**: テーマ設定

## 主要機能

1. **ホームページ**: 
   - スワイプUIデモ
   - 「今すぐ始める」でDiscoverページへ遷移

2. **Discoverページ**:
   - ホットペッパーAPIから取得したレストラン一覧表示
   - RestaurantCardコンポーネントでカード形式表示

3. **API連携**:
   - `fetchRandomRestaurants()`: ランダムにレストランを取得
   - 東京エリアのジャンル別レストラン検索

## 認証機能の削除状況
- 認証関連ディレクトリ・ファイル: 削除済み
- Supabase連携: 削除済み
- ログイン/サインアップページ: 削除済み
- package.jsonからSupabase依存: 削除済み