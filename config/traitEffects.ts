import { TraitEffectType } from '@/models/enums';

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
  [TraitEffectType.SEARCH]: 'カードドロー確率を大幅に上げる特性。',
  [TraitEffectType.CHAIN]: '特定スキル使用後のドロー確率を上げる特性。',
  [TraitEffectType.FAVORITE]: '特定セクションでのドロー確率を上げる特性。',
  [TraitEffectType.REINFORCE]: 'スキル効果量を増加させる特性。',
  [TraitEffectType.ACCUMULATE]: '条件を満たすたびに効果が変化する特性。',
  [TraitEffectType.UN_DRAW]: 'ドローされなくなる特性。',
};

/**
 * 特性効果の検索キーワード
 */
export const TRAIT_EFFECT_KEYWORDS: Record<TraitEffectType, string[]> = {
  [TraitEffectType.HEART_COLLECT]: [
    'ハートコレクト',
    '手札にある状態でハートを\\d+個回収したとき',
    '手札にある状態でハートを\\d+個回収した時',
    '手札にある状態でハートを\\d+個回収する',
    '手札にある状態でハートを\\d+個獲得したとき',
  ],
  [TraitEffectType.ENCORE]: ['アンコール', 'スキル使用時、山札に戻る'],
  [TraitEffectType.SHOT]: [
    'ショット',
    'スキルを\\d+回使用する',
    'スキル使用時、\\d+回まで',
    'スキル使用時\\d+回まで',
  ],
  [TraitEffectType.DRAW]: [
    'ドローしたとき',
    'ドローした時',
    'ドローしたセクションの間',
    'までにドローした時',
    '以降にドローした時',
    '目でドローした時',
    'セクションでドローした時'
  ],
  [TraitEffectType.AP_REDUCE]: [
    'APレデュース',
    'このスキルの消費AP-\\d+',
    'このスキルの消費APを-\\d+'
  ],
  [TraitEffectType.AP_SUPPORT]: [
    'APサポート',
    'デッキ内の.+の消費AP-\\d+',
    'デッキ内の.+の消費APを-\\d+',
  ],
  [TraitEffectType.INSTANCE]: ['インスタンス', 'デッキから除外され'],
  [TraitEffectType.IMMORTAL]: ['インモータル', 'デッキから除外されない'],
  [TraitEffectType.INTERPRETATION]: ['インタープリテーション', 'ムードによる効果増加量を上昇させ'],
  [TraitEffectType.ACCUMULATE]: [
    'アキューミュレイト',
    '使用する度に',
  ],
  [TraitEffectType.OVER_SECTION]: ['オーバーセクション', '手札にある状態でセクションが変わる'],
  [TraitEffectType.ALTERNATE_IGNITION]: [
    'オルタネイト：イグニッション',
    'イグニッションモード',
  ],
  [TraitEffectType.SEARCH]: ['サーチ', 'カードをドローする確率大幅アップ'],
  [TraitEffectType.CHAIN]: [
    'チェイン',
    'スキル使用後、ドローされる確率が増加',
    'スキル使用後、ドローされる確率が大幅に増加',
    'スキルを使用した後、ドローされる確率が増加',
    'スキルを使用した後、ドローされる確率が大幅に増加',
    'スキルを使用した際、ドローされる確率が増加する',
    'スキルを使用した際、ドローされる確率が大幅に増加する'
  ],
  [TraitEffectType.FAVORITE]: [
    'フェイバリット',
    'セクション目でドローされる確率が大幅に増加',
    'セクション目でドローされる確率が増加',
    'セクションでドローされる確率が大幅に増加',
    'セクションでドローされる確率が増加',
    'ドローされる確率が大幅に増加する'
  ],
  [TraitEffectType.REINFORCE]: [
    'リインフォース',
    'スキル効果値が増加',
    'スキルの効果値が増加',
    'スキル効果量が増加',
    'スキルの効果量が増加',
    'スキル効果量を\\d+%増幅',
  ],
  [TraitEffectType.UN_DRAW]: [
    'ドローされない',
    'ドローされず'
  ],
};
