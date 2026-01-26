'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { HashtagInput } from '@/components/deck-publish/HashtagInput';
import { ImagePreviewGrid } from '@/components/deck-publish/ImagePreviewGrid';
import { Deck } from '@/models/deck/Deck';
import { LiveGrandPrix } from '@/models/live-grand-prix/LiveGrandPrix';
import { HelpTooltip } from '@/components/common/HelpTooltip';

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
  isUnlisted: boolean;
  setIsUnlisted: (value: boolean) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  onRequestPublish: () => void;
  isPublishing: boolean;
  publishError: string | null;
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
  isUnlisted,
  setIsUnlisted,
  handleImageUpload,
  handleRemoveImage,
  onRequestPublish,
  isPublishing,
  publishError,
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

        {/* 限定公開切り替え */}
        <div className="flex items-center gap-2">
          <input
            id="is-unlisted"
            type="checkbox"
            checked={isUnlisted}
            onChange={(e) => setIsUnlisted(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="is-unlisted"
            className="block text-sm font-medium text-gray-700"
          >
            限定公開にする
          </label>
          <HelpTooltip
            content="リンクを知っている人だけが閲覧できます。公開デッキ一覧には表示されません。"
            position="top"
            className="mb-0.5"
            size={4}
          />
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
          />
        </div>

        {/* 画像アップロード */}
        <div>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像を追加（任意・最大3枚）
            </label>
            <HelpTooltip
              content="実際のプレイリザルトのスクリーンショットなどをアップロードできます。アップロードした画像はデッキ公開ページに表示されます。"
              className="mb-2"
              size={4}
            />
          </div>
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
              <ImagePreviewGrid
                imageUrls={uploadedImageUrls}
                onRemove={handleRemoveImage}
                columnCount={3}
                tooltipPosition="right"
              />
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
        {publishError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {publishError}
          </div>
        )}
        <div className="flex gap-3">
          <Button
            onClick={onRequestPublish}
            disabled={isPublishing}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400"
          >
            {isPublishing ? '公開中...' : '公開'}
          </Button>
        </div>
      </div>
    </div>
  );
};
