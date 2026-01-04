'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/common/Button';
import { ImageCropModal } from '@/components/common/ImageCropModal';
import type { UserProfileInput } from '@/models/User';

interface ProfileFormProps {
  /** 初期値（編集時） */
  initialValues?: UserProfileInput;
  /** 保存ボタン押下時のコールバック */
  onSubmit: (data: UserProfileInput) => Promise<void>;
  /** アバター画像のキャッシュバスターに使うキー（例: updatedAt） */
  avatarCacheKey?: string;
  /** キャンセルボタン押下時のコールバック */
  onCancel?: () => void;
  /** アバター画像アップロード処理 */
  onUploadAvatar: (file: File) => Promise<string>;
  /** アバター画像削除処理 */
  onDeleteAvatar?: () => Promise<void>;
  /** 送信中フラグ */
  isSubmitting?: boolean;
  /** 画像アップロード中フラグ */
  isUploadingImage?: boolean;
  /** クリッピングモーダル表示フラグ */
  showCropModal?: boolean;
  /** クリッピング対象の画像ファイル */
  cropImageFile?: File | null;
  /** クリッピング確定コールバック */
  onConfirmCrop?: (cropArea: { x: number; y: number; width: number; height: number }) => Promise<void>;
  /** クリッピングキャンセルコールバック */
  onCancelCrop?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  onUploadAvatar,
  onDeleteAvatar,
  avatarCacheKey,
  isSubmitting = false,
  isUploadingImage = false,
  showCropModal = false,
  cropImageFile = null,
  onConfirmCrop,
  onCancelCrop,
}) => {
  const [displayName, setDisplayName] = useState(initialValues?.displayName || '');
  const [bio, setBio] = useState(initialValues?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initialValues?.avatarUrl || '');
  const [avatarUrlCacheKey, setAvatarUrlCacheKey] = useState<string | undefined>(avatarCacheKey);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createAvatarSrc = (url: string): string =>
    `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(
      avatarUrlCacheKey || avatarCacheKey || ''
    )}`;

  /**
   * バリデーション
   */
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!displayName.trim()) {
      newErrors.displayName = '表示名は必須です';
    } else if (displayName.length > 50) {
      newErrors.displayName = '表示名は50文字以内で入力してください';
    }

    if (bio && bio.length > 500) {
      newErrors.bio = '自己紹介は500文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * フォーム送信
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data: UserProfileInput = {
      displayName: displayName.trim(),
      bio: bio.trim(),
      // avatarUrlが変更された場合のみ含める
      ...(avatarChanged && { avatarUrl: avatarUrl || undefined }),
    };

    await onSubmit(data);
  };

  /**
   * 画像ファイル選択
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await onUploadAvatar(file);
      setAvatarUrl(url);
      setAvatarUrlCacheKey(Date.now().toString());
      setAvatarChanged(true);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
    }

    // inputをリセット（同じファイルを再選択できるように）
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 画像削除
   */
  const handleDeleteAvatar = async () => {
    if (!window.confirm('アバター画像を削除しますか？')) {
      return;
    }

    try {
      if (onDeleteAvatar) {
        await onDeleteAvatar();
      }
      setAvatarUrl('');
      setAvatarUrlCacheKey(Date.now().toString());
      setAvatarChanged(true);
    } catch (error) {
      console.error('画像削除エラー:', error);
    }
  };

  const isDisabled = isSubmitting || isUploadingImage;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* アバター画像 */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={createAvatarSrc(avatarUrl)}
                  alt="アバター"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            {isUploadingImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="text-white text-sm">アップロード中...</div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDisabled}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {avatarUrl ? '画像を変更' : '画像をアップロード'}
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={isDisabled}
                className="bg-red-500 hover:bg-red-600"
              >
                削除
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* 表示名 */}
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            表示名 <span className="text-red-500">*</span>
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
            placeholder="表示名を入力"
            maxLength={50}
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {displayName.length} / 50文字
          </p>
        </div>

        {/* 自己紹介 */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            自己紹介
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none text-black"
            placeholder="自己紹介を入力"
            rows={5}
            maxLength={500}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{bio.length} / 500文字</p>
        </div>

        {/* ボタン */}
        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              disabled={isDisabled}
              className="bg-gray-500 hover:bg-gray-600"
            >
              キャンセル
            </Button>
          )}
          <Button
            type="submit"
            disabled={isDisabled}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>

      {/* 画像クリッピングモーダル */}
      {showCropModal && onConfirmCrop && onCancelCrop && (
        <ImageCropModal
          isOpen={showCropModal}
          imageFile={cropImageFile}
          onConfirm={onConfirmCrop}
          onCancel={onCancelCrop}
        />
      )}
    </>
  );
};
