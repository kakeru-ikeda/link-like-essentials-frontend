import { TraitEffectType } from '@/models/shared/enums';

/**
 * 特性効果の説明
 */
export const TRAIT_EFFECT_DESCRIPTIONS: Record<TraitEffectType, string> = {
  [TraitEffectType.HEART_COLLECT]: 'ハート回収条件で発動する特性。',
  [TraitEffectType.ENCORE]: 'スキル使用後に山札へ戻る特性。',
  [TraitEffectType.SHOT]: 'スキルの使用回数に応じて発動する特性。',
  [TraitEffectType.DRAW]: 'ドロー時に発動する特性。',
  [TraitEffectType.AP_REDUCE]: 'スキルの消費APを減らす特性。',
  [TraitEffectType.AP_SUPPORT]: '他カードのAP消費を減らすサポート特性。',
  [TraitEffectType.INSTANCE]: '使用後にデッキから除外される特性。',
  [TraitEffectType.IMMORTAL]: '使用後にデッキから除外されない特性。',
  [TraitEffectType.INTERPRETATION]: 'ムード補正の効果量を引き上げる特性。',
  [TraitEffectType.OVER_SECTION]: 'セクション跨ぎで発動する特性。',
  [TraitEffectType.ALTERNATE_IGNITION]: '姫芽の《イグニッションモード》状態に応じて効果が変化する特性。',
  [TraitEffectType.CHAIN]: '特定スキル使用後のドロー確率を上げる特性。',
  [TraitEffectType.FAVORITE]: '特定セクションでのドロー確率を上げる特性。',
  [TraitEffectType.REINFORCE]: 'スキル効果量を増加させる特性。',
  [TraitEffectType.ACCUMULATE]: '条件を満たすたびに効果が変化する特性。',
  [TraitEffectType.UN_DRAW]: 'ドローされなくなる特性。',
};
