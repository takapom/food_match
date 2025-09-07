import { NextRequest, NextResponse } from 'next/server';

// ホットペッパーAPI用の型定義
interface HotpepperResponse {
  results: {
    api_version: string;
    results_available: number;
    results_returned: string;
    results_start: number;
    shop: HotpepperShop[];
  };
}

interface HotpepperShop {
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
  access: string;
  mobile_access: string;
  urls: {
    pc: string;
    mobile: string;
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
  party_capacity?: number;
  wifi?: string;
  other_memo?: string;
  shop_detail_memo?: string;
  budget_memo?: string;
  wedding?: string;
  course?: string;
  free_drink?: string;
  free_food?: string;
  private_room?: string;
  horigotatsu?: string;
  tatami?: string;
  card?: string;
  non_smoking?: string;
  charter?: string;
  parking?: string;
  barrier_free?: string;
  sommelier?: string;
  open_air?: string;
  show?: string;
  equipment?: string;
  karaoke?: string;
  band?: string;
  tv?: string;
  lunch?: string;
  midnight?: string;
  english?: string;
  pet?: string;
  child?: string;
  catch: string;
}

// 東京エリアのコード
const TOKYO_AREA_CODES = [
  'Z011', // 銀座・新橋・有楽町
  'Z012', // 東京・丸の内・日本橋
  'Z013', // 神田・秋葉原・水道橋
  'Z014', // 新宿・代々木
  'Z015', // 四谷・市ヶ谷・神楽坂
  'Z016', // 渋谷・恵比寿・代官山
  'Z017', // 六本木・赤坂・麻布
  'Z018', // 青山・表参道・原宿
  'Z019', // 赤羽・板橋・王子
  'Z020', // 巣鴨・駒込・田端
];

// ジャンルコード
const GENRE_CODES: Record<string, string> = {
  'izakaya': 'G001',      // 居酒屋
  'dinnerbar': 'G002',    // ダイニングバー
  'creative': 'G003',     // 創作料理
  'japanese': 'G004',     // 和食
  'western': 'G005',      // 洋食
  'italian': 'G006',      // イタリアン・フレンチ
  'chinese': 'G007',      // 中華
  'yakiniku': 'G008',     // 焼肉・ホルモン
  'korean': 'G017',       // 韓国料理
  'asian': 'G009',        // アジア・エスニック料理
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');
    const genre = searchParams.get('genre');
    const count = searchParams.get('count') || '10';
    const start = searchParams.get('start') || '1';

    const apiKey = process.env.HOTPEPPER_API_KEY;
    
    if (!apiKey) {
      throw new Error('HOTPEPPER_API_KEY is not configured');
    }

    // APIパラメータの構築
    const queryParams: Record<string, string> = {
      key: apiKey,
      format: 'json',
      count,
      start,
    };

    // エリア指定
    if (area) {
      queryParams.large_area = area;
    } else {
      // ランダムな東京エリア
      const randomArea = TOKYO_AREA_CODES[Math.floor(Math.random() * TOKYO_AREA_CODES.length)];
      queryParams.large_area = randomArea;
    }

    // ジャンル指定
    if (genre && GENRE_CODES[genre]) {
      queryParams.genre = GENRE_CODES[genre];
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const hotpepperUrl = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${queryString}`;

    console.log('Fetching from Hotpepper API:', hotpepperUrl.replace(apiKey, '[API_KEY]'));

    const response = await fetch(hotpepperUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'FoodMatchingApp/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Hotpepper API request failed: ${response.status} ${response.statusText}`);
    }

    const data: HotpepperResponse = await response.json();
    
    if (!data.results || !data.results.shop) {
      throw new Error('Invalid response format from Hotpepper API');
    }

    // 空の結果でもそのまま返す（エラーにしない）
    console.log(`Found ${data.results.shop.length} restaurants from Hotpepper API`);
    return NextResponse.json(data.results.shop);
    
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch restaurants',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}