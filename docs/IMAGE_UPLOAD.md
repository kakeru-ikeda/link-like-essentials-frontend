# 画像アップロード機能

Firebase Storageへの画像アップロード機能を提供するカスタムフックとユーティリティです。

## 機能

- ✅ JPEG/PNG/WebP形式に対応
- ✅ 5MB以下に自動リサイズ・圧縮
- ✅ Firebase Storage (`tmp/` フォルダ) へのアップロード
- ✅ アップロード進捗の表示
- ✅ **オプション**: UIモーダルでの画像クリッピング（正方形）
- ✅ **オプション**: プログラム的な自動正方形クロップ

## アーキテクチャ

```
hooks/
  useImageUpload.ts          → メインのカスタムフック（状態管理）
utils/
  imageUtils.ts              → 画像処理ロジック（リサイズ、クリッピング）
repositories/
  firebase/
    config.ts                → Firebase Storage初期化
    storage.ts               → Storage操作（アップロード、URL取得）
components/
  common/
    ImageCropModal.tsx       → クリッピングUI
    ImageUploadExample.tsx   → 使用例デモ
```

## 使い方

### 基本的な使い方（クリッピングあり）

```tsx
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageCropModal } from '@/components/common/ImageCropModal';

const MyComponent = () => {
  const {
    uploadImage,
    isUploading,
    progress,
    error,
    showCropModal,
    cropImageFile,
    confirmCrop,
    cancelCrop,
  } = useImageUpload({
    enableCropping: true, // クリッピングUIを表示
    maxSizeMB: 5, // 最大5MB
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      console.log('アップロード完了:', url);
      // urlを使って何かする（例: stateに保存、APIに送信など）
    } catch (err) {
      console.error('エラー:', err);
    }
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleFileSelect} />

      {isUploading && <div>アップロード中... {Math.round(progress)}%</div>}

      {error && <div className="text-red-500">{error}</div>}

      {/* クリッピングモーダル */}
      <ImageCropModal
        isOpen={showCropModal}
        imageFile={cropImageFile}
        onConfirm={confirmCrop}
        onCancel={cancelCrop}
      />
    </>
  );
};
```

### 自動正方形クロップ（UIなし）

```tsx
const { uploadImage, isUploading, error } = useImageUpload({
  enableCropping: false, // UIは表示しない
  autoSquareCrop: true, // 自動で中央を正方形にクロップ
  maxSizeMB: 5,
});

const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = await uploadImage(file);
  console.log('正方形画像URL:', url);
};
```

### 元サイズのまま（リサイズのみ）

```tsx
const { uploadImage } = useImageUpload({
  enableCropping: false,
  autoSquareCrop: false, // クロップしない
  maxSizeMB: 5, // リサイズのみ
});
```

## API

### `useImageUpload(options)`

#### オプション

| パラメータ       | 型        | デフォルト | 説明                         |
| ---------------- | --------- | ---------- | ---------------------------- |
| `enableCropping` | `boolean` | `false`    | クリッピングUIを有効化       |
| `maxSizeMB`      | `number`  | `5`        | 最大ファイルサイズ（MB）     |
| `autoSquareCrop` | `boolean` | `false`    | 自動正方形クロップ（UIなし） |

#### 戻り値

| プロパティ      | 型                                | 説明                           |
| --------------- | --------------------------------- | ------------------------------ |
| `uploadImage`   | `(file: File) => Promise<string>` | 画像をアップロード。URLを返却  |
| `isUploading`   | `boolean`                         | アップロード中フラグ           |
| `progress`      | `number`                          | アップロード進捗（0-100）      |
| `error`         | `string \| null`                  | エラーメッセージ               |
| `reset`         | `() => void`                      | 状態をリセット                 |
| `showCropModal` | `boolean`                         | クリッピングモーダル表示フラグ |
| `cropImageFile` | `File \| null`                    | クリッピング対象ファイル       |
| `confirmCrop`   | `(cropArea) => Promise<void>`     | クリッピングを確定             |
| `cancelCrop`    | `() => void`                      | クリッピングをキャンセル       |

## 画像処理の詳細

### リサイズアルゴリズム

1. **品質調整**: JPEG品質を0.9から段階的に下げて圧縮
2. **画像縮小**: 品質を下げても5MBを超える場合、画像サイズ自体を縮小
3. **出力形式**: すべてJPEGに統一（互換性と圧縮効率のため）

### クリッピング機能

- ドラッグで位置調整
- スライダーでサイズ調整
- 三分割法のガイドライン表示
- リアルタイムプレビュー

## デモ

[ImageUploadExample.tsx](../components/common/ImageUploadExample.tsx) に3つの使用パターンのデモがあります。

## 対応画像フォーマット

- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)

※ 出力はすべてJPEG形式に統一されます

## トラブルシューティング

### エラー: "Firebase Storageが初期化されていません"

- `.env.local` にFirebase設定が正しく記載されているか確認
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` が設定されているか確認

### アップロードが完了しない

- ネットワーク接続を確認
- Firebase Storageのセキュリティルールを確認
- ユーザーが認証済みか確認（`useAuth`フックを使用）

### 画像が圧縮されすぎる

- `maxSizeMB` オプションを大きくする（ただし、Storageルールも合わせて変更必要）
- 元の画像サイズを小さくする
