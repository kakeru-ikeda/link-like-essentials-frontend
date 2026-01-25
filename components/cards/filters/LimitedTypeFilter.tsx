'use client';

import React from 'react';
import { LimitedType } from '@/models/shared/enums';
import { LIMITED_TYPE_LABELS } from '@/mappers/enumMappers';
import { LIMITED_TYPE_COLORS } from '@/styles/colors';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';

interface LimitedTypeFilterProps {
  selectedLimitedTypes: LimitedType[] | undefined;
  onToggle: (limitedType: LimitedType) => void;
}

export const LimitedTypeFilter: React.FC<LimitedTypeFilterProps> = ({
  selectedLimitedTypes,
  onToggle,
}) => {
  const limitedTypeLabel = (limitedType: LimitedType) =>
    LIMITED_TYPE_LABELS[limitedType];
  const limitedTypeColor = (limitedType: LimitedType) =>
    LIMITED_TYPE_COLORS[limitedType];

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        入手方法
      </label>
      <MultiSelectFilter
        values={Object.values(LimitedType)}
        selectedValues={selectedLimitedTypes}
        onToggle={onToggle}
        label={limitedTypeLabel}
        color={limitedTypeColor}
      />
    </div>
  );
};
