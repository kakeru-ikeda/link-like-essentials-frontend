import { useEffect, useMemo } from 'react';
import { CardFilter } from '@/models/shared/Filter';
import { useCardStore } from '@/store/cardStore';
import { getHighlightKeywordsByTarget, HighlightKeywordsByTarget } from '@/services/card/highlightService';

interface UseCardHighlightOptions {
  syncFilter?: CardFilter | null;
}

export function useCardHighlight(options?: UseCardHighlightOptions): {
  highlightKeywords: HighlightKeywordsByTarget;
  activeFilter: CardFilter | null;
} {
  const { syncFilter } = options ?? {};
  const { activeFilter, setActiveFilter } = useCardStore((state) => ({
    activeFilter: state.activeFilter,
    setActiveFilter: state.setActiveFilter,
  }));

  useEffect(() => {
    if (syncFilter === undefined) return;

    setActiveFilter(syncFilter ?? null);
    return () => setActiveFilter(null);
  }, [syncFilter, setActiveFilter]);

  const effectiveFilter = syncFilter ?? activeFilter ?? null;

  const highlightKeywords: HighlightKeywordsByTarget = useMemo(
    () => getHighlightKeywordsByTarget(effectiveFilter),
    [effectiveFilter]
  );

  return { highlightKeywords, activeFilter: effectiveFilter };
}
