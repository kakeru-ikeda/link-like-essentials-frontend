import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import {
  GET_TRAIT_ANALYSIS_BATCH,
  GET_CARD_TRAIT_ANALYSIS,
} from '@/repositories/graphql/queries/traitAnalysis';
import {
  TraitAnalysisApiData,
  TraitAnalysisBatchQueryData,
  TraitAnalysisBatchVariables,
  CardTraitAnalysisQueryData,
  CardTraitAnalysisVariables,
} from '@/types/graphql/traitAnalysis';
import {
  CardTraitAnalysisData,
  HeartCollectAnalysis,
  UnDrawAnalysis,
} from '@/models/card/TraitAnalysis';
import { EntityIdPrefix } from '@/models/shared/enums';
import { ensureEntityIdPrefix, getEntityIdPrefix } from '@/utils/entityIdUtils';

const TRAIT_ANALYSIS_ENTITY_ID_TYPE = EntityIdPrefix.CARD;

const extractNumericCardId = (cardId: string): number | null => {
  const prefix = getEntityIdPrefix(TRAIT_ANALYSIS_ENTITY_ID_TYPE);
  const normalizedCardId = cardId.trim();
  const numericPart = normalizedCardId.startsWith(prefix)
    ? normalizedCardId.slice(prefix.length)
    : normalizedCardId;

  if (!/^\d+$/.test(numericPart)) {
    return null;
  }

  const numericCardId = Number.parseInt(numericPart, 10);
  return Number.isNaN(numericCardId) ? null : numericCardId;
};

const normalizeHeartCollectAnalysis = (
  heartCollect?: TraitAnalysisApiData['heartCollect']
): HeartCollectAnalysis | undefined => {
  if (!heartCollect) {
    return undefined;
  }

  return {
    ...heartCollect,
    cardId:
      heartCollect.cardId !== undefined
        ? ensureEntityIdPrefix(TRAIT_ANALYSIS_ENTITY_ID_TYPE, heartCollect.cardId)
        : undefined,
  };
};

const normalizeUnDrawAnalysis = (
  unDraw?: TraitAnalysisApiData['unDraw']
): UnDrawAnalysis | undefined => {
  if (!unDraw) {
    return undefined;
  }

  return {
    ...unDraw,
    cardId:
      unDraw.cardId !== undefined
        ? ensureEntityIdPrefix(TRAIT_ANALYSIS_ENTITY_ID_TYPE, unDraw.cardId)
        : undefined,
  };
};

const normalizeTraitAnalysis = (analysis: TraitAnalysisApiData): CardTraitAnalysisData => ({
  cardId: ensureEntityIdPrefix(TRAIT_ANALYSIS_ENTITY_ID_TYPE, analysis.cardId),
  heartCollect: normalizeHeartCollectAnalysis(analysis.heartCollect),
  unDraw: normalizeUnDrawAnalysis(analysis.unDraw),
});

/**
 * 複数カードの特性分析データをバッチ取得するフック
 * デッキ編成時など、複数カードの分析データが必要な場合に使用
 *
 * @param cardIds カードIDの配列
 * @returns 特性分析データのマップ（cardId -> データ）、ローディング状態、エラーメッセージ
 */
export const useTraitAnalysisBatch = (cardIds: string[]) => {
  const inputs = useMemo(
    () =>
      cardIds
        .map(extractNumericCardId)
        .filter((cardId): cardId is number => cardId !== null)
        .map(cardId => ({ cardId })),
    [cardIds]
  );

  const { data, loading, error } = useQuery<
    TraitAnalysisBatchQueryData,
    TraitAnalysisBatchVariables
  >(GET_TRAIT_ANALYSIS_BATCH, {
    variables: { inputs },
    skip: !cardIds || cardIds.length === 0 || inputs.length === 0,
  });

  // Map形式で返すことで、カードIDから素早くアクセス可能
  const analysisMap = useMemo(() => {
    if (!data?.traitAnalysisBatch) return new Map<string, CardTraitAnalysisData>();

    const map = new Map<string, CardTraitAnalysisData>();
    data.traitAnalysisBatch.forEach(item => {
      const normalizedItem = normalizeTraitAnalysis(item);
      map.set(normalizedItem.cardId, normalizedItem);
    });
    return map;
  }, [data]);

  return {
    analysisMap,
    loading,
    error: error?.message,
  };
};

/**
 * 単一カードの特性分析データを取得するフック
 * カード詳細ページなど、個別のカードの分析データが必要な場合に使用
 *
 * @param cardId カードID
 * @returns 特性分析データ、ローディング状態、エラーメッセージ
 */
export const useCardTraitAnalysis = (cardId: string) => {
  const numericCardId = useMemo(() => extractNumericCardId(cardId), [cardId]);
  const input = useMemo(
    () => (numericCardId !== null ? { cardId: numericCardId } : undefined),
    [numericCardId]
  );

  const { data, loading, error } = useQuery<CardTraitAnalysisQueryData, CardTraitAnalysisVariables>(
    GET_CARD_TRAIT_ANALYSIS,
    {
      variables: input ? { input } : undefined,
      skip: !cardId || input === undefined,
    }
  );

  const traitAnalysis = useMemo(
    () => (data?.cardTraitAnalysis ? normalizeTraitAnalysis(data.cardTraitAnalysis) : undefined),
    [data]
  );

  return {
    traitAnalysis,
    loading,
    error: error?.message,
  };
};
