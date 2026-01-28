import { useQuery } from '@apollo/client';
import {
  GET_GRADE_CHALLENGES,
  GET_GRADE_CHALLENGE_BY_ID,
  GET_GRADE_CHALLENGE_BY_TITLE,
  GET_GRADE_CHALLENGE_STATS,
  GET_ONGOING_GRADE_CHALLENGES,
} from '@/repositories/graphql/queries/gradeChallenge';
import { GradeChallenge, GradeChallengeStats } from '@/models/grade-challenge/GradeChallenge';

/**
 * グレードチャレンジフィルター
 */
export interface GradeChallengeFilter {
  termName?: string;
  title?: string;
  startDateFrom?: string;
  startDateTo?: string;
  hasSongWithDeckType?: string;
}

interface GradeChallengeQueryData {
  gradeChallenges: GradeChallenge[];
}

interface GradeChallengeByIdQueryData {
  gradeChallengeById: GradeChallenge;
}

interface GradeChallengeByTitleQueryData {
  gradeChallengeByTitle: GradeChallenge;
}

interface GradeChallengeStatsQueryData {
  gradeChallengeStats: GradeChallengeStats;
}

interface OngoingGradeChallengesQueryData {
  ongoingGradeChallenges: GradeChallenge[];
}

/**
 * グレードチャレンジ一覧を取得するフック
 * 
 * @param filter グレードチャレンジフィルター（省略時は全件取得）
 * @param skip クエリをスキップするかどうか
 * @returns グレードチャレンジ配列、ローディング状態、エラーメッセージ
 */
export const useGradeChallenges = (
  filter?: GradeChallengeFilter,
  skip?: boolean
): {
  gradeChallenges: GradeChallenge[];
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<
    GradeChallengeQueryData,
    { filter?: GradeChallengeFilter }
  >(GET_GRADE_CHALLENGES, {
    variables: filter ? { filter } : undefined,
    skip,
  });

  return {
    gradeChallenges: data?.gradeChallenges ?? [],
    loading,
    error: error?.message,
  };
};

/**
 * 単一グレードチャレンジをIDで取得するフック
 * 
 * @param id グレードチャレンジID
 * @param skip クエリをスキップするかどうか
 * @returns グレードチャレンジオブジェクト、ローディング状態、エラーメッセージ
 */
export const useGradeChallengeById = (
  id: string,
  skip?: boolean
): {
  gradeChallenge: GradeChallenge | null;
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<
    GradeChallengeByIdQueryData,
    { id: string }
  >(GET_GRADE_CHALLENGE_BY_ID, {
    variables: { id },
    skip,
  });

  return {
    gradeChallenge: data?.gradeChallengeById ?? null,
    loading,
    error: error?.message,
  };
};

/**
 * 単一グレードチャレンジをタイトルで取得するフック
 * 
 * @param title タイトル
 * @param skip クエリをスキップするかどうか
 * @returns グレードチャレンジオブジェクト、ローディング状態、エラーメッセージ
 */
export const useGradeChallengeByTitle = (
  title: string,
  skip?: boolean
): {
  gradeChallenge: GradeChallenge | null;
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<
    GradeChallengeByTitleQueryData,
    { title: string }
  >(GET_GRADE_CHALLENGE_BY_TITLE, {
    variables: { title },
    skip,
  });

  return {
    gradeChallenge: data?.gradeChallengeByTitle ?? null,
    loading,
    error: error?.message,
  };
};

/**
 * 開催中のグレードチャレンジを取得するフック
 * 
 * @param skip クエリをスキップするかどうか
 * @returns 開催中のグレードチャレンジ配列、ローディング状態、エラーメッセージ
 */
export const useOngoingGradeChallenges = (skip?: boolean): {
  gradeChallenges: GradeChallenge[];
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<OngoingGradeChallengesQueryData>(
    GET_ONGOING_GRADE_CHALLENGES,
    {
      skip,
    }
  );

  return {
    gradeChallenges: data?.ongoingGradeChallenges ?? [],
    loading,
    error: error?.message,
  };
};

/**
 * グレードチャレンジ統計を取得するフック
 * 
 * @param skip クエリをスキップするかどうか
 * @returns 統計オブジェクト、ローディング状態、エラーメッセージ
 */
export const useGradeChallengeStats = (skip?: boolean): {
  stats: GradeChallengeStats | null;
  loading: boolean;
  error: string | undefined;
} => {
  const { data, loading, error } = useQuery<GradeChallengeStatsQueryData>(
    GET_GRADE_CHALLENGE_STATS,
    {
      skip,
    }
  );

  return {
    stats: data?.gradeChallengeStats ?? null,
    loading,
    error: error?.message,
  };
};
