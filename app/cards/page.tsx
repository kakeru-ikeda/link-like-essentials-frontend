'use client';

import React, { useState } from 'react';
import { useCards } from '@/hooks/card/useCards';
import { useCardFilterQuery } from '@/hooks/card/useCardFilterQuery';
import { CardGridView } from '@/components/cards/CardGridView';
import { CardListView } from '@/components/cards/CardListView';
import { CardDetailView } from '@/components/deck-builder/CardDetailView';
import { CardGridFilter } from '@/components/cards/CardGridFilter';
import { SideModal } from '@/components/common/SideModal';
import { useSideModal } from '@/hooks/ui/useSideModal';
import { LayoutGrid, List } from 'lucide-react';
import { useCardHighlight } from '@/hooks/card/useCardHighlight';
import { sortCards } from '@/services/card/cardSortService';
import { CARD_SORT_OPTIONS, ORDER_OPTIONS } from '@/config/sortOptions';
import { SortControls } from '@/components/common/SortControls';
import { useCardSort } from '@/hooks/card/useCardSort';

export default function CardsPage(): JSX.Element {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { sortBy, order, handleSortChange, handleOrderChange } = useCardSort();

  const {
    filter,
    updateFilter,
    resetFilter,
    clearFilterKey,
    countActiveFilters,
  } = useCardFilterQuery();
  const hasActiveFilter = filter && Object.keys(filter).length > 0;
  const { highlightKeywords } = useCardHighlight({
    syncFilter: hasActiveFilter ? filter : null,
  });
  const { cards, loading, error } = useCards(filter);

  // フィルター後のカードをソート
  const sortedCards = sortCards(cards, sortBy, order);

  const { openCardDetail, closeCardDetail, selectedCardId, isCardDetailOpen } =
    useSideModal();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-500">カード取得にエラーが発生しました</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* タイトルと説明 */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            カード一覧
          </h1>
          <p className="text-sm text-gray-600">カードを検索・閲覧できます。</p>
        </div>
        {/* ソートと表示切替 */}
        <div className="flex items-center gap-2">
          {/* ソート選択 */}
          <SortControls
            sortBy={sortBy}
            order={order}
            onSortByChange={handleSortChange}
            onOrderChange={handleOrderChange}
            sortByOptions={CARD_SORT_OPTIONS}
            orderOptions={ORDER_OPTIONS}
          />
          {/* 表示切替ボタン */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:p-2 rounded-lg border transition-colors shadow-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              aria-label="グリッド表示"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:p-2 rounded-lg border transition-colors shadow-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              aria-label="リスト表示"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* フィルター */}
      <CardGridFilter
        activeFilterCount={countActiveFilters()}
        filter={filter}
        updateFilter={updateFilter}
        clearFilterKey={clearFilterKey}
        onFilterClear={resetFilter}
      />

      {/* カード表示エリア */}
      {viewMode === 'grid' ? (
        <CardGridView
          cards={sortedCards}
          loading={loading}
          highlightKeywords={highlightKeywords.general}
          onClickCard={(card) => openCardDetail(card.id)}
        />
      ) : (
        <CardListView
          cards={sortedCards}
          loading={loading}
          highlightKeywords={highlightKeywords.general}
          onClickCard={(card) => openCardDetail(card.id)}
        />
      )}

      {/* カード詳細サイドモーダル */}
      <SideModal
        isOpen={isCardDetailOpen}
        onClose={closeCardDetail}
        title="カード詳細"
        width="md"
      >
        {selectedCardId && <CardDetailView cardId={selectedCardId} />}
      </SideModal>
    </div>
  );
}
