'use client';

import React from 'react';
import { Rarity } from '@/models/shared/enums';
import { RARITY_LABELS } from '@/mappers/enumMappers';
import { RARITY_COLORS } from '@/styles/colors';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';

interface RarityFilterProps {
  selectedRarities: Rarity[] | undefined;
  onToggle: (rarity: Rarity) => void;
}

export const RarityFilter: React.FC<RarityFilterProps> = ({
  selectedRarities,
  onToggle,
}) => {
  const rarityLabel = (rarity: Rarity) => RARITY_LABELS[rarity];

  const rarityColor = (rarity: Rarity) => RARITY_COLORS[rarity];

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        レアリティ
      </label>
      <MultiSelectFilter
        values={Object.values(Rarity)}
        selectedValues={selectedRarities}
        onToggle={onToggle}
        label={rarityLabel}
        color={rarityColor}
      />
    </div>
  );
};
