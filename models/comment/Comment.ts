/**
 * 通報理由の型
 */
export type ReportReason = 'inappropriate_content' | 'spam' | 'other';

/**
 * 通報理由の選択肢一覧
 */
export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'inappropriate_content', label: '不適切なコンテンツ' },
  { value: 'spam', label: 'スパム' },
  { value: 'other', label: 'その他' },
];

/**
 * 通報理由を日本語ラベルに変換
 * @param reason - 通報理由
 * @returns 日本語ラベル
 */
export const getReportReasonLabel = (reason: ReportReason): string => {
  const found = REPORT_REASONS.find((r) => r.value === reason);
  return found?.label ?? 'その他';
};

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
