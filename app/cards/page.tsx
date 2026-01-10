'use client';

import React, { useState } from 'react';
import { useCards } from '@/hooks/useCards';
import { useFilter } from '@/hooks/useFilter';
import { CardGrid } from '@/components/cards/CardGrid';
import { CardList } from '@/components/cards/CardList';
import { CardDetailView } from '@/components/deck/CardDetailView';
import { CardGridFilter } from '@/components/cards/CardGridFilter';
import { SideModal } from '@/components/common/SideModal';
import { useSideModal } from '@/hooks/useSideModal';
import { LayoutGrid, List } from 'lucide-react';

export default function CardsPage(): JSX.Element {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const {
    filter,
    updateFilter,
    resetFilter,
    clearFilterKey,
    countActiveFilters,
  } = useFilter();
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
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">カード一覧</h1>
          <p className="text-sm text-gray-600">カードを検索・閲覧できます。</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
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
        <CardGrid
          cards={cards}
          loading={loading}
          onClickCard={(card) => openCardDetail(card.id)}
        />
      ) : (
        <CardList
          cards={cards}
          loading={loading}
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
