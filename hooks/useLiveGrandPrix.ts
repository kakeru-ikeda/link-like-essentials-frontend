import { useQuery } from '@apollo/client';
import {
  GET_LIVE_GRAND_PRIX,
  GET_LIVE_GRAND_PRIX_BY_ID,
  GET_LIVE_GRAND_PRIX_BY_EVENT_NAME,
  GET_LIVE_GRAND_PRIX_STATS,
} from '@/repositories/graphql/queries/liveGrandPrix';
import { LiveGrandPrix, LiveGrandPrixStats } from '@/models/LiveGrandPrix';

/**
 * ライブグランプリフィルター
 */
export interface LiveGrandPrixFilter {
  yearTerm?: string;
  eventName?: string;
  startDateFrom?: string;
  startDateTo?: string;
}

interface LiveGrandPrixQueryData {
  liveGrandPrix: LiveGrandPrix[];
}

interface LiveGrandPrixByIdQueryData {
  liveGrandPrixById: LiveGrandPrix;
}

interface LiveGrandPrixByEventNameQueryData {
  liveGrandPrixByEventName: LiveGrandPrix;
}

interface LiveGrandPrixStatsQueryData {
  liveGrandPrixStats: LiveGrandPrixStats;
}

/**
 * ライブグランプリ一覧を取得するフック
 * 
 * @param filter ライブグランプリフィルター（省略時は全件取得）
 * @param skip クエリをスキップするかどうか
 * @returns ライブグランプリ配列、ローディング状態、エラーメッセージ
 */
export const useLiveGrandPrix = (
  filter?: LiveGrandPrixFilter,
  skip?: boolean
): {
  liveGrandPrix: LiveGrandPrix[];
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<
    LiveGrandPrixQueryData,
    { filter?: LiveGrandPrixFilter }
  >(GET_LIVE_GRAND_PRIX, {
    variables: filter ? { filter } : undefined,
    skip,
  });

  return {
    liveGrandPrix: data?.liveGrandPrix ?? [],
    loading,
    error: error?.message,
  };
};

/**
 * 単一ライブグランプリをIDで取得するフック
 * 
 * @param id ライブグランプリID
 * @param skip クエリをスキップするかどうか
 * @returns ライブグランプリオブジェクト、ローディング状態、エラーメッセージ
 */
export const useLiveGrandPrixById = (
  id: string,
  skip?: boolean
): {
  liveGrandPrix: LiveGrandPrix | null;
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<
    LiveGrandPrixByIdQueryData,
    { id: string }
  >(GET_LIVE_GRAND_PRIX_BY_ID, {
    variables: { id },
    skip,
  });

  return {
    liveGrandPrix: data?.liveGrandPrixById ?? null,
    loading,
    error: error?.message,
  };
};

/**
 * 単一ライブグランプリをイベント名で取得するフック
 * 
 * @param eventName イベント名
 * @param skip クエリをスキップするかどうか
 * @returns ライブグランプリオブジェクト、ローディング状態、エラーメッセージ
 */
export const useLiveGrandPrixByEventName = (
  eventName: string,
  skip?: boolean
): {
  liveGrandPrix: LiveGrandPrix | null;
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<
    LiveGrandPrixByEventNameQueryData,
    { eventName: string }
  >(GET_LIVE_GRAND_PRIX_BY_EVENT_NAME, {
    variables: { eventName },
    skip,
  });

  return {
    liveGrandPrix: data?.liveGrandPrixByEventName ?? null,
    loading,
    error: error?.message,
  };
};

/**
 * ライブグランプリ統計を取得するフック
 * 
 * @param skip クエリをスキップするかどうか
 * @returns 統計オブジェクト、ローディング状態、エラーメッセージ
 */
export const useLiveGrandPrixStats = (skip?: boolean): {
  stats: LiveGrandPrixStats | null;
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<LiveGrandPrixStatsQueryData>(
    GET_LIVE_GRAND_PRIX_STATS,
    {
      skip,
    }
  );

  return {
    stats: data?.liveGrandPrixStats ?? null,
    loading,
    error: error?.message,
  };
};
