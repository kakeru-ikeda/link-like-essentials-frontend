import { createClient, type SanityClient } from '@sanity/client';

/**
 * 書き込み専用 Sanity クライアント（スクレイパー専用・ブラウザには渡さない）
 * 環境変数は関数実行時に評価する（tsx 実行時は dotenv のロードが import より後になるため）
 */
function getClient(): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!projectId) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not defined');
  }
  if (!token) {
    throw new Error('SANITY_WRITE_TOKEN is not defined');
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  });
}

/**
 * GROQ クエリ実行（読み取り専用）
 */
export async function sanityQuery<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  return getClient().fetch<T>(query, params ?? {});
}

/**
 * ドキュメントをドラフトとして書き込む
 * - 既存ドラフトがあれば上書き
 * - 公開済みドキュメントには一切触れない
 */
export async function writeDraft(
  doc: Record<string, unknown> & { _id: string; _type: string }
): Promise<void> {
  const draftId = doc._id.startsWith('drafts.')
    ? doc._id
    : `drafts.${doc._id}`;

  await getClient().createOrReplace({
    ...doc,
    _id: draftId,
  });
}

/**
 * 公開済みドキュメントのIDを取得する（ドラフトは除外）
 */
export async function fetchPublishedIds(type: string): Promise<string[]> {
  const results = await sanityQuery<Array<{ _id: string }>>(
    `*[_type == $type && !(_id in path("drafts.**"))]{ _id }`,
    { type }
  );
  return results.map((r) => r._id);
}

/**
 * 公開済みドキュメントの軽量フィールドを取得する
 */
export async function fetchPublished<T>(
  type: string,
  fields: string
): Promise<T[]> {
  return sanityQuery<T[]>(
    `*[_type == $type && !(_id in path("drafts.**"))]{${fields}}`,
    { type }
  );
}

/**
 * 既存ドラフトのIDを取得する
 */
export async function fetchDraftIds(type: string): Promise<string[]> {
  const results = await sanityQuery<Array<{ _id: string }>>(
    `*[_id in path("drafts.**") && _type == $type]{ _id }`,
    { type }
  );
  // "drafts." プレフィックスを除いた実ドキュメントIDに変換
  return results.map((r) => r._id.replace(/^drafts\./, ''));
}

/**
 * ドラフトドキュメントの軽量フィールドを取得する
 * - "drafts." プレフィックスを除いた _id で返す
 */
export async function fetchDrafts<T extends { _id: string }>(
  type: string,
  fields: string
): Promise<T[]> {
  const results = await sanityQuery<T[]>(
    `*[_id in path("drafts.**") && _type == $type]{${fields}}`,
    { type }
  );
  return results.map((r) => ({ ...r, _id: (r._id as string).replace(/^drafts\./, '') }));
}
