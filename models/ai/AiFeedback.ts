import type { CardFilter } from '@/models/shared/Filter';

export type AiFeedbackRating = 'positive' | 'negative';

export interface AiFeedbackRequest {
  userInput: string;
  aiResponse: CardFilter;
  rating: AiFeedbackRating;
  comment?: string | null;
  correctedFilter?: CardFilter | null;
  latencyMs?: number | null;
}

export interface AiFeedbackResponse {
  feedbackId: string;
}
