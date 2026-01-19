"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Comment } from '@/models/Comment';
import { UserRole } from '@/models/enums';
import { UserProfile } from '@/models/User';
import { PageInfo } from '@/models/Pagination';
import { publishedDeckService } from '@/services/publishedDeckService';
import { deckCommentService } from '@/services/deckCommentService';
import { ReportReason } from '@/models/Comment';
import { useAuth } from './useAuth';
import { useBatchUserProfiles } from './useBatchUserProfiles';
import { logDeckCommented } from '@/utils/analytics';

export const MAX_COMMENT_LENGTH = 1000;
export const COMMENTS_PER_PAGE = 20;

interface UseDeckCommentsResult {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  commentText: string;
  setCommentText: (text: string) => void;
  posting: boolean;
  postError: string | null;
  canPost: boolean;
  restrictionMessage: string | null;
  userProfiles: Map<string, UserProfile>;
  profilesLoading: boolean;
  pageInfo: PageInfo | null;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  submit: () => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  reportComment: (commentId: string, reason: ReportReason, details?: string) => Promise<void>;
  deleting: boolean;
  deleteError: string | null;
  reporting: boolean;
  reportError: string | null;
}

/**
 * 公開デッキのコメント一覧と投稿を扱うフック
 */
export const useDeckComments = (deckId: string | null): UseDeckCommentsResult => {
  const { role, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const canPost = isAuthenticated && role === UserRole.EMAIL;

  const restrictionMessage = useMemo(() => {
    if (!isAuthenticated) return 'コメントを投稿するにはログインしてください。';
    if (!canPost) return 'コメント投稿にはメール認証が必要です。';
    return null;
  }, [canPost, isAuthenticated]);

  const userIds = useMemo(() => {
    return comments.map((comment) => comment.userId);
  }, [comments]);

  const { profiles: userProfiles, loading: profilesLoading } = useBatchUserProfiles(userIds);

  const fetchComments = useCallback(async (page: number = 1, append: boolean = false) => {
    if (!deckId) return;
    
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await publishedDeckService.getComments(deckId, page, COMMENTS_PER_PAGE);
      setPageInfo(response.pageInfo);
      
      if (append) {
        setComments((prev) => [...prev, ...response.data]);
      } else {
        setComments(response.data);
      }
      setCurrentPage(page);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'コメントの取得に失敗しました';
      setError(message);
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [deckId]);

  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || loadingMore) return;
    await fetchComments(currentPage + 1, true);
  }, [currentPage, fetchComments, loadingMore, pageInfo?.hasNextPage]);

  const refresh = useCallback(async () => {
    await fetchComments(1, false);
  }, [fetchComments]);

  const submit = useCallback(async () => {
    if (!deckId) return;
    if (!canPost) {
      setPostError(restrictionMessage ?? 'コメント投稿にはメール認証が必要です。');
      return;
    }

    const text = commentText.trim();
    if (!text) {
      setPostError('コメントを入力してください');
      return;
    }

    setPosting(true);
    setPostError(null);

    try {
      await publishedDeckService.postComment(deckId, text);
      logDeckCommented(deckId);
      setCommentText('');
      await fetchComments(1, false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'コメントの投稿に失敗しました';
      setPostError(message);
    } finally {
      setPosting(false);
    }
  }, [canPost, commentText, deckId, fetchComments, restrictionMessage]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!deckId) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deckCommentService.deleteComment(deckId, commentId);
      await fetchComments(1, false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'コメントの削除に失敗しました';
      setDeleteError(message);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [deckId, fetchComments]);

  const reportComment = useCallback(async (commentId: string, reason: ReportReason, details?: string) => {
    if (!deckId) return;

    setReporting(true);
    setReportError(null);

    try {
      await deckCommentService.reportComment(deckId, commentId, reason, details);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'コメントの通報に失敗しました';
      setReportError(message);
      throw err;
    } finally {
      setReporting(false);
    }
  }, [deckId]);

  useEffect(() => {
    setComments([]);
    setCommentText('');
    setError(null);
    setPostError(null);
    if (deckId) {
      void fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId]);

  return {
    comments,
    loading,
    error,
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
    hasMore: pageInfo?.hasNextPage ?? false,
    loadMore,
    refresh,
    submit,
    deleteComment,
    reportComment,
    deleting,
    deleteError,
    reporting,
    reportError,
  };
};
