'use client';

import React from 'react';
import { StyleType } from '@/models/enums';
import { STYLE_TYPE_COLORS, STYLE_TYPE_LABELS } from '@/constants/labels';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';

interface StyleTypeFilterProps {
  selectedStyleTypes: StyleType[] | undefined;
  onToggle: (styleType: StyleType) => void;
}

export const StyleTypeFilter: React.FC<StyleTypeFilterProps> = ({
  selectedStyleTypes,
  onToggle,
}) => {
  const styleTypeLabel = (styleType: StyleType) => STYLE_TYPE_LABELS[styleType];
  const styleTypeColor = (styleType: StyleType) => STYLE_TYPE_COLORS[styleType];

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        スタイルタイプ
      </label>
      <MultiSelectFilter
        values={Object.values(StyleType)}
        selectedValues={selectedStyleTypes}
        onToggle={onToggle}
        label={styleTypeLabel}
        color={styleTypeColor}
      />
    </div>
  );
};
