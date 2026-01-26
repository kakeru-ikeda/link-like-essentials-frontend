import { useState } from 'react';
import { Comment } from '@/models/domain/Comment';
import { UserProfile } from '@/models/domain/User';
import { MAX_COMMENT_LENGTH } from '@/hooks/published-deck/useDeckComments';
import { UserAvatar } from '@/components/user/UserAvatar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ReportModal } from '@/components/common/ReportModal';
import { ReportReason } from '@/models/domain/Comment';

interface DeckCommentSectionProps {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  commentText: string;
  onChangeComment: (text: string) => void;
  onSubmit: () => void;
  onRefresh: () => void;
  posting: boolean;
  postError: string | null;
  canPost: boolean;
  restrictionMessage: string | null;
  userProfiles: Map<string, UserProfile>;
  profilesLoading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  totalCount: number;
  currentUserId?: string;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onReportComment?: (
    commentId: string,
    reason: ReportReason,
    details?: string
  ) => Promise<void>;
}

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type ModalType = 'none' | 'post' | 'delete' | 'report';

interface ModalState {
  type: ModalType;
  data: {
    commentId?: string;
    commentUserName?: string;
  };
}

export const DeckCommentSection: React.FC<DeckCommentSectionProps> = ({
  comments,
  loading,
  error,
  commentText,
  onChangeComment,
  onSubmit,
  onRefresh,
  posting,
  postError,
  canPost,
  restrictionMessage,
  userProfiles,
  loadingMore,
  hasMore,
  onLoadMore,
  totalCount,
  currentUserId,
  onDeleteComment,
  onReportComment,
}) => {
  const [modalState, setModalState] = useState<ModalState>({
    type: 'none',
    data: {},
  });

  const closeModal = () => setModalState({ type: 'none', data: {} });

  const handleSubmitClick = () => {
    if (commentText.trim().length === 0 || !canPost || posting) return;
    setModalState({ type: 'post', data: {} });
  };

  const handleConfirm = async () => {
    closeModal();
    onSubmit();
  };

  const handleReportClick = (commentId: string, commentUserName: string) => {
    setModalState({ type: 'report', data: { commentId, commentUserName } });
  };

  const handleReportSubmit = async (reason: ReportReason, details?: string) => {
    if (!modalState.data.commentId || !onReportComment) return;
    await onReportComment(modalState.data.commentId, reason, details);
    closeModal();
  };

  const handleDeleteClick = (commentId: string) => {
    setModalState({ type: 'delete', data: { commentId } });
  };

  const handleDeleteConfirm = async () => {
    if (!modalState.data.commentId || !onDeleteComment) return;
    try {
      await onDeleteComment(modalState.data.commentId);
      closeModal();
    } catch (err) {
      // エラーはフック側で処理される
      closeModal();
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={modalState.type === 'post'}
        title="コメントを投稿しますか?"
        description="投稿したコメントは他のユーザーに公開されます。公序良俗に反する内容や個人情報の記載はお控えください。"
        confirmLabel="投稿する"
        cancelLabel="キャンセル"
        onConfirm={handleConfirm}
        onCancel={closeModal}
        confirmVariant="primary"
      >
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1 text-xs font-semibold text-slate-600">
            投稿内容のプレビュー:
          </p>
          <p className="whitespace-pre-wrap text-sm text-slate-900">
            {commentText}
          </p>
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={modalState.type === 'delete'}
        title="コメントを削除しますか?"
        description="削除したコメントは復元できません。本当に削除してもよろしいですか?"
        confirmLabel="削除する"
        cancelLabel="キャンセル"
        onConfirm={handleDeleteConfirm}
        onCancel={closeModal}
        confirmVariant="danger"
      />

      <ReportModal
        isOpen={modalState.type === 'report'}
        onClose={closeModal}
        onSubmit={handleReportSubmit}
        title="コメントを通報"
        targetName={modalState.data.commentUserName || ''}
      />

      <section className="mt-10 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Community
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              コメント{' '}
              {totalCount > 0 && (
                <span className="text-sm font-normal text-slate-500">
                  ({totalCount})
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            再読み込み
          </button>
        </div>

        <div className="grid gap-6 p-4 lg:grid-cols-[1fr_0.75fr]">
          <div className="space-y-3">
            {error && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                コメントを読み込んでいます...
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                まだコメントはありません。最初の感想を共有してみましょう。
              </div>
            ) : (
              <ul className="space-y-3">
                {comments.map((comment) => {
                  const userProfile = userProfiles.get(comment.userId);
                  const avatarUrl = userProfile?.avatarUrl;
                  const isOwnComment = currentUserId === comment.userId;

                  return (
                    <li
                      key={comment.id}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          userProfile={userProfile}
                          size="md"
                          showTooltip={!!userProfile}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {comment.userName || '匿名ユーザー'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatDateTime(comment.createdAt)}
                              </p>
                            </div>
                            {currentUserId && (
                              <div className="flex gap-2">
                                {isOwnComment
                                  ? onDeleteComment && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteClick(comment.id)
                                        }
                                        className="text-xs text-slate-500 hover:text-red-600"
                                      >
                                        削除
                                      </button>
                                    )
                                  : onReportComment && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleReportClick(
                                            comment.id,
                                            comment.userName
                                          )
                                        }
                                        className="text-xs text-slate-500 hover:text-red-600"
                                      >
                                        通報
                                      </button>
                                    )}
                              </div>
                            )}
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {!loading && hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingMore ? '読み込み中...' : 'さらに読み込む'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Share
                </p>
                <h3 className="text-sm font-bold text-slate-900">
                  コメントを投稿
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {commentText.length}/{MAX_COMMENT_LENGTH}
              </span>
            </div>

            <textarea
              value={commentText}
              onChange={(e) => onChangeComment(e.target.value)}
              maxLength={MAX_COMMENT_LENGTH}
              placeholder={
                restrictionMessage ??
                'デッキへの感想やアドバイスを書いてみましょう'
              }
              className="h-32 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              disabled={!canPost || posting}
            />

            {restrictionMessage && (
              <p className="text-xs text-slate-500">{restrictionMessage}</p>
            )}

            {postError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {postError}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={
                  !canPost || posting || commentText.trim().length === 0
                }
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {posting ? '投稿中...' : 'コメントを投稿'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
