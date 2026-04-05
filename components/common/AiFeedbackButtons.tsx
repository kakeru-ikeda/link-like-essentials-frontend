'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import type { AiFeedbackRating } from '@/models/ai/AiFeedback';

interface AiFeedbackButtonsProps {
  submitted: boolean;
  onSubmit: (rating: AiFeedbackRating, comment?: string) => Promise<void>;
}

export const AiFeedbackButtons: React.FC<AiFeedbackButtonsProps> = ({
  submitted,
  onSubmit,
}) => {
  const [badExpanded, setBadExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGood = async (): Promise<void> => {
    setSubmitting(true);
    await onSubmit('positive');
    setSubmitting(false);
  };

  const handleBadOpen = (): void => {
    setBadExpanded(true);
  };

  const handleBadSubmit = async (): Promise<void> => {
    setSubmitting(true);
    await onSubmit('negative', comment || undefined);
    setSubmitting(false);
    setBadExpanded(false);
    setComment('');
  };

  const handleBadCancel = (): void => {
    setBadExpanded(false);
    setComment('');
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>フィードバックありがとうございます</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">この結果は正しいですか？</span>
        <button
          onClick={handleGood}
          disabled={submitting}
          className="p-1 rounded hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-40"
          aria-label="正しい"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleBadOpen}
          disabled={submitting || badExpanded}
          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
          aria-label="正しくない"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {badExpanded && (
        <div className="flex flex-col gap-1.5">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            placeholder="何が違いましたか？（任意）"
            rows={2}
            className="w-full px-3 py-2 text-xs text-gray-900 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400 placeholder:text-gray-400"
          />
          <div className="flex gap-1.5 justify-end">
            <button
              onClick={handleBadCancel}
              disabled={submitting}
              className="px-2.5 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
            >
              キャンセル
            </button>
            <button
              onClick={handleBadSubmit}
              disabled={submitting}
              className="px-2.5 py-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors disabled:opacity-40"
            >
              送信
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
