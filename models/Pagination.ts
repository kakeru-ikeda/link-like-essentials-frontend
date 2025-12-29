/**
 * ページネーション情報
 */
export interface PageInfo {
  /** 現在のページ番号 */
  currentPage: number;

  /** 1ページあたりのアイテム数 */
  perPage: number;

  /** 総アイテム数 */
  totalCount: number;

  /** 総ページ数 */
  totalPages: number;

  /** 次のページが存在するか */
  hasNextPage: boolean;

  /** 前のページが存在するか */
  hasPreviousPage: boolean;
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> {
  /** データ配列 */
  data: T[];

  /** ページネーション情報 */
  pageInfo: PageInfo;
}
