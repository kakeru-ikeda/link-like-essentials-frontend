import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Card } from '@/models/Card';
import { Rarity, StyleType, LimitedType } from '@/models/enums';

export interface CardFilters {
  characterName?: string;
  rarity?: Rarity[];
  styleType?: StyleType[];
  limited?: LimitedType[];
  searchText?: string;
}

interface CardState {
  cards: Card[];
  selectedCard: Card | null;
  filters: CardFilters;
  setCards: (cards: Card[]) => void;
  setSelectedCard: (card: Card | null) => void;
  updateFilters: (filters: Partial<CardFilters>) => void;
  clearFilters: () => void;
}

export const useCardStore = create<CardState>()(
  immer((set) => ({
    cards: [],
    selectedCard: null,
    filters: {},

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
  }))
);
