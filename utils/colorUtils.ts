import { CHARACTER_COLORS } from '@/styles/colors';

/**
 * HEXカラーをRGBA形式に変換
 */
export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

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
