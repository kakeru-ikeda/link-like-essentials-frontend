import { DeckForCloud } from './Deck';

/**
 * 公開済みデッキ型
 * サーバーから取得する公開されたデッキのデータ
 */
export interface PublishedDeck {
  /** 公開ID（デッキ公開時のユニークID） */
  id: string;

  /** 基本デッキ情報 */
  deck: DeckForCloud;

  /** 公開者のAuthUID */
  userId: string;

  /** 公開者の表示名 */
  userName: string;

  /** コメント */
  comment?: string;

  /** ハッシュタグ配列 */
  hashtags: string[];

  /** アップロード画像URL配列 */
  imageUrls?: string[];

  /** サムネイル画像URL */
  thumbnail?: string;

  /** 閲覧数 */
  viewCount: number;

  /** いいね数 */
  likeCount: number;

  /** 公開日時 */
  publishedAt: string;
}

/**
 * デッキ公開リクエスト用の型
 * クライアントからサーバーへの公開時に送信するデータ
 * PublishedDeckから送信に必要なフィールドのみをPick
 */
export type DeckPublicationRequest = Pick<
  PublishedDeck,
  'id' | 'deck' | 'comment' | 'hashtags' | 'imageUrls' | 'thumbnail'
>;
