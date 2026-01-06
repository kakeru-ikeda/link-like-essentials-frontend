import { Card } from '@/models/Card';
import { CardFilter, FilterMode } from '@/models/Filter';
import { FavoriteMode, SkillEffectType, SkillSearchTarget } from '@/models/enums';
import { getSkillEffectKeyword, getSkillEffectKeywords } from '@/utils/skillEffectUtils';

/**
 * クライアントサイドでカードをフィルタリング
 * 
 * @param cards カード配列
 * @param filter カードフィルター
 * @returns フィルタリング後のカード配列
 */
export function filterCardsOnClient(cards: Card[], filter: CardFilter): Card[] {
  return cards.filter((card) => {
    // キーワード検索
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      
      // 検索対象フィールドを配列にまとめる
      const searchFields: (string | undefined)[] = [
        card.cardName,
        card.characterName,
        // スキル名・効果
        card.detail?.skill?.name,
        card.detail?.skill?.effect,
        card.detail?.specialAppeal?.name,
        card.detail?.specialAppeal?.effect,
        card.detail?.trait?.name,
        card.detail?.trait?.effect,
      ];
      
      // アクセサリーのスキル名・効果・特性名・特性効果も追加
      card.accessories?.forEach(acc => {
        searchFields.push(acc.name, acc.effect, acc.traitName, acc.traitEffect);
      });
      
      // いずれかのフィールドにキーワードが含まれているかチェック
      const hasMatch = searchFields.some(field => 
        field?.toLowerCase().includes(keyword)
      );
      
      if (!hasMatch) {
        return false;
      }
    }

    // レアリティ
    if (filter.rarities && filter.rarities.length > 0) {
      const mode = filter.filterMode ?? FilterMode.OR;
      if (mode === FilterMode.OR) {
        // OR検索: いずれかのレアリティに一致
        if (!filter.rarities.includes(card.rarity)) {
          return false;
        }
      } else {
        // AND検索: 単一項目なので存在チェックのみ（実質OR検索と同じ）
        if (!filter.rarities.includes(card.rarity)) {
          return false;
        }
      }
    }

    // キャラクター（部分一致）
    if (filter.characterNames && filter.characterNames.length > 0) {
      const mode = filter.filterMode ?? FilterMode.OR;
      if (mode === FilterMode.OR) {
        // OR検索: いずれかのキャラクター名が部分一致
        // 例：「桂城泉＆セラス」は「桂城泉」でも「セラス」でもマッチ
        const hasMatch = filter.characterNames.some(name => 
          card.characterName.includes(name)
        );
        if (!hasMatch) {
          return false;
        }
      } else {
        // AND検索: すべてのキャラクター名が部分一致
        // 例：「桂城泉」AND「セラス」を選択 → 「桂城泉＆セラス」がマッチ
        const allMatch = filter.characterNames.every(name => 
          card.characterName.includes(name)
        );
        if (!allMatch) {
          return false;
        }
      }
    }

    // スタイルタイプ
    if (filter.styleTypes && filter.styleTypes.length > 0) {
      const mode = filter.filterMode ?? FilterMode.OR;
      if (mode === FilterMode.OR) {
        // OR検索: いずれかのスタイルタイプに一致
        if (!filter.styleTypes.includes(card.styleType)) {
          return false;
        }
      } else {
        // AND検索: 単一カードは1スタイルタイプのみなので実質OR検索と同じ
        if (!filter.styleTypes.includes(card.styleType)) {
          return false;
        }
      }
    }

    // 得意ムード（Enum値で比較）
    if (filter.favoriteModes && filter.favoriteModes.length > 0) {
      if (!card.detail?.favoriteMode) {
        return false;
      }
      
      const mode = filter.filterMode ?? FilterMode.OR;
      if (mode === FilterMode.OR) {
        // OR検索: いずれかの得意ムードに一致
        if (!filter.favoriteModes.includes(card.detail.favoriteMode as FavoriteMode)) {
          return false;
        }
      } else {
        // AND検索: 単一カードは1得意ムードのみなので実質OR検索と同じ
        if (!filter.favoriteModes.includes(card.detail.favoriteMode as FavoriteMode)) {
          return false;
        }
      }
    }

    // 入手方法
    if (filter.limitedTypes && filter.limitedTypes.length > 0) {
      const mode = filter.filterMode ?? FilterMode.OR;
      if (mode === FilterMode.OR) {
        // OR検索: いずれかの入手方法に一致
        if (!filter.limitedTypes.includes(card.limited)) {
          return false;
        }
      } else {
        // AND検索: 単一カードは1入手方法のみなので実質OR検索と同じ
        if (!filter.limitedTypes.includes(card.limited)) {
          return false;
        }
      }
    }

    // スキル効果検索
    if (filter.skillEffects && filter.skillEffects.length > 0) {
      const targets = filter.skillSearchTargets ?? [
        SkillSearchTarget.SKILL,
        SkillSearchTarget.SPECIAL_APPEAL,
        SkillSearchTarget.TRAIT,
      ];

      const mode = filter.filterMode ?? FilterMode.OR;
      
      // 各スキル効果タイプが一致するかチェックする関数
      const checkSkillEffect = (effectType: SkillEffectType): boolean => {
        const keywords = getSkillEffectKeyword(effectType);
        
        // 1つのスキル効果タイプ内の複数キーワードは常にOR検索
        // （例：RESHUFFLE = ['シャッフル' OR '手札をすべて捨てて' OR '手札を全て捨てて']）
        return keywords.some((keyword) => {
          // 検索対象（スキル、スペシャルアピール、特性）はOR検索
          // 「スキル」「特性」を選択 → スキル OR 特性のいずれかにマッチすればOK
          return targets.some((target) => {
            const texts: (string | undefined)[] = [];
            
            switch (target) {
              case SkillSearchTarget.SKILL:
                // カード本体のスキルのみ
                texts.push(card.detail?.skill?.effect);
                break;
              case SkillSearchTarget.SPECIAL_APPEAL:
                // カード本体のスペシャルアピールのみ（アクセサリーにはない）
                texts.push(card.detail?.specialAppeal?.effect);
                break;
              case SkillSearchTarget.TRAIT:
                // カード本体の特性のみ
                texts.push(card.detail?.trait?.effect);
                break;
              case SkillSearchTarget.ACCESSORY_SKILL:
                // アクセサリーカードのスキルのみ
                card.accessories?.forEach(acc => texts.push(acc.effect));
                break;
              case SkillSearchTarget.ACCESSORY_TRAIT:
                // アクセサリーカードの特性のみ
                card.accessories?.forEach(acc => texts.push(acc.traitEffect));
                break;
            }
            
            // いずれかのテキストにキーワードが含まれているかチェック
            return texts.some(text => {
              if (!text) return false;

              // 正規表現パターンかどうかをチェック（\\ を含む場合は正規表現として扱う）
              if (keyword.includes('\\')) {
                try {
                  const regex = new RegExp(keyword);
                  return regex.test(text);
                } catch {
                  // 正規表現が不正な場合は通常の文字列検索にフォールバック
                  return text.includes(keyword);
                }
              }

              // 通常の文字列検索
              return text.includes(keyword);
            });
          });
        });
      };

      let hasEffect: boolean;
      if (mode === FilterMode.OR) {
        // OR検索: いずれかのスキル効果タイプに一致
        // 例：HEART_CAPTURE OR RESHUFFLE
        hasEffect = filter.skillEffects.some(checkSkillEffect);
      } else {
        // AND検索: すべてのスキル効果タイプに一致
        // 例：HEART_CAPTURE AND RESHUFFLE（両方の効果を持つカード）
        hasEffect = filter.skillEffects.every(checkSkillEffect);
      }

      if (!hasEffect) {
        return false;
      }
    }

    // トークンカードの有無
    if (filter.hasTokens !== undefined) {
      const hasTokens = card.accessories && card.accessories.length > 0;
      if (filter.hasTokens !== hasTokens) {
        return false;
      }
    }

    return true;
  });
}

/**
 * カードフィルターからGraphQLクエリ用のフィルターパラメータを生成
 * 
 * @deprecated クライアントサイドフィルタリングを使用するため、現在は使用していません
 * @param filter カードフィルター
 * @returns GraphQLクエリ用のフィルターオブジェクト
 */
export function buildGraphQLFilter(filter: CardFilter): Record<string, any> {
  const graphqlFilter: Record<string, any> = {};

  // キーワード検索
  if (filter.keyword) {
    graphqlFilter.keyword = filter.keyword;
  }

  // スキル効果検索
  // 選択されたスキル効果のキーワードをキーワード検索に追加
  if (filter.skillEffects && filter.skillEffects.length > 0) {
    const skillKeywords = getSkillEffectKeywords(filter.skillEffects);
    
    // 検索対象が指定されている場合は、対象ごとにキーワード検索を実行
    if (filter.skillSearchTargets && filter.skillSearchTargets.length > 0) {
      // TODO: 実装時に検索対象に応じたフィールド指定を行う
      // 例: specialAppeal.description, skill.description, trait.description
      graphqlFilter.skillEffectKeywords = skillKeywords;
      graphqlFilter.skillSearchTargets = filter.skillSearchTargets;
    } else {
      // 検索対象が未指定の場合は全ての対象を検索
      graphqlFilter.skillEffectKeywords = skillKeywords;
    }
  }

  // レアリティ
  if (filter.rarities && filter.rarities.length > 0) {
    graphqlFilter.rarities = filter.rarities;
  }

  // スタイルタイプ
  if (filter.styleTypes && filter.styleTypes.length > 0) {
    graphqlFilter.styleTypes = filter.styleTypes;
  }

  // 入手方法
  if (filter.limitedTypes && filter.limitedTypes.length > 0) {
    graphqlFilter.limitedTypes = filter.limitedTypes;
  }

  // 得意ムード
  if (filter.favoriteModes && filter.favoriteModes.length > 0) {
    graphqlFilter.favoriteModes = filter.favoriteModes;
  }

  // キャラクター
  if (filter.characterNames && filter.characterNames.length > 0) {
    graphqlFilter.characterNames = filter.characterNames;
  }

  return graphqlFilter;
}

/**
 * スキル効果フィルターの検索クエリを生成
 * 将来的な実装で使用
 * 
 * @param filter カードフィルター
 * @returns 検索クエリ文字列（キーワード検索用）
 */
export function buildSkillEffectSearchQuery(filter: CardFilter): string | undefined {
  if (!filter.skillEffects || filter.skillEffects.length === 0) {
    return undefined;
  }

  const keywords = getSkillEffectKeywords(filter.skillEffects);
  
  // 複数のスキル効果が選択されている場合はOR検索
  // 例: "スキルハートを獲得" OR "ハート上限を"
  return keywords.join(' OR ');
}

/**
 * 配列型フィルターの値をトグル（追加/削除）するユーティリティ関数
 * 
 * @param currentList 現在の配列（undefined も可）
 * @param value トグル対象の値
 * @returns 更新後の配列、または undefined（空の場合）
 */
function toggleArrayValue<T>(currentList: T[] | undefined, value: T): T[] | undefined {
  const list = currentList ?? []; // undefined の場合は空配列として扱う
  
  if (list.includes(value)) {
    // 値が含まれている → 削除
    const filtered = list.filter((item) => item !== value);
    return filtered.length > 0 ? filtered : undefined;
  } else {
    // 値が含まれていない → 追加
    return [...list, value];
  }
}

/**
 * 配列型フィルターの値をトグルする部分フィルターオブジェクトを生成
 * 
 * @param filter 現在のカードフィルター
 * @param key フィルターのキー（配列型のプロパティ）
 * @param value トグル対象の値
 * @returns 更新用の部分フィルターオブジェクト
 */
export function toggleFilterList<T extends keyof CardFilter>(
  filter: CardFilter,
  key: T,
  value: NonNullable<CardFilter[T]> extends Array<infer U> ? U : never
): Partial<CardFilter> {
  // 現在選択されている値の配列を取得
  const currentList = filter[key] as NonNullable<CardFilter[T]> extends Array<infer U> ? U[] | undefined : never;
  
  // トグル処理（追加 or 削除）
  const updatedList = toggleArrayValue(currentList, value);
  
  // { rarities: [...] } のような形式で返す
  return { [key]: updatedList } as Partial<CardFilter>;
}

/**
 * 配列型フィルターから特定の値を削除する部分フィルターオブジェクトを生成
 * 
 * @param filter 現在のカードフィルター
 * @param key フィルターのキー（配列型のプロパティ）
 * @param value 削除対象の値
 * @returns 更新用の部分フィルターオブジェクト
 */
export function removeFromFilterList<T extends keyof CardFilter>(
  filter: CardFilter,
  key: T,
  value: NonNullable<CardFilter[T]> extends Array<infer U> ? U : never
): Partial<CardFilter> {
  // 現在選択されている値の配列を取得
  const currentList = filter[key] as NonNullable<CardFilter[T]> extends Array<infer U> ? U[] | undefined : never;
  
  if (!currentList) {
    // 配列が存在しない場合は何もしない
    return {};
  }
  
  // 指定された値を除外
  const updatedList = currentList.filter((item) => item !== value);
  
  // 空配列になった場合は undefined を設定（フィルターをクリア）
  // { rarities: [...] } のような形式で返す
  return { [key]: updatedList.length > 0 ? updatedList : undefined } as Partial<CardFilter>;
}


