'use client';

import React, { useEffect, useRef } from 'react';
import { Card } from '@/models/card/Card';
import { CardGridItem } from '@/components/cards/CardGridItem';

interface CardGridViewProps {
  cards: Card[];
  loading: boolean;
  highlightKeywords: string[];
  onClickCard: (card: Card) => void;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
}

export const CardGridView: React.FC<CardGridViewProps> = ({
  cards,
  loading,
  highlightKeywords,
  onClickCard,
  hasMore,
  isFetchingMore,
  onLoadMore,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onLoadMore || !hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 text-lg">カードが見つかりませんでした</p>
          <p className="text-gray-400 text-sm mt-2">
            フィルター条件を変更してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <CardGridItem
            key={card.id}
            card={card}
            highlightKeywords={highlightKeywords}
            onClick={onClickCard}
          />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} className="h-1" />}
      {isFetchingMore && (
        <div className="flex items-center justify-center py-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 absolute top-0 left-0"></div>
          </div>
        </div>
      )}
    </div>
  );
};
