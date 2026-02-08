/**
 * セクション別の発動状況
 */
export interface TraitAnalysisSections {
  section1: boolean;
  section2: boolean;
  section3: boolean;
  section4: boolean;
  section5: boolean;
  sectionFever: boolean;
}

/**
 * ハート獲得特性分析データ
 */
export interface HeartCollectAnalysis {
  id: string;
  cardId?: number;
  accessoryId?: string;
  sections: TraitAnalysisSections;
  conditionDetail:
    | string
    | {
        reasoning?: string;
        originalText?: string;
        sectionConditions?: Array<{
          section: string;
          available: boolean;
          reason?: string;
        }>;
        additionalConditions?: string[];
      };
  analyzedAt: string;
}

/**
 * カードを引いてこない特性分析データ
 */
export interface UnDrawAnalysis {
  id: string;
  cardId?: number;
  accessoryId?: string;
  sections: TraitAnalysisSections;
  conditionDetail:
    | string
    | {
        reasoning?: string;
        originalText?: string;
        sectionConditions?: Array<{
          section: string;
          available: boolean;
          reason?: string;
        }>;
        additionalConditions?: string[];
      };
  analyzedAt: string;
}

/**
 * アクセサリーの特性分析データ
 */
export interface AccessoryTraitAnalysisData {
  accessoryId: string;
  heartCollectAnalysis?: HeartCollectAnalysis;
  unDrawAnalysis?: UnDrawAnalysis;
}

/**
 * カードの特性分析データ（デッキ用）
 */
export interface CardTraitAnalysisData {
  cardId: string;
  heartCollect?: HeartCollectAnalysis;
  unDraw?: UnDrawAnalysis;
}
