'use client';

import React, { useState, useRef } from 'react';
import { HiArrowsPointingOut } from 'react-icons/hi2';
import { Modal } from '@/components/common/Modal';
import { useSimpleModal } from '@/hooks/useModal';

interface TextAreaWithModalProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  modalTitle?: string;
  modalRows?: number;
  className?: string;
}

export const TextAreaWithModal: React.FC<TextAreaWithModalProps> = ({
  value,
  onChange,
  onBlur,
  label,
  placeholder = '',
  rows = 3,
  modalTitle = label,
  modalRows = 15,
  className = '',
}) => {
  const { isOpen, open, close } = useSimpleModal();
  const [modalValue, setModalValue] = useState<string>(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    onChange(e.target.value);
  };

  const handleExpandClick = (): void => {
    setModalValue(value);
    open();
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newValue = e.target.value;
    setModalValue(newValue);
    // リアルタイムで同期
    onChange(newValue);
  };

  const handleModalClose = (): void => {
    onBlur?.();
    close();
  };

  return (
    <>
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative flex-1 flex flex-col min-h-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className="w-full h-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
            rows={rows}
          />
          <button
            type="button"
            onClick={handleExpandClick}
            className="absolute right-2 bottom-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="拡大表示"
          >
            <HiArrowsPointingOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={modalTitle}
      >
        <textarea
          value={modalValue}
          onChange={handleModalChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
          rows={modalRows}
          autoFocus
        />
      </Modal>
    </>
  );
};
