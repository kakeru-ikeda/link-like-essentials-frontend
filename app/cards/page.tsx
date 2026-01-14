'use client';

import React, { useState } from 'react';
import { useCards } from '@/hooks/useCards';
import { useFilter } from '@/hooks/useFilter';
import { CardGridView } from '@/components/cards/CardGridView';
import { CardListView } from '@/components/cards/CardListView';
import { CardDetailView } from '@/components/deck/CardDetailView';
import { CardGridFilter } from '@/components/cards/CardGridFilter';
import { SideModal } from '@/components/common/SideModal';
import { useSideModal } from '@/hooks/useSideModal';
import { LayoutGrid, List } from 'lucide-react';
import { useCardHighlight } from '@/hooks/useCardHighlight';

export default function CardsPage(): JSX.Element {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const {
    filter,
    updateFilter,
    resetFilter,
    clearFilterKey,
    countActiveFilters,
  } = useFilter();
  const hasActiveFilter = filter && Object.keys(filter).length > 0;
  const { highlightKeywords } = useCardHighlight({
    syncFilter: hasActiveFilter ? filter : null,
  });
  const { cards, loading, error } = useCards(filter);
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
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-bold text-gray-900">カード一覧</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border transition-colors shadow-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              aria-label="グリッド表示"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border transition-colors shadow-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              aria-label="リスト表示"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">カードを検索・閲覧できます。</p>
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
          cards={cards}
          loading={loading}
          highlightKeywords={highlightKeywords.general}
          onClickCard={(card) => openCardDetail(card.id)}
        />
      ) : (
        <CardListView
          cards={cards}
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
