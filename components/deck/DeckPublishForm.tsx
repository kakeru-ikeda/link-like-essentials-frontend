'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { HashtagInput } from '@/components/deck/HashtagInput';
import { Deck } from '@/models/Deck';
import { LiveGrandPrix } from '@/models/LiveGrandPrix';

interface DeckPublishFormProps {
  deck: Deck | null;
  liveGrandPrix: LiveGrandPrix | undefined;
  displayName: string;
  isLoadingProfile: boolean;
  comment: string;
  setComment: (comment: string) => void;
  uploadedImageUrls: string[];
  uploadingCount: number;
  uploadError: string;
  setHashtags: (hashtags: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleDownloadImage: (
    ref: React.RefObject<HTMLDivElement>,
    deckName: string
  ) => void;
  isCapturing: boolean;
  exportViewRef: React.RefObject<HTMLDivElement>;
}

export const DeckPublishForm: React.FC<DeckPublishFormProps> = ({
  deck,
  liveGrandPrix,
  displayName,
  isLoadingProfile,
  comment,
  setComment,
  uploadedImageUrls,
  uploadingCount,
  uploadError,
  setHashtags,
  handleImageUpload,
  handleRemoveImage,
  handleDownloadImage,
  isCapturing,
  exportViewRef,
}) => {
  return (
    <div className="flex-1 min-w-0 flex flex-col max-h-[70vh]">
      {/* スクロール可能なコンテンツエリア */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* 表示名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            投稿者
          </label>
          {isLoadingProfile ? (
            <div className="text-gray-500">読み込み中...</div>
          ) : (
            <div className="text-lg font-semibold text-gray-900">
              {displayName || '未設定'}
            </div>
          )}
        </div>

        {/* ハッシュタグ入力 */}
        <HashtagInput
          deck={deck}
          liveGrandPrix={liveGrandPrix}
          onChange={setHashtags}
        />

        {/* コメント入力 */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            コメント（任意）
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="デッキについてのコメントを入力..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 画像アップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            画像を追加（任意・最大3枚）
          </label>
          <div className="space-y-3">
            {uploadedImageUrls.length < 3 && (
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingCount > 0}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            )}
            {uploadingCount > 0 && (
              <div className="text-sm text-gray-500">
                {uploadingCount}枚アップロード中...
              </div>
            )}
            {uploadError && (
              <div className="text-sm text-red-600">{uploadError}</div>
            )}
            {uploadedImageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {uploadedImageUrls.map((url, index) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt={`アップロード画像 ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {uploadedImageUrls.length >= 3 && (
              <div className="text-sm text-gray-500">
                画像は最大3枚までアップロードできます
              </div>
            )}
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="flex gap-3">
          <Button
            onClick={() =>
              handleDownloadImage(exportViewRef, deck?.name || 'deck')
            }
            disabled={isCapturing}
            className="flex-1"
          >
            {isCapturing ? 'ダウンロード中...' : '画像としてダウンロード'}
          </Button>
          <Button
            onClick={() => {
              /* TODO: 共有機能を実装 */
            }}
            disabled={isCapturing}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400"
          >
            共有
          </Button>
        </div>
      </div>
    </div>
  );
};
