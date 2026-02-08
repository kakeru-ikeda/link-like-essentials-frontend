import type { DeckAnalysis } from '@/models/deck/DeckAnalysis';

export type SectionKey = keyof DeckAnalysis['drawCountBySection'];

export const getDrawFormula = (
  drawCount: number,
  handSize: number,
  useCardCount: number
) => {
  const uncertainSlots = Math.max(0, handSize - drawCount + useCardCount);
  return { uncertainSlots };
};

export const formatExcludedReasons = (
  reasons: DeckAnalysis['excludedCards'][number]['reasons']
) =>
  reasons
    .map((reason) => {
      switch (reason) {
        case 'UN_DRAW':
          return 'アンドロー';
        case 'IMITATION':
          return 'イミテーション';
        case 'INSTANCE':
          return 'インスタンス';
        default:
          return '除外';
      }
    })
    .join('・');

export const getSectionSpecificDrawCards = (
  analysis: DeckAnalysis,
  sectionKey: SectionKey
) => {
  const unique = new Map<string, (typeof analysis.unDrawCards)[number]['card']>();

  analysis.unDrawCards.forEach((info) => {
    const sections = info.sections;
    if (!sections) return;

    const undrawMap: Record<SectionKey, boolean> = {
      section1: sections.section1,
      section2: sections.section2,
      section3: sections.section3,
      section4: sections.section4,
      section5: sections.section5,
      sectionFever: sections.sectionFever,
    };

    const isUndrawInSection = undrawMap[sectionKey];
    const isUndrawSomewhere = Object.values(undrawMap).some(Boolean);

    if (!isUndrawInSection && isUndrawSomewhere) {
      unique.set(info.card.id, info.card);
    }
  });

  return Array.from(unique.values());
};
