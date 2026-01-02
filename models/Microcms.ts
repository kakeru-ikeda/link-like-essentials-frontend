/**
 * microCMSのリストレスポンス共通型
 */
export interface MicrocmsListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
