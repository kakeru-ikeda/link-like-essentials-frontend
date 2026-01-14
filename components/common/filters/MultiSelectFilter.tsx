'use client';

import React from 'react';
import { Tooltip } from '@/components/common/Tooltip';

interface MultiSelectFilterProps<T extends string | number> {
  values: readonly T[];
  selectedValues: T[] | undefined;
  onToggle: (value: T) => void;
  label: (value: T) => string;
  color?: string | ((value: T) => string);
  valueTooltip?: (value: T) => string;
}

export const MultiSelectFilter = <T extends string | number>({
  values,
  selectedValues = [],
  onToggle,
  label,
  valueTooltip,
  color = '#3b82f6', // デフォルトは blue-500 相当
}: MultiSelectFilterProps<T>): React.ReactElement => {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => {
        const isSelected = selectedValues.includes(value);
        const colorValue = typeof color === 'function' ? color(value) : color;

        const buttonElement = (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              isSelected
                ? ''
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={{
              border: `1.5px solid ${colorValue}`,
              backgroundColor: `${colorValue}10`,
              ...(isSelected && {
                backgroundColor: colorValue,
                color: '#ffffff',
              }
            ),
            }}
          >
            {label(value)}
          </button>
        );

        if (valueTooltip) {
          return (
            <Tooltip
              key={value}
              content={valueTooltip(value)}
              position="top"
            >
              {buttonElement}
            </Tooltip>
          );
        }

        return buttonElement;
      })}
    </div>
  );
};
