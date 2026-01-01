import React from 'react';
import { FavoriteMode } from '@/models/enums';
import { FAVORITE_MODE_COLORS, FAVORITE_MODE_LABELS } from '@/constants/labels';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';

interface FavoriteModeFilterProps {
  selectedFavoriteModes: FavoriteMode[] | undefined;
  onToggle: (favoriteMode: FavoriteMode) => void;
}

export const FavoriteModeFilter: React.FC<FavoriteModeFilterProps> = ({
  selectedFavoriteModes,
  onToggle,
}) => {
  const favoriteModes = Object.values(FavoriteMode).filter(
    (mode) => mode !== FavoriteMode.NONE
  );

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        得意ムード
      </label>
      <MultiSelectFilter
        values={favoriteModes}
        selectedValues={selectedFavoriteModes}
        onToggle={onToggle}
        getLabel={(mode) => FAVORITE_MODE_LABELS[mode]}
        color={(mode) => FAVORITE_MODE_COLORS[mode]}
      />
    </div>
  );
};
