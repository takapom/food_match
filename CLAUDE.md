# 食べ物とマッチングしよう！！ プロジェクト仕様書

## プロジェクト概要

### アプリ名
食べ物とマッチングしよう！！(仮)

### コンセプト
昨今、人と人とが出会うマッチングアプリが普及している中、マッチングのUI/UXを食べ物選びに応用したアプリケーション。普段の店選びでの優柔不断を解決し、SNS感覚で飲食店をブラウジングすることで日常に楽しみを創出する。

### 目的
- 食べ物・飲食店選びの楽しさを向上
- SNSライクな発見体験の提供
- 日常生活の豊かさ向上

## ターゲット

### ユーザー層
- **年齢**：中学生〜20代
- **デバイス**：iPhoneユーザー
- **特徴**：SNSに慣れ親しんだデジタルネイティブ世代

## 機能要件

### コア機能

#### ユーザー管理
- ユーザーアカウント登録・ログイン機能
- プロフィール管理

#### 店舗ブラウジング
- **表示方式**：全画面縦スクロール（TikTok/Instagram Reels風）
- **表示単位**：1店舗1画面
- **表示情報**：
  - 店名
  - 料理写真
  - 評価
  - 店舗詳細情報

#### 絞り込み機能
- **地域**：都道府県レベルでの絞り込み
- **料理ジャンル**：
  - 和食、洋食、中華、イタリアン、フレンチ
  - ラーメン、寿司、焼肉、居酒屋、カフェ
  - ファストフード、スイーツ

#### インタラクション機能
- **いいね機能**：ダブルタップで実行
- **ブックマーク機能**：専用ボタンで保存
- **操作方法**：縦スワイプで次の店舗表示

#### マイページ機能
- ブックマーク一覧表示
- いいねした店舗一覧表示

### 非実装機能
- レコメンデーション機能
- 予約機能
- リアルタイム営業情報
- 混雑状況表示

## 技術要件

### フロントエンド
- **フレームワーク**：Next.js（App Router）
- **言語**：TypeScript
- **スタイル**：CSS Modules（Tailwindは使用しない）
- **対象デバイス**：iPhone（レスポンシブ対応）

### バックエンド
- **BaaS**：Supabase
- **データベース**：PostgreSQL（Supabase内蔵）
- **認証**：Supabase Auth

### データソース
- **メイン**：ホットペッパーグルメAPI
- **補助**：必要に応じて追加検討

## デザイン要件

### デザインコンセプト
- リキッドガラスを用いたモダンデザイン
- iPhoneユーザー向けのネイティブライクなUI
- SNSアプリのような直感的な操作性

### UI原則
- ミニマルで分かりやすいインターフェース
- スムーズなアニメーション
- タップ・スワイプに最適化された操作感

## 開発・運用要件

### 開発期間
- **プロトタイプ**：2週間
- **目標**：基本機能が動作するMVP作成

### スケジュール
- **Week 1**：認証システム、DB設計、基本UI実装
- **Week 2**：スクロール機能、いいね/ブックマーク機能、データ連携

### 成功指標（プロトタイプ段階）
- 基本的なスクロール体験の実現
- いいね・ブックマーク機能の動作
- 地域・ジャンル絞り込みの動作

## データベース設計

### テーブル構成

#### users テーブル（ユーザー管理）
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    username VARCHAR(50),
    avatar_url TEXT,
    preferred_prefecture VARCHAR(10),
    preferred_genres JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### restaurants テーブル（店舗情報）
```sql
CREATE TABLE restaurants (
    id VARCHAR(20) PRIMARY KEY, -- ホットペッパーのお店ID
    name VARCHAR(255) NOT NULL,
    name_kana VARCHAR(255),
    address TEXT,
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    genre_code VARCHAR(10),
    genre_name VARCHAR(100),
    catch_phrase TEXT,
    budget_code VARCHAR(10),
    budget_average VARCHAR(100),
    photo_url_large TEXT,
    photo_url_medium TEXT,
    photo_url_small TEXT,
    hotpepper_url TEXT,
    large_area_code VARCHAR(10),
    large_area_name VARCHAR(50),
    wifi BOOLEAN DEFAULT FALSE,
    lunch_available BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### likes テーブル（いいね機能）
```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id VARCHAR(20) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id)
);
```

#### bookmarks テーブル（ブックマーク機能）
```sql
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id VARCHAR(20) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    memo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id)
);
```

#### user_swipes テーブル（スワイプ履歴）
```sql
CREATE TABLE user_swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id VARCHAR(20) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    action VARCHAR(10) NOT NULL CHECK (action IN ('like', 'pass', 'bookmark')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id)
);
```

## ディレクトリ構造

```
food-matching-app/
├── README.md
├── next.config.js
├── package.json
├── tsconfig.json
├── .env.local
├── .env.example
├── .gitignore
│
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json
│
├── src/
│   ├── app/                          # App Router
│   │   ├── globals.css
│   │   ├── layout.tsx                # ルートレイアウト
│   │   ├── layout.module.css
│   │   ├── page.tsx                  # ホーム画面
│   │   ├── page.module.css
│   │   │
│   │   ├── auth/                     # 認証関連
│   │   │   ├── auth.module.css
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── page.module.css
│   │   │   ├── register/
│   │   │   │   ├── page.tsx
│   │   │   │   └── page.module.css
│   │   │   └── layout.tsx
│   │   │
│   │   ├── discover/                 # メインスワイプ画面
│   │   │   ├── page.tsx
│   │   │   ├── page.module.css
│   │   │   └── components/
│   │   │       ├── SwipeCard.tsx
│   │   │       ├── SwipeCard.module.css
│   │   │       ├── FilterSheet.tsx
│   │   │       ├── FilterSheet.module.css
│   │   │       ├── ActionButtons.tsx
│   │   │       └── ActionButtons.module.css
│   │   │
│   │   ├── restaurant/[id]/          # 店舗詳細
│   │   │   ├── page.tsx
│   │   │   └── page.module.css
│   │   │
│   │   ├── profile/                  # プロフィール・マイページ
│   │   │   ├── page.tsx
│   │   │   ├── page.module.css
│   │   │   ├── layout.tsx
│   │   │   ├── layout.module.css
│   │   │   ├── likes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── page.module.css
│   │   │   └── bookmarks/
│   │   │       ├── page.tsx
│   │   │       └── page.module.css
│   │   │
│   │   └── api/                      # API Routes
│   │       ├── auth/route.ts
│   │       ├── restaurants/route.ts
│   │       ├── likes/route.ts
│   │       └── bookmarks/route.ts
│   │
│   ├── components/                   # 再利用可能コンポーネント
│   │   ├── ui/                       # 基本UIコンポーネント
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Input.module.css
│   │   │   └── Modal/
│   │   │       ├── Modal.tsx
│   │   │       └── Modal.module.css
│   │   │
│   │   ├── layout/                   # レイアウトコンポーネント
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Header.module.css
│   │   │   └── Navigation/
│   │   │       ├── Navigation.tsx
│   │   │       └── Navigation.module.css
│   │   │
│   │   ├── restaurant/               # 店舗関連コンポーネント
│   │   │   ├── RestaurantCard/
│   │   │   │   ├── RestaurantCard.tsx
│   │   │   │   └── RestaurantCard.module.css
│   │   │   └── RestaurantInfo/
│   │   │       ├── RestaurantInfo.tsx
│   │   │       └── RestaurantInfo.module.css
│   │   │
│   │   ├── swipe/                    # スワイプ関連
│   │   │   ├── SwipeContainer/
│   │   │   │   ├── SwipeContainer.tsx
│   │   │   │   └── SwipeContainer.module.css
│   │   │   └── SwipeGesture/
│   │   │       ├── SwipeGesture.tsx
│   │   │       └── SwipeGesture.module.css
│   │   │
│   │   └── filter/                   # フィルター関連
│   │       ├── RegionSelector/
│   │       │   ├── RegionSelector.tsx
│   │       │   └── RegionSelector.module.css
│   │       └── GenreSelector/
│   │           ├── GenreSelector.tsx
│   │           └── GenreSelector.module.css
│   │
│   ├── lib/                          # ユーティリティ・設定
│   │   ├── supabase/                 # Supabase関連
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── api/                      # API関連
│   │   │   ├── hotpepper.ts
│   │   │   ├── restaurants.ts
│   │   │   └── client.ts
│   │   │
│   │   ├── hooks/                    # カスタムフック
│   │   │   ├── useAuth.ts
│   │   │   ├── useSwipe.ts
│   │   │   ├── useRestaurants.ts
│   │   │   ├── useLikes.ts
│   │   │   └── useBookmarks.ts
│   │   │
│   │   ├── utils/                    # ユーティリティ関数
│   │   │   ├── cn.ts                 # CSS Module クラス結合
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── stores/                   # 状態管理（Zustand）
│   │   │   ├── authStore.ts
│   │   │   ├── restaurantStore.ts
│   │   │   └── filterStore.ts
│   │   │
│   │   └── types/                    # TypeScript型定義
│   │       ├── auth.ts
│   │       ├── restaurant.ts
│   │       ├── api.ts
│   │       └── index.ts
│   │
│   ├── styles/                       # スタイル関連
│   │   ├── globals.css               # グローバルスタイル
│   │   ├── variables.css             # CSS変数定義
│   │   ├── animations.css            # アニメーション定義
│   │   ├── themes/                   # テーマ関連
│   │   │   ├── light.css
│   │   │   └── dark.css
│   │   ├── mixins/                   # CSS Mixins
│   │   │   ├── buttons.css
│   │   │   ├── cards.css
│   │   │   └── layout.css
│   │   └── utilities/                # ユーティリティクラス
│   │       ├── spacing.css
│   │       ├── typography.css
│   │       └── responsive.css
│   │
│   └── middleware.ts                 # Next.js middleware
│
├── docs/                             # ドキュメント
├── scripts/                          # スクリプト
└── tests/                           # テスト
```

## API設計

### ホットペッパーグルメAPI連携

#### 主要エンドポイント
- **グルメサーチAPI**: 店舗データ取得
- **ジャンルマスタAPI**: ジャンル一覧取得
- **大エリアマスタAPI**: 都道府県データ取得

#### 取得データ例
```javascript
// 店舗検索API
const params = {
  key: process.env.HOTPEPPER_API_KEY,
  large_area: 'Z011', // 東京
  genre: 'G001', // 居酒屋
  count: 100,
  type: 'lite',
  order: 4, // おすすめ順
  format: 'json'
};
```

### 内部API設計

#### GET /api/restaurants
店舗一覧取得
```javascript
// Query Parameters
{
  prefecture?: string,
  genre?: string,
  limit?: number,
  offset?: number
}

// Response
{
  restaurants: Restaurant[],
  total: number,
  hasMore: boolean
}
```

#### POST /api/likes
いいね機能
```javascript
// Request Body
{
  restaurantId: string
}

// Response
{
  success: boolean,
  likeId: string
}
```

#### POST /api/bookmarks
ブックマーク機能
```javascript
// Request Body
{
  restaurantId: string,
  memo?: string
}

// Response
{
  success: boolean,
  bookmarkId: string
}
```

## 実装優先順位

### Phase 1 (Week 1)
1. プロジェクト初期設定
2. Supabase環境構築
3. 認証システム実装
4. 基本UIコンポーネント作成
5. データベーステーブル作成

### Phase 2 (Week 2)
1. ホットペッパーAPI連携
2. スワイプUI実装
3. いいね・ブックマーク機能
4. フィルター機能
5. プロフィール画面

## 技術的な制約・考慮事項

### パフォーマンス
- 画像の遅延読み込み実装
- 仮想スクロールでメモリ使用量最適化
- API呼び出しの効率化

### セキュリティ
- Supabase Row Level Security設定
- API キーの適切な管理
- XSS対策

### iPhone最適化
- SafeArea対応
- タッチジェスチャー最適化
- PWA対応検討

### CSS Modules運用ルール
- コンポーネント単位でのスタイル分離
- 共通スタイルはmixins/で管理
- 変数はvariables.cssで一元管理
- BEM命名規則の採用