/**
 * デッキ一覧取得のクエリパラメータ
 */
export interface GetDecksParams {
  /** ページ番号（1から始まる） */
  page?: number;

  /** 1ページあたりのアイテム数（デフォルト: 20、最大: 100） */
  perPage?: number;

  /** ソート項目 */
  orderBy?: 'publishedAt' | 'viewCount' | 'likeCount';

  /** ソート順（デフォルト: desc） */
  order?: 'asc' | 'desc';

  /** ユーザーIDでフィルタ */
  userId?: string;

  /** 楽曲IDでフィルタ */
  songId?: string;

  /** ハッシュタグでフィルタ */
  tag?: string;
}
