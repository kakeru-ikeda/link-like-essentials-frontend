'use client';

import React from 'react';
import { useDeck } from '@/hooks/useDeck';
import { getDeckSlotMapping, getDeckFrame } from '@/constants/deckConfig';
import { getCharacterBackgroundColor, getCharacterColor } from '@/constants/characters';
import { VerticalBadge } from '@/components/common/VerticalBadge';
import { AceBadge } from '@/components/common/AceBadge';
import type { DeckSlot } from '@/models/Deck';

interface ExportCardSlotProps {
  slot: DeckSlot;
  isMain?: boolean;
  characterColor: string;
  isAce?: boolean;
}

// 画像表示専用のカードスロットコンポーネント(メモ化)
const ExportCardSlot = React.memo<ExportCardSlotProps>(({
  slot, 
  isMain = false,
  characterColor,
  isAce = false
}) => {
  if (!slot.card) {
    return (
      <div className={`relative w-full aspect-[17/11] border-4 border-gray-300 rounded-2xl bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-400 text-2xl font-semibold">{isMain ? slot.characterName : 'SIDE'}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-[17/11] border-4 rounded-2xl overflow-hidden`} style={{ borderColor: characterColor }}>
      {/* エースバッジ（フレンドカードは除外） */}
      {slot.slotId !== 99 && isAce && (
        <AceBadge
          isAce={true}
          disabled={false}
          size="xlarge"
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
      <div className="absolute top-2 left-2 z-30 bg-black/50 text-white font-black rounded-xl px-5 py-3 text-8xl tabular-nums shadow-2xl">
        {(slot.limitBreak ?? 14).toString().padStart(2, '0')}
      </div>

      {/* カード名 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className={`text-white ${isMain ? 'text-xl' : 'text-base'} font-bold truncate`}>
          {slot.card.cardName}
        </p>
      </div>
    </div>
  );
});

ExportCardSlot.displayName = 'ExportCardSlot';

export const ExportDeckBuilder: React.FC = () => {
  const { deck, isFriendSlotEnabled } = useDeck();

  if (!deck) return null;

  // デッキタイプに応じたスロットマッピングとキャラクターフレームを取得
  const slotMapping = getDeckSlotMapping(deck.deckType);
  const characterFrame = getDeckFrame(deck.deckType);
  
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
  
  // キャラクターごとのスロットをグループ化
  const characterSlots = filteredCharacterFrame.map((character) => {
    const charSlots = slotMapping
      .filter((mapping) => mapping.characterName === character)
      .map((mapping) => deck.slots.find((slot) => slot.slotId === mapping.slotId)!)
      .filter(Boolean);
    
    return { character, slots: charSlots };
  }).filter(({ slots }) => slots.length > 0); // 空のグループを除外

  return (
    <div className="w-full">
      {/* デッキグリッド */}
      <div className="grid grid-cols-3 gap-8">
        {characterSlots.map(({ character, slots }) => {
          const isCenter = deck.centerCharacter === character;
          const isSinger = deck.participations?.includes(character) || false;
          const backgroundColor = getCharacterBackgroundColor(character, 0.5);
          const characterColor = getCharacterColor(character);

          return (
            <div key={character} className="relative">
              {/* Left badge area */}
              {(isCenter || isSinger) && (
                <div className="absolute -left-6 top-0 bottom-0 z-10 flex flex-col gap-3 pt-6">
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
                      />
                    </div>
                  )}
                  {slots[2] && (
                    <div className="flex-1">
                      <ExportCardSlot 
                        slot={slots[2]} 
                        characterColor={characterColor}
                        isAce={deck.aceSlotId === slots[2].slotId}
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
