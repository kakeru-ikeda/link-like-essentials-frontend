'use client';

import React from 'react';
import { useDeck } from '@/hooks/deck/useDeck';
import { getDeckSlotMapping, getDeckFrame } from '@/services/deck/deckConfigService';
import { getCharacterBackgroundColor, getCharacterColor } from '@/utils/colorUtils';
import { VerticalBadge } from '@/components/shared/VerticalBadge';
import { AceBadge } from '@/components/shared/AceBadge';
import { LimitBreakBadge } from '@/components/deck-builder/LimitBreakBadge';
import type { DeckSlot } from '@/models/domain/Deck';
import type { CharacterName } from '@/config/characters';
import type { DeckSlotMapping } from '@/config/deckSlots';
import { FRIEND_SLOT_ID } from '@/config/deckSlots';

interface ExportDeckBuilderProps {
}

interface ExportCardSlotProps {
  slot: DeckSlot;
  isMain?: boolean;
  characterColor: string;
  isAce?: boolean;
  onLimitBreakChange?: (slotId: number, count: number) => void;
  onToggleAce?: (slotId: number) => void;
}

// 画像表示専用のカードスロットコンポーネント(メモ化)
const ExportCardSlot = React.memo<ExportCardSlotProps>((
  {
    slot, 
    isMain = false,
    characterColor,
    isAce = false,
    onLimitBreakChange,
    onToggleAce,
  }
) => {
  const limitBreakValue = slot.limitBreak ?? 14;
  const [isHovered, setIsHovered] = React.useState(false);

  const handleLimitIncrease = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!onLimitBreakChange) return;
    const next = Math.min(limitBreakValue + 1, 14);
    onLimitBreakChange(slot.slotId, next);
  };

  const handleLimitDecrease = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!onLimitBreakChange) return;
    const next = Math.max(limitBreakValue - 1, 1);
    onLimitBreakChange(slot.slotId, next);
  };

  if (!slot.card) {
    return (
      <div className={`relative w-full aspect-[17/11] border-4 border-gray-300 rounded-2xl bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-400 text-2xl font-semibold">{isMain ? slot.characterName : 'SIDE'}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-[17/11] border-4 rounded-2xl overflow-hidden`}
      style={{ borderColor: characterColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* エースバッジ（フレンドカードは除外） */}
      {slot.slotId !== FRIEND_SLOT_ID && (isAce || isHovered) && (
        <AceBadge
          isAce={isAce}
          disabled={false}
          size="xlarge"
          onToggle={() => onToggleAce?.(slot.slotId)}
        />
      )}

      {/* カード画像 */}
      {slot.card.detail?.awakeAfterStorageUrl ? (
        <img
          src={slot.card.detail.awakeAfterStorageUrl}
          alt={slot.card.cardName}
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-2xl">画像なし</span>
        </div>
      )}

      {/* 上限解放数表示 */}
      <LimitBreakBadge
        value={limitBreakValue}
        variant="export"
        isMain={isMain}
        showControls={isHovered}
        onIncrease={handleLimitIncrease}
        onDecrease={handleLimitDecrease}
        className="absolute top-2 left-2 z-30"
      />

      {/* カード名 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className={`text-white ${isMain ? 'text-3xl' : 'text-xl'} font-bold truncate`}>
          {slot.card.cardName}
        </p>
      </div>
    </div>
  );
});

ExportCardSlot.displayName = 'ExportCardSlot';

export const ExportDeckBuilder: React.FC<ExportDeckBuilderProps> = () => {
  const { deck, isFriendSlotEnabled, updateLimitBreakCount, toggleAceCard } = useDeck();
  const deckSlots = deck?.slots ?? [];

  // デッキタイプに応じたスロットマッピングとキャラクターフレームを取得
  const slotMapping = getDeckSlotMapping(deck?.deckType);
  const characterFrame = getDeckFrame(deck?.deckType);
  const slotMappingByCharacter = React.useMemo(() => {
    const mapping = new Map<CharacterName, DeckSlotMapping[]>();
    slotMapping.forEach((slot) => {
      const list = mapping.get(slot.characterName) ?? [];
      list.push(slot);
      mapping.set(slot.characterName, list);
    });
    mapping.forEach((list) => list.sort((a, b) => a.slotId - b.slotId));
    return mapping;
  }, [slotMapping]);
  
  // フレンド枠が無効な場合はフレームから除外
  // 画像生成時はフレンド枠を最後に移動
  let filteredCharacterFrame = isFriendSlotEnabled 
    ? characterFrame 
    : characterFrame.filter(char => char !== 'フレンド');
  
  // フレンド枠を配列の最後に移動
  if (isFriendSlotEnabled) {
    const friendIndex = filteredCharacterFrame.indexOf('フレンド');
    if (friendIndex !== -1) {
      filteredCharacterFrame = [
        ...filteredCharacterFrame.filter(char => char !== 'フレンド'),
        'フレンド'
      ];
    }
  }
  
  // キャラクターごとのスロットをフレーム順で消費しつつグループ化
  const characterSlots = React.useMemo(() => {
    const mappingCopies = new Map<CharacterName, DeckSlotMapping[]>(
      Array.from(slotMappingByCharacter.entries()).map(([key, value]) => [
        key,
        [...value],
      ])
    );

    return filteredCharacterFrame
      .map((character: CharacterName, idx) => {
        const mappings = mappingCopies.get(character);
        if (!mappings || mappings.length === 0) return null;

        const groupSize = character === 'フリー' ? Math.min(2, mappings.length) : Math.min(3, mappings.length);
        const groupMappings = mappings.splice(0, groupSize);
        if (groupMappings.length === 0) return null;

        const slots = groupMappings
          .map((mapping) => deckSlots.find((slot) => slot.slotId === mapping.slotId))
          .filter((slot): slot is DeckSlot => Boolean(slot));

        const key = `${character}-${groupMappings[0]?.slotId ?? idx}`;

        return { character, slots, key };
      })
      .filter((group): group is { character: CharacterName; slots: DeckSlot[]; key: string } => group !== null)
      .filter(({ slots }) => slots.length > 0);
  }, [deckSlots, filteredCharacterFrame, slotMappingByCharacter]);

  if (!deck) return null;

  return (
    <div className="w-full">
      {/* デッキグリッド */}
      <div className="grid grid-cols-3 gap-8">
        {characterSlots.map(({ character, slots, key }) => {
          const isCenter = deck.centerCharacter === character;
          const isSinger = deck.participations?.includes(character) || false;
          const backgroundColor = getCharacterBackgroundColor(character, 0.5);
          const characterColor = getCharacterColor(character);

          return (
            <div key={key} className="relative pl-6">
              {/* Left badge area */}
              {(isCenter || isSinger) && (
                <div className="absolute left-0 top-0 bottom-0 z-10 flex flex-col gap-3 pt-6">
                  {isCenter && <VerticalBadge text="センター" className="bg-gradient-to-b from-pink-400 to-pink-500" size="large" />}
                  {isSinger && !isCenter && <VerticalBadge text="歌唱" className="" size="large" />}
                </div>
              )}

              {/* Card slots area */}
              <div
                className="flex flex-col gap-6 p-4 rounded-3xl backdrop-blur-sm"
                style={{
                  backgroundColor,
                  boxShadow: '0 12px 18px -3px rgba(0,0,0,0.1), 0 6px 12px -3px rgba(0,0,0,0.06)',
                }}
              >
                {/* Character name header */}
                <div className="text-center flex-shrink-0 pt-4">
                  <h3 className="text-3xl font-bold text-gray-700">{character}</h3>
                </div>

                {/* Main slot */}
                {slots[0] && (
                  <ExportCardSlot 
                    slot={slots[0]} 
                    isMain={true} 
                    characterColor={characterColor}
                    isAce={deck.aceSlotId === slots[0].slotId}
                    onLimitBreakChange={updateLimitBreakCount}
                    onToggleAce={toggleAceCard}
                  />
                )}

                {/* Sub slots */}
                <div className="flex gap-4">
                  {slots[1] && (
                    <div className="flex-1 max-w-[55%]">
                      <ExportCardSlot 
                        slot={slots[1]} 
                        characterColor={characterColor}
                        isAce={deck.aceSlotId === slots[1].slotId}
                        onLimitBreakChange={updateLimitBreakCount}
                        onToggleAce={toggleAceCard}
                      />
                    </div>
                  )}
                  {slots[2] && (
                    <div className="flex-1">
                      <ExportCardSlot 
                        slot={slots[2]} 
                        characterColor={characterColor}
                        isAce={deck.aceSlotId === slots[2].slotId}
                        onLimitBreakChange={updateLimitBreakCount}
                        onToggleAce={toggleAceCard}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
