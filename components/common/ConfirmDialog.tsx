import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  processingContent?: React.ReactNode;
  processingLock?: boolean;
  children?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  processingContent,
  processingLock = false,
  children,
}) => {
  const isLocked = processingLock || Boolean(processingContent);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      closeOnBackdropClick={!isLocked}
      hideCloseButton={isLocked}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {description && <p className="text-sm text-gray-700">{description}</p>}
        {processingContent}
        {children}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isLocked}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLocked}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
