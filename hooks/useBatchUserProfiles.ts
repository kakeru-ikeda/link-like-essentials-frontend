"use client";

import { useEffect, useMemo, useState } from 'react';
import { UserProfile } from '@/models/User';
import { userRepository } from '@/repositories/api/userRepository';

interface UseBatchUserProfilesResult {
  profiles: Map<string, UserProfile>;
  loading: boolean;
  error: string | null;
}

/**
 * 複数ユーザーのプロフィールをバッチ取得するフック
 * - コメント一覧やデッキ一覧などでアバター表示に使用
 * - 重複したuserIdは自動で除外
 * - N+1問題を回避
 */
export const useBatchUserProfiles = (userIds: string[]): UseBatchUserProfilesResult => {
  const [profiles, setProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uniqueUserIdsKey = useMemo(() => {
    return Array.from(new Set(userIds)).filter((id) => id.length > 0).sort().join(',');
  }, [userIds]);

  useEffect(() => {
    const uniqueUserIds = uniqueUserIdsKey.split(',').filter((id) => id.length > 0);

    if (uniqueUserIds.length === 0) {
      setProfiles(new Map());
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await userRepository.getUsersByIds(uniqueUserIds);
        if (!cancelled) {
          const map = new Map(users.map((user) => [user.uid, user]));
          setProfiles(map);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'ユーザー情報の取得に失敗しました';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProfiles();

    return () => {
      cancelled = true;
    };
  }, [uniqueUserIdsKey]);

  return { profiles, loading, error };
};
