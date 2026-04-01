/**
 * Sanity スキーマ一覧
 *
 * Sanity Studio の schemaTypes に渡すスキーマ定義をまとめてエクスポートする。
 */

export { cardSchema } from './card';
export { songSchema } from './song';
export { gradeChallengeSchema } from './gradeChallenge';
export { liveGrandPrixSchema } from './liveGrandPrix';
export { skillEffectKeywordGroupSchema } from './skillEffectKeywordGroup';
export { traitEffectKeywordGroupSchema } from './traitEffectKeywordGroup';
export { newsSchema } from './news';
export { maintenanceSchema } from './maintenance';

import { cardSchema } from './card';
import { songSchema } from './song';
import { gradeChallengeSchema } from './gradeChallenge';
import { liveGrandPrixSchema } from './liveGrandPrix';
import { skillEffectKeywordGroupSchema } from './skillEffectKeywordGroup';
import { traitEffectKeywordGroupSchema } from './traitEffectKeywordGroup';
import { newsSchema } from './news';
import { maintenanceSchema } from './maintenance';

/** Sanity Studio の schemaTypes 設定に直接渡すスキーマ配列 */
export const schemaTypes = [
  cardSchema,
  songSchema,
  gradeChallengeSchema,
  liveGrandPrixSchema,
  skillEffectKeywordGroupSchema,
  traitEffectKeywordGroupSchema,
  newsSchema,
  maintenanceSchema,
];
