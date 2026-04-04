import './lib/env.ts';
import { writeNdjson } from './lib/writeNdjson.ts';
import { type MicrocmsNews, transformNews } from './transformers/newsTransformer.ts';

const TARGET_DATASET = 'production';

// ─────────────────────────────────────────────
// microCMS REST API クライアント
// ─────────────────────────────────────────────

interface MicrocmsListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

/**
 * microCMS REST API から指定エンドポイントのリストを全件取得する。
 * 100 件ずつページネーションして全件を返す。
 */
async function fetchMicrocmsAll<T>(endpoint: string): Promise<T[]> {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain) throw new Error('MICROCMS_SERVICE_DOMAIN が .env.local に設定されていません');
  if (!apiKey) throw new Error('MICROCMS_API_KEY が .env.local に設定されていません');

  const baseUrl = `https://${serviceDomain}.microcms.io/api/v1/${endpoint}`;
  const PAGE_LIMIT = 100;
  const results: T[] = [];
  let offset = 0;
  let totalCount = Infinity;

  while (results.length < totalCount) {
    const url = `${baseUrl}?limit=${PAGE_LIMIT}&offset=${offset}&orders=-publishedAt&fields=id,title,body,content,thumbnail,category,publishedAt,createdAt,updatedAt`;
    const res = await fetch(url, {
      headers: { 'X-MICROCMS-API-KEY': apiKey },
    });

    if (!res.ok) {
      throw new Error(`microCMS API エラー: ${res.status} ${res.statusText} (url: ${url})`);
    }

    const json = (await res.json()) as MicrocmsListResponse<T>;
    totalCount = json.totalCount;
    results.push(...json.contents);
    offset += json.contents.length;

    console.log(`  取得中... ${results.length} / ${totalCount} 件`);

    if (json.contents.length === 0) break;
  }

  return results;
}

// ─────────────────────────────────────────────
// メイン処理
// ─────────────────────────────────────────────

async function main() {
  console.log('📡 microCMS からニュース記事を全件取得中...');
  const newsList = await fetchMicrocmsAll<MicrocmsNews>('news');
  console.log(`  取得完了: ${newsList.length} 件`);

  console.log('🔄 Sanity スキーマ形式に変換中...');
  const docs = newsList.map(transformNews);

  console.log('💾 NDJSON に書き出し中...');
  writeNdjson('news', docs as unknown as Record<string, unknown>[]);

  console.log('');
  console.log('--- 次のステップ ---');
  console.log('以下のコマンドで Sanity にインポートしてください:');
  console.log(`  npx sanity dataset import dumps/news.ndjson ${TARGET_DATASET}`);
  console.log('');
  console.log('⚠️  thumbnail がある記事は Sanity CLI がインポート時に画像を自動アップロードします。');
  console.log('    ネットワーク環境・画像数によっては時間がかかります。');
  console.log('');
  console.log('再インポートが必要な場合は先に既存データを削除してください:');
  console.log('  npx tsx scripts/sanity-import/deleteSanityDocs.ts news');
}

main().catch((err: unknown) => {
  console.error('❌ エラーが発生しました:', err);
  process.exit(1);
});
