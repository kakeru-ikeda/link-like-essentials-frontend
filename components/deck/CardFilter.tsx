'use client';

import React, { useState } from 'react';
import { CardFilter, FilterMode } from '@/models/Filter';
import { Rarity, StyleType, LimitedType, FavoriteMode } from '@/models/enums';
import { CHARACTERS } from '@/constants/characters';
import { SideModal } from '@/components/common/SideModal';
import { Tooltip } from '@/components/common/Tooltip';
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

interface CardFilterProps {
  onApplyFilters: (filter: CardFilter) => void;
  currentFilter?: CardFilter;
  isFilterModalOpen: boolean;
  onCloseFilterModal: () => void;
  lockedCharacter?: string;
}

export const CardFilterComponent: React.FC<CardFilterProps> = ({
  onApplyFilters,
  currentFilter,
  isFilterModalOpen,
  onCloseFilterModal,
  lockedCharacter,
}) => {
  const [filter, setFilter] = useState<CardFilter>(currentFilter || {});

  // 親から渡されたフィルターで初期化
  React.useEffect(() => {
    if (currentFilter) setFilter(currentFilter);
  }, [currentFilter]);

  const handleFilterUpdate = (updates: Partial<CardFilter>): void => {
    const newFilter = { ...filter, ...updates };
    setFilter(newFilter);
  };

  const handleReset = (): void => {
    // ロックされたキャラクターは保持
    const newFilter: CardFilter = {};
    if (lockedCharacter) {
      newFilter.characterNames = [lockedCharacter];
    }
    setFilter(newFilter);
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
    // ロックされたキャラクターは解除できない
    if (lockedCharacter === character) return;
    
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
        width="lg"
      >
        <div className="p-4 space-y-6">
          {/* AND/OR検索モード切り替え */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索モード
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterUpdate({ filterMode: FilterMode.OR })}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                  (filter.filterMode ?? FilterMode.OR) === FilterMode.OR
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                AND検索
                <span className="block text-xs mt-1 opacity-90">すべてに一致</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {(filter.filterMode ?? FilterMode.OR) === FilterMode.OR
                ? '選択した条件のいずれかに一致するカードを表示します'
                : '選択したすべての条件に一致するカードのみを表示します（スキル効果で有効）'}
            </p>
          </div>

          {/* キーワード検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              キーワード検索
            </label>
            <input
              type="text"
              value={filter.keyword || ''}
              onChange={(e) =>
                handleFilterUpdate({
                  keyword: e.target.value || undefined,
                })
              }
              placeholder="カード名やキャラクター名で検索..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* レアリティ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {RARITY_LABELS[rarity]}
                </button>
              ))}
            </div>
          </div>

          {/* 得意ムード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {FAVORITE_MODE_LABELS[favoriteMode]}
                  </button>
                ))}
            </div>
          </div>

          {/* キャラクター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              キャラクター
              {lockedCharacter && (
                <span className="ml-2 text-xs text-gray-500">（{lockedCharacter}は固定）</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {CHARACTERS.map((character) => {
                const isLocked = lockedCharacter === character;
                const isSelected = filter.characterNames?.includes(character);
                return (
                  <button
                    key={character}
                    onClick={() => toggleCharacter(character)}
                    disabled={isLocked}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      isSelected
                        ? isLocked
                          ? 'bg-pink-600 text-white cursor-not-allowed opacity-90'
                          : 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${isLocked ? 'cursor-not-allowed' : ''}`}
                  >
                    {character}
                    {isLocked && ' 🔒'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* スキル効果 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              スキル効果
            </label>
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

          {/* スキル検索対象 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索対象
              <span className="ml-2 text-xs text-gray-500">（スキル効果の検索範囲）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(SkillSearchTarget).map((target) => (
                <button
                  key={target}
                  onClick={() => toggleSkillSearchTarget(target)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    filter.skillSearchTargets?.includes(target)
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {SKILL_SEARCH_TARGET_LABELS[target]}
                </button>
              ))}
            </div>
          </div>

          {/* スタイルタイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {STYLE_TYPE_LABELS[styleType]}
                </button>
              ))}
            </div>
          </div>

          {/* 入手方法 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {LIMITED_TYPE_LABELS[limitedType]}
                </button>
              ))}
            </div>
          </div>

          {/* リセットボタン */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium"
            >
              すべてリセット
            </button>
          </div>

          {/* 適用ボタン */}
          <div>
            <button
              onClick={handleApply}
              className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition font-medium"
            >
              フィルターを適用
            </button>
          </div>
        </div>
      </SideModal>
    </>
  );
};
