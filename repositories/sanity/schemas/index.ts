/**
 * Sanity スキーマ一覧
 *
 * Sanity Studio の schemaTypes に渡すスキーマ定義をまとめてエクスポートする。
 */

export { cardSchema } from './card';
export { songSchema } from './song';
export { gradeChallengeSchema } from './gradeChallenge';
export { liveGrandPrixSchema } from './liveGrandPrix';
export { skillEffectKeywordSchema } from './skillEffectKeyword';
export { traitEffectKeywordSchema } from './traitEffectKeyword';
export { newsSchema } from './news';

import { cardSchema } from './card';
import { songSchema } from './song';
import { gradeChallengeSchema } from './gradeChallenge';
import { liveGrandPrixSchema } from './liveGrandPrix';
import { skillEffectKeywordSchema } from './skillEffectKeyword';
import { traitEffectKeywordSchema } from './traitEffectKeyword';
import { newsSchema } from './news';

/** Sanity Studio の schemaTypes 設定に直接渡すスキーマ配列 */
export const schemaTypes = [
  cardSchema,
  songSchema,
  gradeChallengeSchema,
  liveGrandPrixSchema,
  skillEffectKeywordSchema,
  traitEffectKeywordSchema,
  newsSchema,
];
