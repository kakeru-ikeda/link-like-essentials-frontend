import { Comment } from '@/models/Comment';
import { MAX_COMMENT_LENGTH } from '@/hooks/useDeckComments';

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
}) => {
  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Community</p>
          <h2 className="text-lg font-bold text-slate-900">コメント</h2>
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
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{comment.userName || '匿名ユーザー'}</p>
                      <p className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</p>
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{comment.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Share</p>
              <h3 className="text-sm font-bold text-slate-900">コメントを投稿</h3>
            </div>
            <span className="text-xs text-slate-500">
              {commentText.length}/{MAX_COMMENT_LENGTH}
            </span>
          </div>

          <textarea
            value={commentText}
            onChange={(e) => onChangeComment(e.target.value)}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder={restrictionMessage ?? 'デッキへの感想やアドバイスを書いてみましょう'}
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
              onClick={onSubmit}
              disabled={!canPost || posting || commentText.trim().length === 0}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {posting ? '投稿中...' : 'コメントを投稿'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
