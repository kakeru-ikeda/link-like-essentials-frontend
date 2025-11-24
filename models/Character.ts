export const CHARACTERS = [
  'セラス',
  '桂城泉',
  'フリー',
  '百生吟子',
  '徒町小鈴',
  '安養寺姫芽',
  '日野下花帆',
  '村野さやか',
  '大沢瑠璃乃',
] as const;

export type CharacterName = (typeof CHARACTERS)[number];
