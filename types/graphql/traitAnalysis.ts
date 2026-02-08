import { CardTraitAnalysisData } from '@/models/card/TraitAnalysis';

/**
 * GraphQLクエリのレスポンス型定義（特性分析データ）
 */

/**
 * バッチ取得のレスポンス型
 */
export interface TraitAnalysisBatchQueryData {
  traitAnalysisBatch: CardTraitAnalysisData[];
}

/**
 * 単一カード取得のレスポンス型
 */
export interface CardTraitAnalysisQueryData {
  cardTraitAnalysis: CardTraitAnalysisData;
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
