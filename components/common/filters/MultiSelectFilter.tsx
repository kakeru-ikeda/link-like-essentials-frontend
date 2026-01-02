import React from 'react';

interface MultiSelectFilterProps<T extends string | number> {
  values: readonly T[];
  selectedValues: T[] | undefined;
  onToggle: (value: T) => void;
  getLabel: (value: T) => string;
  color?: string | ((value: T) => string);
  renderCustomButton?: (
    value: T,
    isSelected: boolean,
    label: string
  ) => React.ReactNode;
}

export const MultiSelectFilter = <T extends string | number>({
  values,
  selectedValues = [],
  onToggle,
  getLabel,
  color = '#3b82f6', // デフォルトは blue-500 相当
  renderCustomButton,
}: MultiSelectFilterProps<T>): React.ReactElement => {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => {
        const isSelected = selectedValues.includes(value);
        const label = getLabel(value);

        if (renderCustomButton) {
          return (
            <React.Fragment key={value}>
              {renderCustomButton(value, isSelected, label)}
            </React.Fragment>
          );
        }

        const colorValue = typeof color === 'function' ? color(value) : color;

        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              isSelected
                ? ''
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
            style={
              isSelected
                ? { backgroundColor: colorValue, color: '#ffffff' }
                : undefined
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
