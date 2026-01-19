import { DeckForCloud } from '@/models/Deck';
import { UserProfile } from '@/models/User';

/**
 * 公開済みデッキ型
 * サーバーから取得する公開されたデッキのデータ
 */
export interface PublishedDeck {
  /** 公開ID（デッキ公開時のユニークID） */
  id: string;

  /** 基本デッキ情報 */
  deck: DeckForCloud;

  /** 公開者のユーザープロフィール情報 */
  userProfile: UserProfile;

  /** コメント */
  comment?: string;

  /** ハッシュタグ配列 */
  hashtags: string[];

  /** 非公開リスト（URL共有で閲覧可） */
  isUnlisted: boolean;

  /** アップロード画像URL配列 */
  imageUrls?: string[];

  /** サムネイル画像URL */
  thumbnail?: string;

  /** 閲覧数 */
  viewCount: number;

  /** いいね数 */
  likeCount: number;

  /** 現在のユーザーがいいね済みかどうか（任意フィールド） */
  likedByCurrentUser?: boolean;

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
  | 'id'
  | 'deck'
  | 'comment'
  | 'hashtags'
  | 'isUnlisted'
  | 'imageUrls'
  | 'thumbnail'
>;
