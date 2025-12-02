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

export type CharacterName = (typeof CHARACTERS)[number] | (typeof DECK_FRAME_105)[number];

/**
 * 105期デッキフレーム用キャラクター配置（9名 + フリー）
 */
export const DECK_FRAME_105 = [
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

/**
 * キャラクターごとのテーマカラー定義
 */
export const CHARACTER_COLORS: Record<string, string> = {
  日野下花帆: '#f8b500',
  村野さやか: '#5383c3',
  乙宗梢: '#68be8d',
  夕霧綴理: '#ba2636',
  大沢瑠璃乃: '#e7609e',
  藤島慈: '#c8c2c6',
  徒町小鈴: '#fad764',
  百生吟子: '#a2d7dd',
  安養寺姫芽: '#9d8de2',
  桂城泉: '#1ebecd',
  セラス: '#f56455',
  大賀美沙知: '#aacc88',
} as const;

/**
 * キャラクター名からカラーコードを取得
 */
export function getCharacterColor(characterName: string): string {
  return CHARACTER_COLORS[characterName] || '#cccccc';
}

/**
 * キャラクター名から透明度付きの背景色を取得
 */
export function getCharacterBackgroundColor(
  characterName: string,
  opacity: number = 0.5
): string {
  const color = getCharacterColor(characterName);
  return hexToRgba(color, opacity);
}

/**
 * HEXカラーをRGBA形式に変換
 */
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
