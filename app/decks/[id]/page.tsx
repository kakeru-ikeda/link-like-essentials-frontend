'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { PublishedDeckDetail } from '@/components/deck/PublishedDeckDetail';
import { useCompiledPublishedDeckDetail } from '@/hooks/published-deck/useCompiledPublishedDeckDetail';
import { publishedDeckImportService } from '@/services/published-deck/publishedDeckImportService';
import { publishedDeckService } from '@/services/published-deck/publishedDeckService';
import { PublishedDeckActions } from '@/components/deck/PublishedDeckActions';
import { DeckCommentSection } from '@/components/deck/DeckCommentSection';
import { ReportModal } from '@/components/common/ReportModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useDeckComments } from '@/hooks/deck/useDeckComments';
import { useAuth } from '@/hooks/auth/useAuth';
import { ReportReason } from '@/models/domain/Comment';
import { syncClientMetadata } from '@/utils/metadataUtils';

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

  const isOwnDeck = publishedDeck?.userProfile.uid === user?.uid;

  // 取得完了後にクライアント側メタデータを書き換え（サーバーでの認証フェッチは不可のため）
  useEffect(() => {
    if (!publishedDeck?.deck?.name) return;
    const description =
      publishedDeck.comment ?? '公開デッキの詳細を表示します。';
    const ogImage = publishedDeck.thumbnail ?? publishedDeck.imageUrls?.[0];
    // buildPageTitleはsyncClientMetadata内で付与するので生のタイトルを渡す
    syncClientMetadata({
      title: publishedDeck.deck.name,
      description,
      ogImagePath: ogImage,
    });
  }, [publishedDeck]);

  const handleImport = useCallback(async () => {
    if (!publishedDeck) return;
    setImporting(true);
    setImportError(null);
    try {
      await publishedDeckImportService.importToLocal(publishedDeck);
      router.push('/deck');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'インポートに失敗しました';
      setImportError(message);
    } finally {
      setImporting(false);
    }
  }, [publishedDeck, router]);

  const handleReportDeck = useCallback(
    async (reason: ReportReason, details?: string) => {
      if (!deckId) return;
      try {
        await publishedDeckService.reportDeck(deckId, reason, details);
      } catch (err) {
        console.error('デッキの通報に失敗しました', err);
        alert(
          err instanceof Error ? err.message : 'デッキの通報に失敗しました'
        );
      }
    },
    [deckId]
  );

  const handleDeleteDeck = useCallback(async () => {
    if (!deckId) return;
    try {
      await publishedDeckService.deleteDeck(deckId);
      router.push('/decks');
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error('デッキの削除に失敗しました', err);
      alert(err instanceof Error ? err.message : 'デッキの削除に失敗しました');
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
          <p className="text-sm text-gray-600">
            閲覧専用ビューとSNS操作を順次追加します。
          </p>
        </div>
        {publishedDeck && (
          <PublishedDeckActions
            deck={publishedDeck}
            compiledDeck={compiledDeck}
            onImport={handleImport}
            importing={importing}
            importError={importError}
            compiling={compiling}
            isOwnDeck={isOwnDeck}
            onReport={() => setDeckReportModalOpen(true)}
            onDelete={() => setDeleteConfirmOpen(true)}
          />
        )}
      </div>

      {!deckId && (
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
          <PublishedDeckDetail
            deck={publishedDeck}
            compiledDeck={compiledDeck}
          />
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
