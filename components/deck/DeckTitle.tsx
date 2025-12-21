'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HiPencil } from 'react-icons/hi2';

interface DeckTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export const DeckTitle: React.FC<DeckTitleProps> = ({ title, onTitleChange }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>(title);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // titleが変更されたら同期
  useEffect(() => {
    setTempTitle(title);
  }, [title]);

  // 編集モード時にフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (): void => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTempTitle(e.target.value);
  };

  const handleBlur = (): void => {
    const trimmedTitle = tempTitle.trim();
    if (trimmedTitle && trimmedTitle !== title) {
      onTitleChange(trimmedTitle);
    } else if (!trimmedTitle) {
      setTempTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !isComposing) {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setTempTitle(title);
      setIsEditing(false);
    }
  };

  const handleCompositionStart = (): void => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (): void => {
    setIsComposing(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={tempTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className="text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:ring-0 p-0 -ml-0.5"
          placeholder="デッキ名を入力..."
        />
      ) : (
        <div 
          onClick={handleClick}
          className="group flex items-center gap-2 cursor-text hover:bg-gray-100 rounded px-1 -ml-1 py-0.5 transition-colors"
        >
          <h1 className="text-2xl font-bold text-gray-800 truncate">
            {title}
          </h1>
          <HiPencil className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      )}
    </div>
  );
};
