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
  color = 'blue',
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

        let selectedClass = '';
        let selectedStyle: React.CSSProperties | undefined;

        // TODO: 色指定のルールを統一する;
        if (typeof colorValue === 'string') {
          if (colorValue.startsWith('bg-') || colorValue.includes('text-')) {
            selectedClass = colorValue;
          } else if (colorValue.startsWith('#')) {
            selectedStyle = { backgroundColor: colorValue };
          } else {
            selectedClass = `bg-${colorValue}-500 text-white`;
          }
        }

        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              isSelected
                ? selectedClass || 'text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
            style={isSelected ? { ...(selectedStyle ?? undefined) } : undefined}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
