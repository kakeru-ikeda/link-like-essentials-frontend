'use client';

import React from 'react';
import { LimitedType } from '@/models/enums';
import { LIMITED_TYPE_COLORS, LIMITED_TYPE_LABELS } from '@/constants/labels';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';

interface LimitedTypeFilterProps {
  selectedLimitedTypes: LimitedType[] | undefined;
  onToggle: (limitedType: LimitedType) => void;
}

export const LimitedTypeFilter: React.FC<LimitedTypeFilterProps> = ({
  selectedLimitedTypes,
  onToggle,
}) => {
  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        入手方法
      </label>
      <MultiSelectFilter
        values={Object.values(LimitedType)}
        selectedValues={selectedLimitedTypes}
        onToggle={onToggle}
        getLabel={(limitedType) => LIMITED_TYPE_LABELS[limitedType]}
        color={(limitedType) => LIMITED_TYPE_COLORS[limitedType]}
      />
    </div>
  );
};
