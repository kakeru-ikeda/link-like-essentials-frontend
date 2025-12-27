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
  const { cards, loading } = useCards(filter);
  const sideModal = useSideModal();

  return (
    <div className="container mx-auto px-4 py-6">
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
        onSelectCard={(card) => sideModal.openCardDetail(card.id)}
      />

      {/* カード詳細サイドモーダル */}
      <SideModal
        isOpen={sideModal.selectedCardId !== null}
        onClose={sideModal.closeCardDetail}
        title="カード詳細"
        width="md"
      >
        {sideModal.selectedCardId && (
          <CardDetailView cardId={sideModal.selectedCardId} />
        )}
      </SideModal>
    </div>
  );
}
