'use client';

import React from 'react';
import { useCards } from '@/hooks/useCards';
import { useFilter } from '@/hooks/useFilter';
import { CardGrid } from '@/components/cards/CardGrid';
import { CardDetailView } from '@/components/deck/CardDetailView';
import { CardGridFilter } from '@/components/cards/CardGridFilter';
import { SideModal } from '@/components/common/SideModal';
import { useSideModal } from '@/hooks/useSideModal';

export default function CardsPage(): JSX.Element {
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
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">カード一覧</h1>
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
      <CardGrid
        cards={cards}
        loading={loading}
        onClickCard={(card) => openCardDetail(card.id)}
      />

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
