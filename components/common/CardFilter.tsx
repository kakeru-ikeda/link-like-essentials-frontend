'use client';

import React from 'react';
import type { CardFilter as CardFilterType } from '@/models/Filter';
import { Rarity, StyleType, LimitedType, FavoriteMode, SkillEffectType, SkillSearchTarget, TraitEffectType } from '@/models/enums';
import { SearchModeFilter } from '@/components/common/filters/SearchModeFilter';
import { KeywordSearchInput } from '@/components/common/KeywordSearchInput';
import { CharacterFilter } from '@/components/cards/filters/CharacterFilter';
import { RarityFilter } from '@/components/cards/filters/RarityFilter';
import { FavoriteModeFilter } from '@/components/cards/filters/FavoriteModeFilter';
import { SkillEffectFilter } from '@/components/cards/filters/SkillEffectFilter';
import { TraitEffectFilter } from '@/components/cards/filters/TraitEffectFilter';
import { StyleTypeFilter } from '@/components/cards/filters/StyleTypeFilter';
import { LimitedTypeFilter } from '@/components/cards/filters/LimitedTypeFilter';
import { TokenCardFilter } from '@/components/cards/filters/TokenCardFilter';
import { toggleFilterList } from '@/services/cardFilterService';
import { FilterWrapper } from '@/components/common/filters/FilterWrapper';
import type { DeckType } from '@/models/enums';

interface CardFilterProps {
  filter: CardFilterType;
  visibleFilters?: (keyof CardFilterType)[];
  updateFilter: (updates: Partial<CardFilterType>) => void;
  currentSlotId?: number | null;
  deckType?: DeckType;
  onApply: () => void;
}

export const CardFilter: React.FC<CardFilterProps> = ({
  filter,
  visibleFilters,
  updateFilter,
  currentSlotId,
  deckType,
  onApply,
}) => {
  const isVisible = (key: keyof CardFilterType): boolean => {
    if (!visibleFilters) {
      return true;
    }
    // skillSearchTargets は skillEffects とセットで表示
    if (key === 'skillSearchTargets') {
      return visibleFilters.includes('skillEffects');
    }
    return visibleFilters.includes(key);
  };

  const toggleRarity = (rarity: Rarity): void => {
    updateFilter(toggleFilterList(filter, 'rarities', rarity));
  };

  const toggleStyleType = (styleType: StyleType): void => {
    updateFilter(toggleFilterList(filter, 'styleTypes', styleType));
  };

  const toggleLimitedType = (limitedType: LimitedType): void => {
    updateFilter(toggleFilterList(filter, 'limitedTypes', limitedType));
  };

  const toggleFavoriteMode = (favoriteMode: FavoriteMode): void => {
    updateFilter(toggleFilterList(filter, 'favoriteModes', favoriteMode));
  };

  const toggleCharacterName = (characterName: string): void => {
    updateFilter(toggleFilterList(filter, 'characterNames', characterName));
  };

  const toggleSkillEffect = (skillEffect: SkillEffectType): void => {
    updateFilter(toggleFilterList(filter, 'skillEffects', skillEffect));
  };

  const toggleSkillSearchTarget = (target: SkillSearchTarget): void => {
    updateFilter(toggleFilterList(filter, 'skillSearchTargets', target));
  };

  const toggleTraitEffect = (traitEffect: TraitEffectType): void => {
    updateFilter(toggleFilterList(filter, 'traitEffects', traitEffect));
  };

  return (
    <div className="p-4 space-y-2">
      {/* AND/OR検索モード切り替え */}
      {isVisible('filterMode') && (
        <FilterWrapper>
          <SearchModeFilter
            mode={filter.filterMode}
            onChange={(mode) => updateFilter({ filterMode: mode })}
          />
        </FilterWrapper>
      )}

      {/* キーワード検索 */}
      {isVisible('keyword') && (
        <FilterWrapper>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              キーワード検索
            </label>
            <KeywordSearchInput
              value={filter.keyword || ''}
              onChange={(value) =>
                updateFilter({
                  keyword: value || undefined,
                })
              }
              onEnter={onApply}
              placeholder="カード名やキャラクター名で検索..."
            />
          </div>
        </FilterWrapper>
      )}

      {/* キャラクター */}
      {isVisible('characterNames') && (
        <FilterWrapper>
          <CharacterFilter
            selectedCharacters={filter.characterNames}
            onToggle={toggleCharacterName}
            currentSlotId={currentSlotId}
            deckType={deckType}
          />
        </FilterWrapper>
      )}

      {/* レアリティ */}
      {isVisible('rarities') && (
        <FilterWrapper>
          <RarityFilter
            selectedRarities={filter.rarities}
            onToggle={toggleRarity}
          />
        </FilterWrapper>
      )}

      {/* スキル効果 */}
      {isVisible('skillEffects') && (
        <FilterWrapper>
          <SkillEffectFilter
            selectedEffects={filter.skillEffects}
            selectedTargets={filter.skillSearchTargets}
            onToggleEffect={toggleSkillEffect}
            onToggleTarget={toggleSkillSearchTarget}
          />
        </FilterWrapper>
      )}

      {/* 特性効果 */}
      {isVisible('traitEffects') && (
        <FilterWrapper>
          <TraitEffectFilter
            selectedEffects={filter.traitEffects}
            onToggleEffect={toggleTraitEffect}
          />
        </FilterWrapper>
      )}

      {/* トークンカードの有無 */}
      {isVisible('hasTokens') && (
        <FilterWrapper>
          <TokenCardFilter
            hasTokens={filter.hasTokens}
            onChange={(value) => updateFilter({ hasTokens: value })}
          />
        </FilterWrapper>
      )}

      {/* 得意ムード */}
      {isVisible('favoriteModes') && (
        <FilterWrapper>
          <FavoriteModeFilter
            selectedFavoriteModes={filter.favoriteModes}
            onToggle={toggleFavoriteMode}
          />
        </FilterWrapper>
      )}

      {/* スタイルタイプ */}
      {isVisible('styleTypes') && (
        <FilterWrapper>
          <StyleTypeFilter
            selectedStyleTypes={filter.styleTypes}
            onToggle={toggleStyleType}
          />
        </FilterWrapper>
      )}

      {/* 入手方法 */}
      {isVisible('limitedTypes') && (
        <FilterWrapper>
          <LimitedTypeFilter
            selectedLimitedTypes={filter.limitedTypes}
            onToggle={toggleLimitedType}
          />
        </FilterWrapper>
      )}
    </div>
  );
};
