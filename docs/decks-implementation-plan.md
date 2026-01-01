# デッキSNS機能 実装チェックリスト

## マイルストーン
- [ ] 1. 公開デッキ一覧ページ実装
  - app/decks/page.tsx を一覧表示＋ページネーション対応でSSR/ISR実装
  - PublishedDeck一覧UIとサービス・フック準備
- [ ] 2. 公開デッキ詳細ページ実装
  - app/decks/[id]/page.tsx を新設し、DeckExportView流用の閲覧レイアウトを組む
- [ ] 3. PublishedDeck→Deckコンパイル
  - services/deckService に PublishedDeck(DeckForCloud)からDeck型へ復元する関数を追加し、GraphQLでカード詳細を補完
- [ ] 4. SNS機能のクライアント実装
  - like/unlike/view/comment/report を services+store+hooks で実装し、一覧・詳細UIへ組み込み
- [ ] 5. インポート機能実装
  - 公開デッキを自分のデッキへコピーするサービスとUI(ボタン/モーダル)を追加し、deckStoreへ反映
- [ ] 6. テスト・動作確認
  - 一覧取得、詳細表示、SNS操作、インポートの動作確認と必要な軽いテスト

## メモ
- 依存関係: components → services → repositories を厳守
- any禁止、オブジェクトはinterface、ユニオンはtype。Enumはmodels/enums.tsに集約
- SSRでAPI認証が必要な場合、取得方法（Cookie/Server Actions等）を要確認

## 改善メモ（一覧UI）
- 縦長サムネイルでレイアウト崩れ → aspect比固定（例えば aspect-[4/3] 背景cover）とプレースホルダー高さ確保
- ハッシュタグ表示で`#`が二重表示 → 文字列には`#`を含めず、描画側で単一の`#`を付与
- カードグリッドのギャップ/マージン調整、モバイルでの列数最適化
