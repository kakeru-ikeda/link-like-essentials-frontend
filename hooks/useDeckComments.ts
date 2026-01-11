"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Comment } from '@/models/Comment';
import { UserRole } from '@/models/enums';
import { publishedDeckService } from '@/services/publishedDeckService';
import { useAuth } from './useAuth';

export const MAX_COMMENT_LENGTH = 1000;

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
  refresh: () => Promise<void>;
  submit: () => Promise<void>;
}

/**
 * 公開デッキのコメント一覧と投稿を扱うフック
 */
export const useDeckComments = (deckId: string | null): UseDeckCommentsResult => {
  const { role, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const canPost = isAuthenticated && role === UserRole.EMAIL;

  const restrictionMessage = useMemo(() => {
    if (!isAuthenticated) return 'コメントを投稿するにはログインしてください。';
    if (!canPost) return 'コメント投稿にはメール認証が必要です。';
    return null;
  }, [canPost, isAuthenticated]);

  const fetchComments = useCallback(async () => {
    if (!deckId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await publishedDeckService.getComments(deckId);
      setComments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'コメントの取得に失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

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
      const newComment = await publishedDeckService.postComment(deckId, text);
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'コメントの投稿に失敗しました';
      setPostError(message);
    } finally {
      setPosting(false);
    }
  }, [canPost, commentText, deckId, restrictionMessage]);

  useEffect(() => {
    setComments([]);
    setCommentText('');
    setError(null);
    setPostError(null);
    if (deckId) {
      void fetchComments();
    }
  }, [deckId, fetchComments]);

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
    refresh: fetchComments,
    submit,
  };
};
