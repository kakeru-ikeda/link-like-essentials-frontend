import React from 'react';
import { Rarity } from '@/models/enums';
import { RARITY_LABELS } from '@/constants/labels';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';

interface RarityFilterProps {
  selectedRarities: Rarity[] | undefined;
  onToggle: (rarity: Rarity) => void;
}

export const RarityFilter: React.FC<RarityFilterProps> = ({
  selectedRarities,
  onToggle,
}) => {
  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        レアリティ
      </label>
      <MultiSelectFilter
        values={Object.values(Rarity)}
        selectedValues={selectedRarities}
        onToggle={onToggle}
        getLabel={(rarity) => RARITY_LABELS[rarity]}
        color="#800080"
      />
    </div>
  );
};
