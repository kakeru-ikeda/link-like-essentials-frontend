/**
 * microCMSのリストレスポンス共通型
 */
export interface MicrocmsListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

/**
 * microCMSのクエリパラメータ共通型
 */
export interface MicrocmsListParams {
  draftKey?: string;
  limit?: number;
  offset?: number;
  orders?: string;
  q?: string;
  fields?: string;
  ids?: string;
  depth?: number;
}
