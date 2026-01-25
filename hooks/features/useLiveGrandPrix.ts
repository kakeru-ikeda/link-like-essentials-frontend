import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import {
  GET_LIVE_GRAND_PRIX,
  GET_LIVE_GRAND_PRIX_BY_ID,
  GET_LIVE_GRAND_PRIX_BY_EVENT_NAME,
  GET_LIVE_GRAND_PRIX_STATS,
} from '@/repositories/graphql/queries/liveGrandPrix';
import { LiveGrandPrix, LiveGrandPrixStats } from '@/models/features/LiveGrandPrix';

/**
 * ライブグランプリフィルター
 */
export interface LiveGrandPrixFilter {
  yearTerm?: string;
  eventName?: string;
  startDateFrom?: string;
  startDateTo?: string;
  hasSongWithDeckType?: string;
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

const ACTIVE_LGP_CACHE_KEY = 'activeLiveGrandPrix';

interface ActiveLiveGrandPrixCache {
  event: LiveGrandPrix | null;
  endDate: string;
  cachedAt: string;
}

/**
 * 開催中のライブグランプリを取得するフック
 * endDateをlocalStorageにキャッシュし、期限内はGraphQLクエリを実行しない
 * 
 * @returns 開催中のライブグランプリ、ローディング状態、エラーメッセージ
 */
export const useActiveLiveGrandPrix = (): {
  activeLiveGrandPrix: LiveGrandPrix | null;
  loading: boolean;
  error: string | undefined;
} => {
  const [cachedEvent, setCachedEvent] = useState<LiveGrandPrix | null>(null);
  const [shouldFetch, setShouldFetch] = useState<boolean>(true);
  const [queryDate] = useState<string>(() => new Date().toISOString());

  // localStorageから開催中イベントのキャッシュをチェック
  useEffect(() => {
    const cached = localStorage.getItem(ACTIVE_LGP_CACHE_KEY);
    if (cached) {
      try {
        const data: ActiveLiveGrandPrixCache = JSON.parse(cached);
        const endDate = new Date(data.endDate);
        const now = new Date();
        
        // キャッシュが有効期限内であればGraphQLクエリをスキップ
        if (now < endDate && data.event) {
          setCachedEvent(data.event);
          setShouldFetch(false);
        } else {
          // 期限切れの場合はキャッシュをクリア
          localStorage.removeItem(ACTIVE_LGP_CACHE_KEY);
        }
      } catch (e) {
        console.error('Failed to parse active LGP cache:', e);
        localStorage.removeItem(ACTIVE_LGP_CACHE_KEY);
      }
    }
  }, []);

  // 現在時刻を基準に開催中のイベントを検索
  // 注: GraphQLスキーマではstartDateFrom/Toのみサポート
  // 開催中判定はstartDateToで開始済みイベントを取得し、クライアント側でendDateをチェック
  const { data, loading, error } = useQuery<
    LiveGrandPrixQueryData,
    { filter: LiveGrandPrixFilter }
  >(GET_LIVE_GRAND_PRIX, {
    variables: {
      filter: {
        startDateTo: queryDate,    // 開始日が現在より前のイベントを取得
      },
    },
    skip: !shouldFetch, // キャッシュが有効な場合はスキップ
  });

  // GraphQLから取得したデータをキャッシュに保存
  useEffect(() => {
    if (data?.liveGrandPrix && data.liveGrandPrix.length > 0) {
      // クライアント側でendDateをチェックして開催中イベントを抽出
      const nowDate = new Date();
      const activeEvent = data.liveGrandPrix.find(event => {
        const endDate = new Date(event.endDate);
        return endDate > nowDate;
      });
      
      if (activeEvent) {
        const cache: ActiveLiveGrandPrixCache = {
          event: activeEvent,
          endDate: activeEvent.endDate,
          cachedAt: new Date().toISOString(),
        };
        localStorage.setItem(ACTIVE_LGP_CACHE_KEY, JSON.stringify(cache));
        setCachedEvent(activeEvent);
      } else {
        // 開催中イベントがない場合はキャッシュをクリア
        localStorage.removeItem(ACTIVE_LGP_CACHE_KEY);
        setCachedEvent(null);
      }
    } else if (data?.liveGrandPrix && data.liveGrandPrix.length === 0) {
      // 開催中イベントがない場合はキャッシュをクリア
      localStorage.removeItem(ACTIVE_LGP_CACHE_KEY);
      setCachedEvent(null);
    }
  }, [data]);

  // クライアント側で開催中イベントを抽出して返す
  const activeFromQuery = data?.liveGrandPrix?.find(event => {
    const endDate = new Date(event.endDate);
    return endDate > new Date();
  }) || null;

  return {
    activeLiveGrandPrix: cachedEvent || activeFromQuery,
    loading: shouldFetch ? loading : false,
    error: error?.message,
  };
};
