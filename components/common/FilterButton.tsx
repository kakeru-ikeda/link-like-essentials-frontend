import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterButtonProps {
  onClick: () => void;
  activeCount: number;
  isExpanded?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  activeCount,
  isExpanded,
}) => {
  return (
    <button
      onClick={onClick}
      className="relative px-2 sm:px-4 h-8 sm:h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap"
      aria-label="絞り込み"
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      <span>絞り込み</span>
      {activeCount > 0 && (
        <span className="ml-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {activeCount}
        </span>
      )}
      {isExpanded !== undefined &&
        (isExpanded ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        ))}
    </button>
  );
};
