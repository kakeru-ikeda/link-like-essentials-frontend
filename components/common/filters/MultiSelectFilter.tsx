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

        // TODO 色指定のルールを統一する
        if (typeof colorValue === 'string') {
          if (colorValue.startsWith('#')) {
            // HEX色の場合: インラインスタイルで背景色を指定、テキストは白
            selectedStyle = { backgroundColor: colorValue, color: '#ffffff' };
          } else if (colorValue.includes(' ')) {
            // 完全なクラス名の場合（例: 'bg-red-500 text-white'）
            selectedClass = colorValue;
          } else if (colorValue.startsWith('bg-')) {
            // bg- で始まる単一クラスの場合: text-white を追加
            selectedClass = `${colorValue} text-white`;
          } else {
            // 色名のみの場合（例: 'blue', 'red'）: Tailwind の bg-{color}-500 形式
            selectedClass = `bg-${colorValue}-500 text-white`;
          }
        }

        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              isSelected
                ? selectedClass || 'bg-gray-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
            style={isSelected ? selectedStyle : undefined}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
