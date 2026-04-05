import {
  CardTraitAnalysisData,
  HeartCollectAnalysis,
  TraitAnalysisSections,
  UnDrawAnalysis,
} from '@/models/card/TraitAnalysis';

/**
 * GraphQLクエリのレスポンス型定義（特性分析データ）
 */

/**
 * バッチ取得のレスポンス型
 */
export interface TraitAnalysisBatchQueryData {
  traitAnalysisBatch: TraitAnalysisApiData[];
}

/**
 * 単一カード取得のレスポンス型
 */
export interface CardTraitAnalysisQueryData {
  cardTraitAnalysis: TraitAnalysisApiData;
}

export interface HeartCollectAnalysisApiData
  extends Omit<HeartCollectAnalysis, 'cardId' | 'sections'> {
  cardId?: number;
  sections: TraitAnalysisSections;
}

export interface UnDrawAnalysisApiData extends Omit<UnDrawAnalysis, 'cardId' | 'sections'> {
  cardId?: number;
  sections: TraitAnalysisSections;
}

export interface TraitAnalysisApiData
  extends Omit<CardTraitAnalysisData, 'cardId' | 'heartCollect' | 'unDraw'> {
  cardId: number;
  heartCollect?: HeartCollectAnalysisApiData;
  unDraw?: UnDrawAnalysisApiData;
}

/**
 * 特性分析入力型
 */
export interface TraitAnalysisInput {
  cardId: number;
}

/**
 * バッチ取得のクエリ変数型
 */
export interface TraitAnalysisBatchVariables {
  inputs: TraitAnalysisInput[];
}

/**
 * 単一カード取得のクエリ変数型
 */
export interface CardTraitAnalysisVariables {
  input: TraitAnalysisInput;
}
