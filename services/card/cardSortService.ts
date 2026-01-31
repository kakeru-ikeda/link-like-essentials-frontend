import { Card } from '@/models/card/Card';
import { CardSortBy, RARITY_ORDER, SortOrder } from '@/config/sortOptions';

/**
 * カード配列をソートする
 * @param cards ソート対象のカード配列
 * @param sortBy ソート項目（releaseDate | rarity | cardName）
 * @param order ソート順（asc | desc）
 * @returns ソート済みのカード配列
 */
export function sortCards(
  cards: Card[],
  sortBy: CardSortBy,
  order: SortOrder
): Card[] {
  const sorted = [...cards];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'releaseDate': {
        // 日時の比較
        const timeA = new Date(a.releaseDate).getTime();
        const timeB = new Date(b.releaseDate).getTime();

        // NaNチェック
        if (Number.isNaN(timeA) && Number.isNaN(timeB)) {
          comparison = 0;
        } else if (Number.isNaN(timeA)) {
          comparison = 1; // 不正な日時は後ろへ
        } else if (Number.isNaN(timeB)) {
          comparison = -1; // 不正な日時は後ろへ
        } else {
          comparison = timeA - timeB;
        }

        // 同じ日時の場合はIDで安定ソート
        if (comparison === 0) {
          comparison = a.id.localeCompare(b.id);
        }
        break;
      }

      case 'rarity': {
        // レアリティの比較（RARITY_ORDERの順序を使用）
        // 未定義のレアリティの場合は0として扱う（実行時安全性のため）
        const rarityA = RARITY_ORDER[a.rarity] ?? 0;
        const rarityB = RARITY_ORDER[b.rarity] ?? 0;
        comparison = rarityA - rarityB;
        // 同じレアリティの場合は日時でソート（orderパラメータを考慮）
        if (comparison === 0) {
          const timeA = new Date(a.releaseDate).getTime();
          const timeB = new Date(b.releaseDate).getTime();

          let timeComparison = 0;
          // NaNチェック
          if (Number.isNaN(timeA) && Number.isNaN(timeB)) {
            timeComparison = 0;
          } else if (Number.isNaN(timeA)) {
            timeComparison = 1; // 不正な日時は後ろへ
          } else if (Number.isNaN(timeB)) {
            timeComparison = -1; // 不正な日時は後ろへ
          } else {
            timeComparison = timeB - timeA;
          }
          // 主ソートと同じ順序を適用
          comparison = order === 'desc' ? -timeComparison : timeComparison;
        }

        break;
      }

      case 'cardName':
        // カード名の比較（日本語も正しくソート）
        comparison = a.cardName.localeCompare(b.cardName, 'ja');
        // 同じ名前の場合はIDで安定ソート
        if (comparison === 0) {
          comparison = a.id.localeCompare(b.id);
        }
        break;

      default:
        comparison = 0;
    }

    // 降順の場合は比較結果を反転
    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
}
