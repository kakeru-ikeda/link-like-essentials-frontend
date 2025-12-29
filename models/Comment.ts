/**
 * デッキコメント型
 */
export interface Comment {
  /** コメントID */
  id: string;

  /** デッキID（公開ID） */
  deckId: string;

  /** コメント投稿者のAuthUID */
  userId: string;

  /** コメント投稿者の表示名 */
  userName: string;

  /** コメント本文 */
  text: string;

  /** コメント投稿日時 */
  createdAt: string;
}
