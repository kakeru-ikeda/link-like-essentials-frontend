'use client';

import React, { useState } from 'react';
import { CardFilter, FilterMode } from '@/models/Filter';
import { Rarity, StyleType, LimitedType, FavoriteMode } from '@/models/enums';
import { CHARACTERS } from '@/constants/characters';
import { SideModal } from '@/components/common/SideModal';
import { Tooltip } from '@/components/common/Tooltip';
import { KeywordSearchInput } from '@/components/common/KeywordSearchInput';
import { getSelectableCharactersForSlot } from '@/services/characterFilterService';
import {
  RARITY_LABELS,
  STYLE_TYPE_LABELS,
  LIMITED_TYPE_LABELS,
  FAVORITE_MODE_LABELS,
} from '@/constants/labels';
import {
  SkillEffectType,
  SkillSearchTarget,
  SKILL_EFFECT_LABELS,
  SKILL_SEARCH_TARGET_LABELS,
  SKILL_EFFECT_DESCRIPTIONS,
} from '@/constants/skillEffects';

interface CardFilterComponentProps {
  onApplyFilters: (filter: CardFilter) => void;
  currentFilter: CardFilter;
  isFilterModalOpen: boolean;
  onCloseFilterModal: () => void;
  currentSlotId?: number | null;
}

export const CardFilterComponent: React.FC<CardFilterComponentProps> = ({
  onApplyFilters,
  currentFilter,
  isFilterModalOpen,
  onCloseFilterModal,
  currentSlotId,
}) => {
  const [filter, setFilter] = useState<CardFilter>(currentFilter || {});

  // 現在のスロットに配置可能なキャラクターのみを取得
  const selectableCharacters = React.useMemo(
    () => getSelectableCharactersForSlot(currentSlotId ?? null),
    [currentSlotId]
  );

  // 親から渡されたフィルターで初期化
  React.useEffect(() => {
    if (currentFilter) setFilter(currentFilter);
  }, [currentFilter]);

  const handleFilterUpdate = (updates: Partial<CardFilter>): void => {
    const newFilter = { ...filter, ...updates };
    setFilter(newFilter);
  };

  const handleReset = (): void => {
    setFilter({});
  };

  const handleApply = (): void => {
    onApplyFilters(filter);
    onCloseFilterModal();
  };

  const handleCloseModal = (): void => {
    // モーダルを閉じる時にフィルターを適用
    onApplyFilters(filter);
    onCloseFilterModal();
  };

  const toggleRarity = (rarity: Rarity): void => {
    const rarities = filter.rarities || [];
    const newRarities = rarities.includes(rarity)
      ? rarities.filter((r) => r !== rarity)
      : [...rarities, rarity];
    handleFilterUpdate({
      rarities: newRarities.length > 0 ? newRarities : undefined,
    });
  };

  const toggleStyleType = (styleType: StyleType): void => {
    const styleTypes = filter.styleTypes || [];
    const newStyleTypes = styleTypes.includes(styleType)
      ? styleTypes.filter((s) => s !== styleType)
      : [...styleTypes, styleType];
    handleFilterUpdate({
      styleTypes: newStyleTypes.length > 0 ? newStyleTypes : undefined,
    });
  };

  const toggleLimitedType = (limitedType: LimitedType): void => {
    const limitedTypes = filter.limitedTypes || [];
    const newLimitedTypes = limitedTypes.includes(limitedType)
      ? limitedTypes.filter((l) => l !== limitedType)
      : [...limitedTypes, limitedType];
    handleFilterUpdate({
      limitedTypes: newLimitedTypes.length > 0 ? newLimitedTypes : undefined,
    });
  };

  const toggleFavoriteMode = (favoriteMode: FavoriteMode): void => {
    const favoriteModes = filter.favoriteModes || [];
    const newFavoriteModes = favoriteModes.includes(favoriteMode)
      ? favoriteModes.filter((f) => f !== favoriteMode)
      : [...favoriteModes, favoriteMode];
    handleFilterUpdate({
      favoriteModes: newFavoriteModes.length > 0 ? newFavoriteModes : undefined,
    });
  };

  const toggleCharacter = (character: string): void => {
    const characterNames = filter.characterNames || [];
    const newCharacterNames = characterNames.includes(character)
      ? characterNames.filter((c) => c !== character)
      : [...characterNames, character];
    handleFilterUpdate({
      characterNames:
        newCharacterNames.length > 0 ? newCharacterNames : undefined,
    });
  };

  const toggleSkillEffect = (skillEffect: SkillEffectType): void => {
    const skillEffects = filter.skillEffects || [];
    const newSkillEffects = skillEffects.includes(skillEffect)
      ? skillEffects.filter((s) => s !== skillEffect)
      : [...skillEffects, skillEffect];
    handleFilterUpdate({
      skillEffects: newSkillEffects.length > 0 ? newSkillEffects : undefined,
    });
  };

  const toggleSkillSearchTarget = (target: SkillSearchTarget): void => {
    const skillSearchTargets = filter.skillSearchTargets || [];
    const newSkillSearchTargets = skillSearchTargets.includes(target)
      ? skillSearchTargets.filter((t) => t !== target)
      : [...skillSearchTargets, target];
    handleFilterUpdate({
      skillSearchTargets:
        newSkillSearchTargets.length > 0 ? newSkillSearchTargets : undefined,
    });
  };

  return (
    <>
      {/* フィルターモーダル */}
      <SideModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseModal}
        title="絞り込み"
        width="sm"
        hideCloseButton={true}
        zIndex={60}
        headerActions={
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium"
            >
              リセット
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition font-medium"
            >
              フィルターを適用
            </button>
          </div>
        }
      >
        <div className="p-4 space-y-2">
          {/* AND/OR検索モード切り替え */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              検索モード
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterUpdate({ filterMode: FilterMode.OR })}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                  (filter.filterMode ?? FilterMode.OR) === FilterMode.OR
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                OR検索
                <span className="block text-xs mt-1 opacity-90">いずれかに一致</span>
              </button>
              <button
                onClick={() => handleFilterUpdate({ filterMode: FilterMode.AND })}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter.filterMode === FilterMode.AND
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                AND検索
                <span className="block text-xs mt-1 opacity-90">すべてに一致</span>
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {(filter.filterMode ?? FilterMode.OR) === FilterMode.OR
                ? '選択した条件のいずれかに一致するカードを表示します'
                : '選択したすべての条件に一致するカードのみを表示します（スキル効果で有効）'}
            </p>
          </div>

          {/* キーワード検索 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              キーワード検索
            </label>
            <KeywordSearchInput
              value={filter.keyword || ''}
              onChange={(value) =>
                handleFilterUpdate({
                  keyword: value || undefined,
                })
              }
              onEnter={handleApply}
              placeholder="カード名やキャラクター名で検索..."
            />
          </div>

          {/* レアリティ */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              レアリティ
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(Rarity).map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => toggleRarity(rarity)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    filter.rarities?.includes(rarity)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {RARITY_LABELS[rarity]}
                </button>
              ))}
            </div>
          </div>

          {/* 得意ムード */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              得意ムード
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(FavoriteMode)
                .filter((mode) => mode !== FavoriteMode.NONE)
                .map((favoriteMode) => (
                  <button
                    key={favoriteMode}
                    onClick={() => toggleFavoriteMode(favoriteMode)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      filter.favoriteModes?.includes(favoriteMode)
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {FAVORITE_MODE_LABELS[favoriteMode]}
                  </button>
                ))}
            </div>
          </div>

          {/* キャラクター */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              キャラクター
            </label>
            <div className="flex flex-wrap gap-2">
              {selectableCharacters.map((character) => {
                const isSelected = filter.characterNames?.includes(character);
                return (
                  <button
                    key={character}
                    onClick={() => toggleCharacter(character)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      isSelected
                        ? 'bg-pink-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {character}
                  </button>
                );
              })}
            </div>
          </div>

          {/* スキル効果 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              スキル効果
            </label>
            
            {/* スキル効果の選択 */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {Object.values(SkillEffectType).map((skillEffect) => (
                  <Tooltip
                    key={skillEffect}
                    content={SKILL_EFFECT_DESCRIPTIONS[skillEffect]}
                    position="left"
                  >
                    <button
                      onClick={() => toggleSkillEffect(skillEffect)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        filter.skillEffects?.includes(skillEffect)
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {SKILL_EFFECT_LABELS[skillEffect]}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* 検索範囲の選択 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                検索範囲
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(SkillSearchTarget).map((target) => (
                  <button
                    key={target}
                    onClick={() => toggleSkillSearchTarget(target)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      filter.skillSearchTargets?.includes(target)
                        ? 'bg-teal-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {SKILL_SEARCH_TARGET_LABELS[target]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* スタイルタイプ */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              スタイルタイプ
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(StyleType).map((styleType) => (
                <button
                  key={styleType}
                  onClick={() => toggleStyleType(styleType)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    filter.styleTypes?.includes(styleType)
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {STYLE_TYPE_LABELS[styleType]}
                </button>
              ))}
            </div>
          </div>

          {/* 入手方法 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              入手方法
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(LimitedType).map((limitedType) => (
                <button
                  key={limitedType}
                  onClick={() => toggleLimitedType(limitedType)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    filter.limitedTypes?.includes(limitedType)
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {LIMITED_TYPE_LABELS[limitedType]}
                </button>
              ))}
            </div>
          </div>

          {/* トークンカードの有無 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              トークンカード
            </label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleFilterUpdate({
                    hasAccessories:
                      filter.hasAccessories === true ? undefined : true,
                  })
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filter.hasAccessories === true
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                あり
              </button>
              <button
                onClick={() =>
                  handleFilterUpdate({
                    hasAccessories:
                      filter.hasAccessories === false ? undefined : false,
                  })
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filter.hasAccessories === false
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                なし
              </button>
            </div>
          </div>
        </div>
      </SideModal>
    </>
  );
};
