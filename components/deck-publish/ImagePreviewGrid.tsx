'use client';

import React from 'react';
import { Tooltip } from '@/components/common/Tooltip';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface ImagePreviewGridProps {
  imageUrls: string[];
  onRemove?: (index: number) => void;
  columnCount?: 1 | 2 | 3 | 4;
  tooltipPosition?: TooltipPosition;
  className?: string;
  imageClassName?: string;
}

const columnClassMap: Record<NonNullable<ImagePreviewGridProps['columnCount']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
  imageUrls,
  onRemove,
  columnCount = 3,
  tooltipPosition = 'right',
  className = '',
  imageClassName = '',
}) => {
  if (!imageUrls.length) return null;

  const gridColsClass = columnClassMap[columnCount] || columnClassMap[3];

  return (
    <div className={`grid gap-3 ${gridColsClass} ${className}`}>
      {imageUrls.map((url, index) => (
        <div key={url} className="relative">
          <Tooltip
            content={
              <img
                src={url}
                alt={`画像 ${index + 1} プレビュー`}
                className="max-w-[500px] max-h-[500px] object-contain"
              />
            }
            position={tooltipPosition}
            className="block"
            tooltipClassName="fixed z-[9999] p-2 bg-white border-2 border-gray-300 rounded-lg shadow-2xl pointer-events-none"
            hideArrow
          >
            <a href={url} target="_blank" rel="noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`画像 ${index + 1}`}
                className={`w-full aspect-square object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity ${imageClassName}`}
              />
            </a>
          </Tooltip>

          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 z-10"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
