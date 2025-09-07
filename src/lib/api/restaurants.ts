interface HotpepperResponse {
  results: {
    api_version: string;
    results_available: number;
    results_returned: string;
    results_start: number;
    shop: Shop[];
  };
}

interface Shop {
  id: string;
  name: string;
  logo_image: string;
  name_kana: string;
  address: string;
  station_name: string;
  ktai_coupon: number;
  large_service_area: {
    code: string;
    name: string;
  };
  service_area: {
    code: string;
    name: string;
  };
  large_area: {
    code: string;
    name: string;
  };
  middle_area: {
    code: string;
    name: string;
  };
  small_area: {
    code: string;
    name: string;
  };
  lat: number;
  lng: number;
  genre: {
    name: string;
    catch: string;
    code: string;
  };
  sub_genre?: {
    name: string;
    code: string;
  };
  budget: {
    code: string;
    name: string;
    average: string;
  };
  budget_memo: string;
  catch: string;
  capacity: number;
  access: string;
  mobile_access: string;
  urls: {
    pc: string;
  };
  photo: {
    pc: {
      l: string;
      m: string;
      s: string;
    };
    mobile: {
      l: string;
      s: string;
    };
  };
  open: string;
  close: string;
  party_capacity: number;
  wifi: string;
  wedding: string;
  course: string;
  free_drink: string;
  free_food: string;
  private_room: string;
  horigotatsu: string;
  tatami: string;
  card: string;
  non_smoking: string;
  charter: string;
  ktai: string;
  parking: string;
  barrier_free: string;
  other_memo: string;
  sommelier: string;
  open_air: string;
  show: string;
  equipment: string;
  karaoke: string;
  band: string;
  tv: string;
  english: string;
  pet: string;
  child: string;
  lunch: string;
  midnight: string;
  shop_detail_memo: string;
  coupon_urls: {
    pc: string;
    sp: string;
  };
}

// エリアコードの例（東京の主要エリア）
const TOKYO_AREA_CODES = ['Z011', 'Z012', 'Z013', 'Z014', 'Z015'];

// ジャンルコードの例
const GENRE_CODES = [
  'G001', // 居酒屋
  'G002', // ダイニングバー・バル
  'G003', // 創作料理
  'G004', // 和食
  'G005', // 洋食
  'G006', // イタリアン・フレンチ
  'G007', // 中華
  'G008', // 焼肉・ホルモン
  'G009', // アジア・エスニック料理
  'G010', // 各国料理
  'G011', // カラオケ・パーティ
  'G012', // バー・カクテル
  'G013', // ラーメン
  'G014', // カフェ・スイーツ
];

/**
 * ホットペッパーAPIから店舗情報を取得
 * @param params 検索パラメータ
 * @returns 店舗情報の配列
 */
export async function fetchRestaurants(params?: {
  keyword?: string;
  area?: string;
  genre?: string;
  count?: number;
  start?: number;
}) {
  const apiKey = process.env.HOTPEPPER_API_KEY;
  
  if (!apiKey) {
    throw new Error('HOTPEPPER_API_KEY is not set in environment variables');
  }

  // デフォルトパラメータの設定
  const queryParams: Record<string, string> = {
    key: apiKey,
    format: 'json',
    count: String(params?.count || 10),
    start: String(params?.start || 1),
  };

  // エリアの設定（ランダムまたは指定）
  if (params?.area) {
    queryParams.large_area = params.area;
  } else {
    queryParams.large_area = TOKYO_AREA_CODES[Math.floor(Math.random() * TOKYO_AREA_CODES.length)];
  }

  // ジャンルの設定（ランダムまたは指定）
  if (params?.genre) {
    queryParams.genre = params.genre;
  } else {
    queryParams.genre = GENRE_CODES[Math.floor(Math.random() * GENRE_CODES.length)];
  }

  // キーワード検索がある場合は追加
  if (params?.keyword) {
    queryParams.keyword = params.keyword;
  }

  const searchParams = new URLSearchParams(queryParams);

  try {
    const response = await fetch(
      `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Next.jsのキャッシュ設定（1時間キャッシュ）
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HotpepperResponse = await response.json();
    
    return {
      shops: data.results.shop,
      totalCount: data.results.results_available,
      returnedCount: parseInt(data.results.results_returned),
      startIndex: data.results.results_start,
    };
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
    throw new Error('Failed to fetch restaurants from Hotpepper API');
  }
}

/**
 * ランダムに3件の店舗を取得
 * @returns ランダムな3件の店舗情報
 */
export async function fetchRandomRestaurants() {
  try {
    // ランダムなエリアとジャンルで多めに取得
    const result = await fetchRestaurants({
      count: 10, // 多めに取得してランダム性を高める
    });

    if (result.shops.length === 0) {
      console.log('No restaurants found');
      return [];
    }

    // 取得した店舗からランダムに3件選択
    const shuffled = [...result.shops].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(3, shuffled.length));

    console.log(`\n===== ランダムに選ばれた${selected.length}件の店舗 =====`);
    selected.forEach((shop, index) => {
      console.log(`\n【${index + 1}】 ${shop.name}`);
      console.log(`   ジャンル: ${shop.genre.name}`);
      console.log(`   エリア: ${shop.large_area.name} - ${shop.middle_area.name}`);
      console.log(`   住所: ${shop.address}`);
      console.log(`   アクセス: ${shop.access}`);
      console.log(`   予算: ${shop.budget.average || '情報なし'}`);
      console.log(`   キャッチ: ${shop.catch}`);
      console.log(`   営業時間: ${shop.open}`);
      console.log(`   定休日: ${shop.close}`);
      console.log(`   席数: ${shop.capacity}席`);
      console.log(`   URL: ${shop.urls.pc}`);
    });
    console.log('\n=====================================\n');

    return selected;
  } catch (error) {
    console.error('Error fetching random restaurants:', error);
    throw error;
  }
}

/**
 * 特定の条件で店舗を検索
 * @param searchOptions 検索オプション
 * @returns 検索結果の店舗情報
 */
export async function searchRestaurants(searchOptions: {
  keyword?: string;
  area?: string;
  genre?: string;
  budget?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const result = await fetchRestaurants({
      keyword: searchOptions.keyword,
      area: searchOptions.area,
      genre: searchOptions.genre,
      count: searchOptions.limit || 10,
      start: searchOptions.offset || 1,
    });

    console.log(`\n===== 検索結果: ${result.returnedCount}件 / 全${result.totalCount}件 =====`);
    if (searchOptions.keyword) console.log(`キーワード: ${searchOptions.keyword}`);
    if (searchOptions.area) console.log(`エリア: ${searchOptions.area}`);
    if (searchOptions.genre) console.log(`ジャンル: ${searchOptions.genre}`);
    console.log('=====================================\n');

    return result;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
}

// エクスポート用の型定義
export type { Shop, HotpepperResponse };
