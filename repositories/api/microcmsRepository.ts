import { createClient, MicroCMSQueries } from 'microcms-js-sdk';
import { MicrocmsListResponse } from '@/models/Microcms';

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain) {
  throw new Error('MICROCMS_SERVICE_DOMAINが設定されていません');
}

if (!apiKey) {
  throw new Error('MICROCMS_API_KEYが設定されていません');
}

const client = createClient({
  serviceDomain,
  apiKey,
});

export const DEFAULT_MICROCMS_REVALIDATE_SECONDS = 900;

interface MicrocmsRequestParams {
  endpoint: string;
  queries?: MicroCMSQueries;
  revalidateSeconds?: number;
}

type NextRequestInit = RequestInit & { next?: { revalidate?: number } };

function buildRequestInit(revalidateSeconds?: number): NextRequestInit {
  return {
    next: { revalidate: revalidateSeconds ?? DEFAULT_MICROCMS_REVALIDATE_SECONDS },
  };
}

/**
 * microCMS からオブジェクトを取得する
 * @param endpoint - microCMS のエンドポイント
 * @param queries - フィルターやリミットなどのクエリ
 * @param revalidateSeconds - ISR の再検証秒数（省略時はデフォルト）
 * @returns 取得したオブジェクト
 */
export async function getMicrocmsObject<T>({
  endpoint,
  queries,
  revalidateSeconds,
}: MicrocmsRequestParams): Promise<T> {
  return client.get<T>({
    endpoint,
    queries,
    customRequestInit: buildRequestInit(revalidateSeconds),
  });
}

/**
 * microCMS からリストを取得する
 * @param endpoint - microCMS のエンドポイント
 * @param queries - フィルターやリミットなどのクエリ
 * @param revalidateSeconds - ISR の再検証秒数（省略時はデフォルト）
 * @returns microCMS のリストレスポンス
 */
export async function getMicrocmsList<T>({
  endpoint,
  queries,
  revalidateSeconds,
}: MicrocmsRequestParams): Promise<MicrocmsListResponse<T>> {
  return client.get<MicrocmsListResponse<T>>({
    endpoint,
    queries,
    customRequestInit: buildRequestInit(revalidateSeconds),
  });
}

export type { MicroCMSQueries };
