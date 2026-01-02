'use client';

import React from 'react';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';
import { getSelectableCharactersForSlot } from '@/services/characterFilterService';
import { getCharacterColor } from '@/constants/characters';

interface CharacterFilterProps {
  selectedCharacters: string[] | undefined;
  onToggle: (characterName: string) => void;
  currentSlotId?: number | null;
}

export const CharacterFilter: React.FC<CharacterFilterProps> = ({
  selectedCharacters,
  onToggle,
  currentSlotId,
}) => {
  const selectableCharacters = React.useMemo(
    () => getSelectableCharactersForSlot(currentSlotId ?? null),
    [currentSlotId]
  );

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        キャラクター
      </label>
      <MultiSelectFilter
        values={selectableCharacters}
        selectedValues={selectedCharacters}
        onToggle={onToggle}
        getLabel={(character) => character}
        color={(character) => getCharacterColor(character)}
      />
    </div>
  );
};
