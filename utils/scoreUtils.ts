/** 1京 = 10000兆 */
const SCORE_KEI_UNIT = 10000;

/**
 * 京・兆の各パーツをスコア（兆単位）に変換する
 * 例: scoreFromParts(2, 6000) → 26000
 */
export const scoreFromParts = (kei: number, cho: number): number =>
  kei * SCORE_KEI_UNIT + cho;

/**
 * スコア（兆単位）を京・兆のパーツに分解する
 * 小数・負数を含む旧データに対しても安全に動作するよう、
 * 事前に非負整数へ正規化（Math.max(0, Math.trunc)）してから分解する。
 * 例: scoreToParts(26000) → { kei: 2, cho: 6000 }
 */
export const scoreToParts = (score: number): { kei: number; cho: number } => {
  const normalized = Math.max(0, Math.trunc(score));
  return {
    kei: Math.floor(normalized / SCORE_KEI_UNIT),
    cho: normalized % SCORE_KEI_UNIT,
  };
};

/**
 * スコア（兆単位）を表示用文字列にフォーマットする
 * 例:
 *   formatScore(26000) → "2京6000兆"
 *   formatScore(20000) → "2京"
 *   formatScore(1500)  → "1500兆"
 */
export const formatScore = (score: number): string => {
  const { kei, cho } = scoreToParts(score);
  if (kei === 0) return `${cho}兆`;
  if (cho === 0) return `${kei}京`;
  return `${kei}京${cho}兆`;
};
