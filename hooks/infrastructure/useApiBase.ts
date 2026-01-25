import { useState, useCallback } from 'react';

export interface ApiExecuteOptions<T> {
  /** 成功時のコールバック */
  onSuccess?: (data: T) => void;
  /** エラー時のコールバック */
  onError?: (error: Error) => void;
  /** エラー時のログメッセージ */
  errorMessage?: string;
}

export interface UseApiBaseReturn {
  /** API呼び出しを実行 */
  execute: <T>(
    apiCall: () => Promise<T>,
    options?: ApiExecuteOptions<T>
  ) => Promise<T>;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * API呼び出しの共通ロジックを提供する基底フック
 * 
 * ローディング状態、エラーハンドリング、ログ出力などを一元管理
 */
export const useApiBase = (): UseApiBaseReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      options?: ApiExecuteOptions<T>
    ): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiCall();

        // 成功コールバック
        options?.onSuccess?.(data);

        return data;
      } catch (err) {
        // エラーメッセージ
        const errorMsg =
          options?.errorMessage ||
          (err instanceof Error ? err.message : 'エラーが発生しました');

        setError(errorMsg);

        // エラーコールバック
        options?.onError?.(err as Error);

        // エラーを再スロー（呼び出し側でcatchできるように）
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { execute, isLoading, error, reset };
};
