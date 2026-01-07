'use client';

import React from 'react';
import { FavoriteMode } from '@/models/enums';
import { FAVORITE_MODE_LABELS } from '@/mappers/enumMappers';
import { FAVORITE_MODE_COLORS } from '@/styles/colors';
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

  const favoriteModeLabel = (mode: FavoriteMode) => FAVORITE_MODE_LABELS[mode];
  const favoriteModeColor = (mode: FavoriteMode) => FAVORITE_MODE_COLORS[mode];

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        得意ムード
      </label>
      <MultiSelectFilter
        values={favoriteModes}
        selectedValues={selectedFavoriteModes}
        onToggle={onToggle}
        label={favoriteModeLabel}
        color={favoriteModeColor}
      />
    </div>
  );
};
