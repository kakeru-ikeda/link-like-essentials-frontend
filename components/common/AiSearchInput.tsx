'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { CardFilter } from '@/models/shared/Filter';
import { useCardAiFilter } from '@/hooks/card/useCardAiFilter';
import { AiFeedbackButtons } from '@/components/common/AiFeedbackButtons';

interface AiSearchInputProps {
  onFilter: (filter: CardFilter) => void;
}

export const AiSearchInput: React.FC<AiSearchInputProps> = ({ onFilter }) => {
  const [query, setQuery] = useState('');
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { loading, error, aiSearchResult, feedbackSubmitted, applyAiFilter, submitFeedback } =
    useCardAiFilter();

  useEffect(() => {
    if (loading) {
      slowTimerRef.current = setTimeout(() => {
        setShowSlowMessage(true);
      }, 8000);
    } else {
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
      }
      setShowSlowMessage(false);
    }
    return () => {
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
      }
    };
  }, [loading]);

  const handleSubmit = async (): Promise<void> => {
    const filter = await applyAiFilter(query);
    if (filter) {
      onFilter(filter);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
        <span className="text-xs font-medium text-purple-700">AI検索</span>
        <span className="text-xs text-gray-400">（β）</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder='「花帆のSRでリシャッフルできるカード」のように入力'
          className="flex-1 px-3 py-2 text-sm text-gray-900 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 disabled:bg-gray-50 disabled:text-gray-400 placeholder:text-gray-400"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !query.trim()}
          className="flex items-center justify-center px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg transition-colors flex-shrink-0"
          aria-label="AI検索を実行"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      {showSlowMessage && (
        <p className="text-xs text-purple-600 animate-pulse">AIサーバー起動中です。そのままお待ちください</p>
      )}
      {aiSearchResult && (
        <AiFeedbackButtons submitted={feedbackSubmitted} onSubmit={submitFeedback} />
      )}
    </div>
  );
};
