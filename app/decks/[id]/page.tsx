"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { PublishedDeckDetail } from '@/components/deck/PublishedDeckDetail';
import { useCompiledPublishedDeckDetail } from '@/hooks/useCompiledPublishedDeckDetail';
import { publishedDeckImportService } from '@/services/publishedDeckImportService';
import { publishedDeckService } from '@/services/publishedDeckService';
import { PublishedDeckActions } from '@/components/deck/PublishedDeckActions';
import { DeckCommentSection } from '@/components/deck/DeckCommentSection';
import { ReportModal } from '@/components/common/ReportModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useDeckComments } from '@/hooks/useDeckComments';
import { useAuth } from '@/hooks/useAuth';
import { ReportReason } from '@/models/Comment';

const getDeckId = (param: string | string[] | undefined): string | null => {
  if (!param) return null;
  return Array.isArray(param) ? param[0] : param;
};

export default function DeckDetailPage() {
  const params = useParams();
  const deckId = getDeckId(params?.id);
  const { user } = useAuth();

  const {
    publishedDeck,
    publishedDeckLoading,
    publishedDeckError,
    compiledDeck,
    compiling,
    compileError,
  } = useCompiledPublishedDeckDetail(deckId);
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    commentText,
    setCommentText,
    posting,
    postError,
    canPost,
    restrictionMessage,
    userProfiles,
    profilesLoading,
    pageInfo,
    loadingMore,
    hasMore,
    loadMore,
    refresh: refreshComments,
    submit: submitComment,
    deleteComment,
    reportComment,
  } = useDeckComments(deckId);
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [deckReportModalOpen, setDeckReportModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwnDeck = publishedDeck?.userId === user?.uid;

  const handleImport = useCallback(async () => {
    if (!publishedDeck) return;
    setImporting(true);
    setImportError(null);
    try {
      await publishedDeckImportService.importToLocal(publishedDeck);
      router.push('/deck');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'インポートに失敗しました';
      setImportError(message);
    } finally {
      setImporting(false);
    }
  }, [publishedDeck, router]);

  const handleReportDeck = useCallback(async (reason: ReportReason, details?: string) => {
    if (!deckId) return;
    try {
      await publishedDeckService.reportDeck(deckId, reason, details);
    } catch (err) {
      console.error('デッキの通報に失敗しました', err);
      alert(err instanceof Error ? err.message : 'デッキの通報に失敗しました');
    }
  }, [deckId]);

  const handleDeleteDeck = useCallback(async () => {
    if (!deckId) return;
    setDeleting(true);
    try {
      await publishedDeckService.deleteDeck(deckId);
      router.push('/decks');
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error('デッキの削除に失敗しました', err);
      alert(err instanceof Error ? err.message : 'デッキの削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  }, [deckId, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ReportModal
        isOpen={deckReportModalOpen}
        onClose={() => setDeckReportModalOpen(false)}
        onSubmit={handleReportDeck}
        title="デッキを通報"
        targetName={publishedDeck?.deck.name || 'このデッキ'}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="デッキを削除しますか?"
        description="削除したデッキは復元できません。本当に削除してもよろしいですか?"
        confirmLabel="削除する"
        cancelLabel="キャンセル"
        onConfirm={handleDeleteDeck}
        onCancel={() => setDeleteConfirmOpen(false)}
        confirmVariant="danger"
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">公開デッキ詳細</h1>
          <p className="text-sm text-gray-600">閲覧専用ビューとSNS操作を順次追加します。</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          {publishedDeck && (
            <PublishedDeckActions
              deck={publishedDeck}
              compiledDeck={compiledDeck}
              onImport={handleImport}
              importing={importing}
              importError={importError}
              compiling={compiling}
            />
          )}
          {publishedDeck && user && (
            isOwnDeck ? (
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-400 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-base">🗑️</span>
                <span>{deleting ? '削除中...' : '削除'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDeckReportModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-1"
              >
                <span className="text-base">⚠️</span>
                <span>通報</span>
              </button>
            )
          )}
        </div>
      </div>

      {!deckId && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          デッキIDが不正です。
        </div>
      )}

      {(publishedDeckError || compileError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {publishedDeckError || compileError}
        </div>
      )}

      {(publishedDeckLoading || compiling) && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          取得中...
        </div>
      )}

      {!publishedDeckLoading && publishedDeck && (
        <div>
          <PublishedDeckDetail deck={publishedDeck} compiledDeck={compiledDeck} />
          <DeckCommentSection
            comments={comments}
            loading={commentsLoading}
            error={commentsError}
            commentText={commentText}
            onChangeComment={setCommentText}
            onSubmit={submitComment}
            onRefresh={refreshComments}
            posting={posting}
            postError={postError}
            canPost={canPost}
            restrictionMessage={restrictionMessage}
            userProfiles={userProfiles}
            profilesLoading={profilesLoading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            totalCount={pageInfo?.totalCount ?? 0}
            currentUserId={user?.uid}
            onDeleteComment={deleteComment}
            onReportComment={reportComment}
          />
        </div>
      )}
    </div>
  );
}
