import './lib/env.ts';
import { createClient } from '@sanity/client';

/**
 * Sanity の production データセットから指定の _type のドキュメント（公開・ドラフト両方）を全削除する。
 * 必要な環境変数:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  （Editor 以上のトークン）
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID が設定されていません');
if (!token) throw new Error('SANITY_API_TOKEN が設定されていません');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

/**
 * 指定 type のドキュメント ID を全件取得して削除する。
 * ドラフト（drafts.*）も含めて削除する。
 */
async function deleteAllByType(docType: string): Promise<void> {
  // 公開ドキュメント
  const published = await client.fetch<{ _id: string }[]>(
    `*[_type == $type]{ _id }`,
    { type: docType }
  );

  // ドラフト
  const drafts = await client.fetch<{ _id: string }[]>(
    `*[_id in path("drafts.**") && _type == $type]{ _id }`,
    { type: docType }
  );

  const ids = [...published, ...drafts].map((d) => d._id);

  if (ids.length === 0) {
    console.log(`  ${docType}: 削除対象なし`);
    return;
  }

  console.log(`  ${docType}: ${ids.length} 件を削除中...`);

  // Sanity の一括削除は transaction で行う（500件ずつ分割）
  const CHUNK = 500;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    const tx = client.transaction();
    chunk.forEach((id) => tx.delete(id));
    await tx.commit();
  }

  console.log(`  ✅ ${docType}: ${ids.length} 件削除完了`);
}

async function main() {
  const docType = process.argv[2];
  if (!docType) {
    console.error('使い方: npx tsx deleteSanityDocs.ts <_type>');
    console.error('例: npx tsx deleteSanityDocs.ts song');
    process.exit(1);
  }

  console.log(`🗑  Sanity から "${docType}" を全削除します (dataset: ${dataset})`);
  await deleteAllByType(docType);
  console.log('完了');
}

main().catch((err: unknown) => {
  console.error('❌ エラー:', err);
  process.exit(1);
});
