'use client';

import React, { useState } from 'react';
import { Card } from '@/models/domain/Card';
import { RarityBadge } from '@/components/common/RarityBadge';
import { StyleTypeBadge } from '@/components/common/StyleTypeBadge';
import { FavoriteModeBadge } from '@/components/common/FavoriteModeBadge';
import { CardDetailSections } from '@/components/deck/CardDetailSections';
import { ChevronDown, ChevronUp, Plus, Minus, ArrowLeftRight } from 'lucide-react';

interface CardListItemProps {
  card: Card;
  onSelect: (card: Card) => void;
  variant?: 'default' | 'current' | 'inProgress';
}

export const CardListItem: React.FC<CardListItemProps> = ({ card, onSelect, variant = 'default' }) => {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleExpand = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (): void => {
    onSelect(card);
  };

  // バリアント別のスタイル定義
  const variantStyles = {
    default: {
      container: 'border-b border-gray-200',
      hover: 'hover:bg-gray-50',
      detailBg: 'bg-gray-50',
      actionBg: 'bg-blue-500/10',
      actionIcon: 'bg-blue-500',
      icon: Plus,
    },
    current: {
      container: 'bg-white rounded-lg border border-blue-200',
      hover: 'hover:bg-blue-50',
      detailBg: 'bg-blue-50',
      actionBg: 'bg-red-500/10',
      actionIcon: 'bg-red-500',
      icon: Minus,
    },
    inProgress: {
      container: 'bg-white rounded-lg border border-green-200',
      hover: 'hover:bg-green-50',
      detailBg: 'bg-green-50',
      actionBg: 'bg-orange-500/10',
      actionIcon: 'bg-orange-500',
      icon: ArrowLeftRight,
    },
  };

  const styles = variantStyles[variant];
  const ActionIcon = styles.icon;

  // ホバー時のアクションアイコン
  const getActionIcon = () => {
    if (!isHovered) return null;
    
    return (
      <div className={`absolute inset-0 ${styles.actionBg} flex items-center justify-center pointer-events-none`}>
        <div className={`${styles.actionIcon} text-white rounded-full p-2 shadow-lg`}>
          <ActionIcon className="w-4 h-4" strokeWidth={3} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* メイン表示エリア */}
      <button
        onClick={handleSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full flex items-center gap-4 p-4 ${styles.hover} transition-colors text-left relative`}
      >
        {/* カード画像サムネイル */}
        <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 relative">
          {!imageError && card.detail?.awakeAfterStorageUrl ? (
            <img
              src={card.detail.awakeAfterStorageUrl}
              alt={card.cardName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* ホバー時のアクションアイコン（画像上） */}
          {getActionIcon()}
        </div>

        {/* カード情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <RarityBadge rarity={card.rarity} position="inline" size="small" />
            {card.styleType && (
              <StyleTypeBadge styleType={card.styleType} size="small" />
            )}
            {card.detail?.favoriteMode && card.detail.favoriteMode !== 'NONE' && (
              <FavoriteModeBadge favoriteMode={card.detail.favoriteMode} size="small" />
            )}
          </div>
          <h3 className="font-bold text-gray-900 truncate">{card.cardName}</h3>
          <p className="text-sm text-gray-600">{card.characterName}</p>
        </div>

        {/* 詳細展開ボタン */}
        <button
          onClick={handleToggleExpand}
          className="flex-shrink-0 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors shadow-sm"
          aria-label="詳細を表示"
        >
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-700">詳細</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </button>
      </button>

      {/* 展開エリア（詳細情報） */}
      {isExpanded && card.detail && (
        <div className={`px-4 pb-4 ${styles.detailBg}`}>
          <CardDetailSections 
            card={card} 
            variant="compact"
            showStats={false}
            showAcquisition={false}
          />
        </div>
      )}
    </div>
  );
};
