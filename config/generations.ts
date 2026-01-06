/**
 * 期別所属キャラクター
 */
export const GENERATION_MEMBERS = {
  101: ['大賀美沙知'],
  102: ['乙宗梢', '夕霧綴理', '藤島慈'],
  103: ['日野下花帆', '村野さやか', '大沢瑠璃乃'],
  104: ['徒町小鈴', '百生吟子', '安養寺姫芽'],
  105: ['桂城泉', 'セラス'],
} as const;

/**
 * 期の数値定数
 */
export const GENERATION = {
  TERM_101: 101,
  TERM_102: 102,
  TERM_103: 103,
  TERM_104: 104,
  TERM_105: 105,
} as const;

/**
 * ユニット別所属キャラクター
 */
export const UNIT_MEMBERS = {
  'Cerise Bouquet': ['乙宗梢', '日野下花帆', '百生吟子'],
  DOLLCHESTRA: ['夕霧綴理', '村野さやか', '徒町小鈴'],
  'Mira Cra Park': ['藤島慈', '大沢瑠璃乃', '安養寺姫芽'],
  'Edel Note': ['桂城泉', 'セラス'],
} as const;
