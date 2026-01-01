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
  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        スタイルタイプ
      </label>
      <MultiSelectFilter
        values={Object.values(StyleType)}
        selectedValues={selectedStyleTypes}
        onToggle={onToggle}
        getLabel={(styleType) => STYLE_TYPE_LABELS[styleType]}
        color={(styleType) => STYLE_TYPE_COLORS[styleType]}
      />
    </div>
  );
};
