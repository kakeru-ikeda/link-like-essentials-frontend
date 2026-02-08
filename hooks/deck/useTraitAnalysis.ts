import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import {
  GET_TRAIT_ANALYSIS_BATCH,
  GET_CARD_TRAIT_ANALYSIS,
} from '@/repositories/graphql/queries/traitAnalysis';
import {
  TraitAnalysisBatchQueryData,
  TraitAnalysisBatchVariables,
  CardTraitAnalysisQueryData,
  CardTraitAnalysisVariables,
} from '@/types/graphql/traitAnalysis';
import { CardTraitAnalysisData } from '@/models/card/TraitAnalysis';

/**
 * 複数カードの特性分析データをバッチ取得するフック
 * デッキ編成時など、複数カードの分析データが必要な場合に使用
 *
 * @param cardIds カードIDの配列
 * @returns 特性分析データのマップ（cardId -> データ）、ローディング状態、エラーメッセージ
 */
export const useTraitAnalysisBatch = (cardIds: string[]) => {
  // カードIDを数値配列に変換してinputs形式に
  const inputs = cardIds.map(id => ({ cardId: parseInt(id, 10) }));

  const { data, loading, error } = useQuery<
    TraitAnalysisBatchQueryData,
    TraitAnalysisBatchVariables
  >(GET_TRAIT_ANALYSIS_BATCH, {
    variables: { inputs },
    skip: !cardIds || cardIds.length === 0,
  });

  // Map形式で返すことで、カードIDから素早くアクセス可能
  const analysisMap = useMemo(() => {
    if (!data?.traitAnalysisBatch) return new Map<string, CardTraitAnalysisData>();

    const map = new Map<string, CardTraitAnalysisData>();
    data.traitAnalysisBatch.forEach((item) => {
      // cardIdを文字列に変換してキーとして使用
      map.set(String(item.cardId), item);
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
  const input = { cardId: parseInt(cardId, 10) };
  
  const { data, loading, error } = useQuery<
    CardTraitAnalysisQueryData,
    CardTraitAnalysisVariables
  >(GET_CARD_TRAIT_ANALYSIS, {
    variables: { input },
    skip: !cardId,
  });

  return {
    traitAnalysis: data?.cardTraitAnalysis,
    loading,
    error: error?.message,
  };
};
