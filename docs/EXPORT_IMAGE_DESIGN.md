# 画像描画専用コンポーネント設計書

## 1. ディレクトリ構造

```
components/
  deck/
    export/                           # 画像描画専用ディレクトリ
      DeckExportView.tsx              # 画像全体のレイアウト統括
      ExportDeckBuilder.tsx           # デッキビルダー表示部分
      ExportDashboard.tsx             # ダッシュボード表示部分
      ExportHeader.tsx                # ヘッダー（タイトル・日付）
      ExportFooter.tsx                # フッター（生成日時・クレジット）
```

---

## 2. 各コンポーネントの責務

### **DeckExportView.tsx**
- **役割**: 画像全体のレイアウト構成
- **責務**:
  - 縦並びレイアウト（上: デッキビルダー、下: ダッシュボード）
  - 背景・余白・全体スタイル制御
  - ヘッダー・フッター配置
- **Props**:
  ```typescript
  interface DeckExportViewProps {
    deckBuilderContent: React.ReactNode;
    dashboardContent: React.ReactNode;
    customWidth?: number;  // デフォルト: 1400px
  }
  ```

### **ExportDeckBuilder.tsx**
- **役割**: デッキビルダーの画像用表示
- **責務**:
  - DeckBuilderの内容を画像向けに最適化して表示
  - 不要なインタラクション要素（ボタンなど）を非表示化
  - フレンドスロット状態の反映
- **Props**:
  ```typescript
  interface ExportDeckBuilderProps {
    // DeckBuilderと同じデータを受け取る
    // ただし表示のみ（編集機能なし）
  }
  ```

### **ExportDashboard.tsx**
- **役割**: ダッシュボードの画像用表示
- **責務**:
  - DeckDashboardの内容を画像向けに最適化
  - スコア・楽曲情報・LRカード一覧などを見やすく配置
  - 編集系UIを除外
- **Props**:
  ```typescript
  interface ExportDashboardProps {
    // DeckDashboardと同じデータを受け取る
    // ただし表示のみ
  }
  ```

### **ExportHeader.tsx**
- **役割**: 画像ヘッダー部分
- **責務**:
  - アプリ名表示
  - デッキ名表示
  - 日付表示
- **Props**:
  ```typescript
  interface ExportHeaderProps {
    deckName?: string;
    date?: Date;
  }
  ```

### **ExportFooter.tsx**
- **役割**: 画像フッター部分
- **責務**:
  - 生成日時
  - クレジット表示
- **Props**:
  ```typescript
  interface ExportFooterProps {
    generatedAt?: Date;
  }
  ```

---

## 3. データフロー

```
app/page.tsx
  ↓ (Portal経由で非表示領域に配置)
DeckExportView
  ├─ ExportHeader (deckName, date)
  ├─ ExportDeckBuilder (zustandからdeck取得)
  ├─ ExportDashboard (zustandからdeck取得)
  └─ ExportFooter (generatedAt)
```

**データ取得方針**:
- 各コンポーネントは**Zustand Store**から直接データ取得
- Props経由で渡さず、`useDeck()`などのフック使用
- 理由: 通常表示と画像用表示で同じデータソースを保証

---

## 4. スタイリング方針

### **固定幅レイアウト**
- 画像サイズ固定: `1400px` （カスタマイズ可能）
- レスポンシブ不要（画像は固定サイズ）

### **Tailwind CSS**
- インラインクラス使用
- 画像用に最適化されたスタイル:
  - 影: `shadow-lg`
  - 角丸: `rounded-lg`
  - 背景: グラデーション `bg-gradient-to-br`

### **カラーパレット**
```typescript
const EXPORT_COLORS = {
  background: 'from-slate-50 to-slate-100',
  card: 'bg-white',
  border: 'border-slate-300',
  text: {
    primary: 'text-slate-800',
    secondary: 'text-slate-600',
    muted: 'text-slate-500',
  },
};
```

---

## 5. 実装の流れ

### **Step 1: 基本構造作成**
1. `components/deck/export/` ディレクトリ作成
2. `ExportHeader.tsx`, `ExportFooter.tsx` 実装（静的部分）
3. `DeckExportView.tsx` で全体レイアウト構築

### **Step 2: コンテンツ部分実装**
4. `ExportDeckBuilder.tsx` 実装
   - `DeckBuilder`からロジックを参考に表示のみ実装
   - `CharacterDeckGroup` をそのまま利用可能
5. `ExportDashboard.tsx` 実装
   - `DeckDashboard`から必要な表示部分を抽出

### **Step 3: フック作成**
6. `hooks/useScreenshot.ts` 作成
   - `html2canvas` ラッパー
   - ファイル名生成ロジック

### **Step 4: 統合**
7. `app/page.tsx` に統合
   - Portal で非表示領域に配置
   - ボタン追加

---

## 6. 使用ライブラリ

```bash
npm install html2canvas
npm install --save-dev @types/html2canvas
```

---

## 7. 実装例（骨格）

### DeckExportView.tsx
```typescript
// components/deck/export/DeckExportView.tsx
'use client';
import { ExportHeader } from './ExportHeader';
import { ExportFooter } from './ExportFooter';
import { ExportDeckBuilder } from './ExportDeckBuilder';
import { ExportDashboard } from './ExportDashboard';

export const DeckExportView: React.FC = () => {
  return (
    <div className="w-[1400px] bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <ExportHeader />
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <ExportDeckBuilder />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ExportDashboard />
      </div>
      <ExportFooter />
    </div>
  );
};
```

### useScreenshot.ts
```typescript
// hooks/useScreenshot.ts
import html2canvas from 'html2canvas';
import { useCallback, useState } from 'react';

export function useScreenshot() {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureElement = useCallback(async (
    element: HTMLElement,
    filename: string = 'deck-screenshot.png'
  ): Promise<void> => {
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('スクリーンショット失敗:', error);
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return { captureElement, isCapturing };
}
```

### app/page.tsx への統合
```typescript
// app/page.tsx（抜粋）
import { createPortal } from 'react-dom';
import { DeckExportView } from '@/components/deck/export/DeckExportView';
import { useScreenshot } from '@/hooks/useScreenshot';

export default function Home() {
  const { captureElement, isCapturing } = useScreenshot();
  const exportViewRef = useRef<HTMLDivElement>(null);
  const [showExportView, setShowExportView] = useState(false);

  const handleExportImage = async () => {
    setShowExportView(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (exportViewRef.current) {
      const deckName = deck?.deckName || 'デッキ';
      await captureElement(
        exportViewRef.current,
        `${deckName}_${new Date().toISOString().slice(0, 10)}.png`
      );
    }
    
    setShowExportView(false);
  };

  return (
    <>
      {/* 通常のUI */}
      <button onClick={handleExportImage}>📸 画像として保存</button>
      
      {/* Portal: 画像生成用の非表示レイアウト */}
      {showExportView && createPortal(
        <div ref={exportViewRef} style={{ position: 'fixed', left: '-9999px' }}>
          <DeckExportView />
        </div>,
        document.body
      )}
    </>
  );
}
```

---

## 8. 注意点

- **Zustand Store の状態同期**: 画像生成時は現在のアクティブタブの状態を反映
- **非同期レンダリング**: Portal表示後、DOM更新完了を待つ（300ms程度）
- **メモリ管理**: 画像生成後は必ずPortalを削除してメモリリーク防止
- **CORS対応**: 外部画像使用時は `useCORS: true` 必須
- **フォント読み込み**: Webフォント使用時は完全に読み込まれてから画像化
- **パフォーマンス**: 大きな要素の場合はLoading表示推奨

---

## 9. 今後の拡張案

- **画像サイズカスタマイズ**: ユーザーが解像度を選択可能に
- **テーマ切り替え**: ライト/ダークモード対応
- **SNS最適化**: Twitter/Discord向けのサイズプリセット
- **ウォーターマーク**: カスタムロゴ挿入機能
- **クリップボードコピー**: 保存せずに直接コピー機能
