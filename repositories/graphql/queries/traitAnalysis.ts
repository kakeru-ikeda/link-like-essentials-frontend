import { gql } from '@apollo/client';

/**
 * セクション情報のフラグメント
 */
const SECTION_ACTIVATION_FRAGMENT = gql`
  fragment SectionActivation on SectionActivation {
    section1
    section2
    section3
    section4
    section5
    sectionFever
  }
`;

/**
 * ハート獲得特性分析のフラグメント
 */
const HEART_COLLECT_ANALYSIS_FRAGMENT = gql`
  fragment HeartCollectAnalysisFields on HeartCollectAnalysis {
    id
    cardId
    accessoryId
    sections {
      ...SectionActivation
    }
    conditionDetail
    analyzedAt
  }
  ${SECTION_ACTIVATION_FRAGMENT}
`;

/**
 * カードを引いてこない特性分析のフラグメント
 */
const UN_DRAW_ANALYSIS_FRAGMENT = gql`
  fragment UnDrawAnalysisFields on UnDrawAnalysis {
    id
    cardId
    accessoryId
    sections {
      ...SectionActivation
    }
    conditionDetail
    analyzedAt
  }
  ${SECTION_ACTIVATION_FRAGMENT}
`;

/**
 * 複数カードの特性分析データをバッチ取得
 * デッキ編成時など、特定のカードの分析データが必要な場合に使用
 */
export const GET_TRAIT_ANALYSIS_BATCH = gql`
  query GetTraitAnalysisBatch($inputs: [TraitAnalysisInput!]!) {
    traitAnalysisBatch(inputs: $inputs) {
      cardId
      heartCollect {
        ...HeartCollectAnalysisFields
      }
      unDraw {
        ...UnDrawAnalysisFields
      }
    }
  }
  ${HEART_COLLECT_ANALYSIS_FRAGMENT}
  ${UN_DRAW_ANALYSIS_FRAGMENT}
`;

/**
 * 単一カードの特性分析データを取得
 */
export const GET_CARD_TRAIT_ANALYSIS = gql`
  query GetCardTraitAnalysis($input: TraitAnalysisInput!) {
    cardTraitAnalysis(input: $input) {
      cardId
      heartCollect {
        ...HeartCollectAnalysisFields
      }
      unDraw {
        ...UnDrawAnalysisFields
      }
    }
  }
  ${HEART_COLLECT_ANALYSIS_FRAGMENT}
  ${UN_DRAW_ANALYSIS_FRAGMENT}
`;
