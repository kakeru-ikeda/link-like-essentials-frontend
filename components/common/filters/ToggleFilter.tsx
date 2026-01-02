import React from 'react';

interface ToggleFilterProps {
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  trueLabel?: string;
  falseLabel?: string;
  color: string;
}

export const ToggleFilter: React.FC<ToggleFilterProps> = ({
  value,
  onChange,
  trueLabel = 'あり',
  falseLabel = 'なし',
  color = '#06b6d4', // cyan-500
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(value === true ? undefined : true)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          value === true
            ? ''
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
        style={
          value === true
            ? { backgroundColor: color, color: '#ffffff' }
            : undefined
        }
      >
        {trueLabel}
      </button>
      <button
        onClick={() => onChange(value === false ? undefined : false)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          value === false
            ? ''
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
        style={
          value === false
            ? { backgroundColor: color, color: '#ffffff' }
            : undefined
        }
      >
        {falseLabel}
      </button>
    </div>
  );
};
