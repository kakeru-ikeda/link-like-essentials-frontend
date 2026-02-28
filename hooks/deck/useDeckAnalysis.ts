import { useMemo } from 'react';
import type { Deck } from '@/models/deck/Deck';
import { analyzeDeck } from '@/services/deck/deckAnalyzerService';
import { useTraitAnalysisBatch } from '@/hooks/deck/useTraitAnalysis';

export const useDeckAnalysis = (deck: Deck | null) => {
  const deckCardIds = useMemo(() => {
    return (
      deck?.slots
        .map((slot) => slot.card?.id)
        .filter((id): id is string => Boolean(id)) ?? []
    );
  }, [deck]);

  const { analysisMap } = useTraitAnalysisBatch(deckCardIds);

  const analysis = useMemo(() => analyzeDeck(deck, analysisMap), [deck, analysisMap]);

  return { analysis };
};
