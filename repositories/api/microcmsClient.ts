import { createClient, MicroCMSQueries } from 'microcms-js-sdk';
import { MicrocmsListResponse } from '@/models/Microcms';

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is not set');
}

if (!apiKey) {
  throw new Error('MICROCMS_API_KEY is not set');
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
