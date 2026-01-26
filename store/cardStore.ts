import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Card } from '@/models/card/Card';
import { CardFilter } from '@/models/shared/Filter';

export interface CardFilters {
  characterName?: string;
  rarity?: any[];
  styleType?: any[];
  limited?: any[];
  searchText?: string;
}

interface CardState {
  cards: Card[];
  selectedCard: Card | null;
  filters: CardFilters;
  // ハイライト用のアクティブフィルタ
  activeFilter: CardFilter | null;
  // 保存されたフィルター（キャラクターロック以外）
  savedFilter: CardFilter;
  setCards: (cards: Card[]) => void;
  setSelectedCard: (card: Card | null) => void;
  updateFilters: (filters: Partial<CardFilters>) => void;
  clearFilters: () => void;
  setActiveFilter: (filter: CardFilter | null) => void;
  setSavedFilter: (filter: CardFilter) => void;
}

export const useCardStore = create<CardState>()(
  immer((set) => ({
    cards: [],
    selectedCard: null,
    filters: {},
    activeFilter: null,
    savedFilter: {},

    setCards: (cards) =>
      set((state) => {
        state.cards = cards;
      }),

    setSelectedCard: (card) =>
      set((state) => {
        state.selectedCard = card;
      }),

    updateFilters: (filters) =>
      set((state) => {
        state.filters = { ...state.filters, ...filters };
      }),

    clearFilters: () =>
      set((state) => {
        state.filters = {};
      }),

    setActiveFilter: (filter) =>
      set((state) => {
        state.activeFilter = filter;
      }),

    setSavedFilter: (filter) =>
      set((state) => {
        state.savedFilter = filter;
      }),
  }))
);
