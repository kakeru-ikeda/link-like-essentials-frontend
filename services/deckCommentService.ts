import { deckRepository } from '@/repositories/api/deckRepository';

/**
 * 通報理由の型
 */
export type ReportReason = 'inappropriate_content' | 'spam' | 'copyright' | 'other';

/**
 * デッキコメントに関するビジネスロジックを提供するサービス
 */
export const deckCommentService = {
  /**
   * コメントを削除する(論理削除)
   * - 自分が投稿したコメントのみ削除可能
   * - バックエンドで権限チェックが行われる
   * @param deckId - デッキID
   * @param commentId - コメントID
   */
  async deleteComment(deckId: string, commentId: string): Promise<void> {
    await deckRepository.deleteComment(deckId, commentId);
  },

  /**
   * コメントを通報する
   * @param deckId - デッキID
   * @param commentId - コメントID
   * @param reason - 通報理由
   * @param details - 詳細(任意)
   * @returns 通報結果
   */
  async reportComment(
    deckId: string,
    commentId: string,
    reason: ReportReason,
    details?: string
  ): Promise<{ success: boolean; message: string }> {
    return await deckRepository.reportComment(deckId, commentId, reason, details);
  },

  /**
   * 通報理由を日本語に変換
   * @param reason - 通報理由
   * @returns 日本語の通報理由
   */
  formatReportReason(reason: ReportReason): string {
    const reasonMap: Record<ReportReason, string> = {
      inappropriate_content: '不適切なコンテンツ',
      spam: 'スパム',
      copyright: '著作権侵害',
      other: 'その他',
    };
    return reasonMap[reason] || 'その他';
  },
};
