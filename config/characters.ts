/**
 * 全キャラクター一覧（12名）
 */
export const CHARACTERS = [
  '日野下花帆',
  '村野さやか',
  '乙宗梢',
  '夕霧綴理',
  '大沢瑠璃乃',
  '藤島慈',
  '徒町小鈴',
  '百生吟子',
  '安養寺姫芽',
  '桂城泉',
  'セラス',
  '大賀美沙知',
] as const;

/**
 * ユニット別所属キャラクター
 */
export const UNIT_MEMBERS = {
  'スリーズブーケ': ['乙宗梢', '日野下花帆', '百生吟子'],
  DOLLCHESTRA: ['夕霧綴理', '村野さやか', '徒町小鈴'],
  'みらくらぱーく！': ['藤島慈', '大沢瑠璃乃', '安養寺姫芽'],
  'Edel Note': ['桂城泉', 'セラス'],
} as const;

export type CharacterName = (typeof CHARACTERS)[number] | 'フリー' | 'フレンド';
