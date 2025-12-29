# デッキ公開API仕様書

## 概要

デッキを公開するためのAPI仕様を定義します。フロントエンドからのリクエストと、サーバー側で管理すべきデータを明確化します。

---

## エンドポイント

### デッキを公開

```
POST /decks/publish
```

**認証**: 必須（Bearer Token）

---

### 公開デッキを削除

```
DELETE /decks/{id}
```

**認証**: 必須（Bearer Token）

#### パスパラメータ

| パラメータ | 型       | 説明                                       |
| ---------- | -------- | ------------------------------------------ |
| `id`       | `string` | 公開ID（公開時に生成された21文字のnanoid） |

#### レスポンス

**成功レスポンス（204 No Content）**

レスポンスボディなし

**エラーレスポンス**

```json
// 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証が必要です"
  }
}

// 403 Forbidden
{
  "error": {
    "code": "FORBIDDEN",
    "message": "このデッキを削除する権限がありません"
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "指定されたデッキが見つかりません"
  }
}
```

#### 注意事項

- 削除できるのは自分が公開したデッキのみ
- 削除後は元に戻せない
- 公開IDは再利用不可

---

## リクエスト仕様

### Headers

```
Authorization: Bearer {Firebase ID Token}
Content-Type: application/json
```

### Request Body

```typescript
{
  "id": string,              // 公開ID（フロントエンドで生成したnanoid、21文字）
  "deck": {                  // デッキ基本情報
    "id": string,            // デッキID（ローカルID）
    "name": string,          // デッキ名
    "slots": [               // カードスロット配列（18個）
      {
        "slotId": number,    // スロットID（0-17）
        "cardId": string | null,  // カードID
        "limitBreak": number      // 限界突破レベル（任意）
      }
    ],
    "aceSlotId": number | null,        // エーススロットID
    "deckType": string,                // デッキタイプ（任意）
    "songId": string,                  // 楽曲ID（任意）
    "liveGrandPrixId": string,         // ライブグランプリID（任意）
    "liveGrandPrixDetailId": string,   // ライブグランプリ詳細ID（任意）
    "score": number,                   // 参考スコア（兆単位、任意）
    "memo": string,                    // メモ（任意）
    "createdAt": string,               // デッキ作成日時（ISO 8601形式）
    "updatedAt": string                // デッキ更新日時（ISO 8601形式）
  },
  "comment": string,         // コメント（任意、最大1000文字程度）
  "hashtags": string[],      // ハッシュタグ配列（自動生成 + カスタム）
  "imageUrls": string[]      // 画像URL配列（任意、最大3枚）
}
```

### リクエスト例

```json
{
  "id": "V1StGXR8_Z5jdHi6B-myT",
  "deck": {
    "id": "deck-local-12345",
    "name": "UR編成・高火力デッキ",
    "slots": [
      {
        "slotId": 0,
        "cardId": "card-001",
        "limitBreak": 5
      },
      {
        "slotId": 1,
        "cardId": "card-002",
        "limitBreak": 3
      }
      // ... 計18スロット
    ],
    "aceSlotId": 0,
    "deckType": "PERFORMANCE",
    "songId": "song-123",
    "liveGrandPrixId": "lgp-2024-01",
    "liveGrandPrixDetailId": "lgp-detail-stage-3",
    "score": 1500,
    "memo": "エース枠はセラスUR推奨",
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2025-12-28T12:30:00.000Z"
  },
  "comment": "ライブグランプリで1500兆達成できました！エース枠の選択が重要です。",
  "hashtags": ["#UR編成", "#高火力", "#ライブグランプリ", "#セラス", "#1500兆"],
  "imageUrls": [
    "https://storage.example.com/deck-images/abc123.png",
    "https://storage.example.com/deck-images/def456.png"
  ]
}
```

---

## サーバー側で管理するパラメータ

以下のパラメータは **サーバー側で自動生成・管理** してください。クライアントからは送信されません。

### 自動生成パラメータ

| パラメータ名  | 型       | 説明                 | 生成ロジック         |
| ------------- | -------- | -------------------- | -------------------- |
| `userId`      | `string` | 公開者のAuthUID      | 認証トークンから抽出 |
| `userName`    | `string` | 公開者の表示名       | ユーザー情報から取得 |
| `viewCount`   | `number` | 閲覧数               | 初期値: `0`          |
| `likeCount`   | `number` | いいね数             | 初期値: `0`          |
| `publishedAt` | `string` | 公開日時（ISO 8601） | サーバー現在時刻     |

### パラメータ詳細

#### `userId`

- 認証トークン（Bearer Token）からAuthUIDを抽出
- デッキの所有者を特定するために使用

#### `userName`

- ユーザーテーブルから `userId` に紐づく `displayName` を取得
- 未設定の場合は「名無しのプレイヤー」などのデフォルト値

#### `viewCount` / `likeCount`

- 公開時は `0` で初期化
- 別エンドポイントで更新（例: `POST /decks/{id}/view`, `POST /decks/{id}/like`）

#### `publishedAt`

- サーバー側の現在時刻を設定
- タイムゾーン: UTC

---

## レスポンス仕様

### 成功レスポンス（201 Created）

```json
{
  "publishedDeck": {
    "id": "V1StGXR8_Z5jdHi6B-myT",
    "deck": {
      "id": "deck-local-12345",
      "name": "UR編成・高火力デッキ",
      "slots": [
        {
          "slotId": 0,
          "cardId": "card-001",
          "limitBreak": 5
        },
        {
          "slotId": 1,
          "cardId": "card-002",
          "limitBreak": 3
        }
        // ... 計18スロット
      ],
      "aceSlotId": 0,
      "deckType": "PERFORMANCE",
      "songId": "song-123",
      "liveGrandPrixId": "lgp-2024-01",
      "liveGrandPrixDetailId": "lgp-detail-stage-3",
      "score": 1500,
      "memo": "エース枠はセラスUR推奨",
      "createdAt": "2025-12-28T10:00:00.000Z",
      "updatedAt": "2025-12-28T12:30:00.000Z"
    },
    "userId": "firebase-auth-uid-12345",
    "userName": "プレイヤー名",
    "comment": "ライブグランプリで1500兆達成できました！",
    "hashtags": [
      "#UR編成",
      "#高火力",
      "#ライブグランプリ",
      "#セラス",
      "#1500兆"
    ],
    "imageUrls": [
      "https://storage.example.com/deck-images/abc123.png",
      "https://storage.example.com/deck-images/def456.png"
    ],
    "viewCount": 0,
    "likeCount": 0,
    "publishedAt": "2025-12-28T12:35:00.000Z"
  }
}
```

**注記**: レスポンスはPublishedDeck型で返却されます。デッキ情報は`deck`フィールドにネストされています。

### エラーレスポンス

#### 400 Bad Request

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "リクエストパラメータが不正です",
    "details": {
      "field": "deck.name",
      "reason": "デッキ名は必須です"
    }
  }
}
```

#### 401 Unauthorized

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証が必要です"
  }
}
```

#### 409 Conflict

```json
{
  "error": {
    "code": "DUPLICATE_PUBLICATION_ID",
    "message": "指定された公開IDは既に使用されています"
  }
}
```

#### 500 Internal Server Error

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "サーバーエラーが発生しました"
  }
}
```

---

## データベーススキーマ提案

### published_decks テーブル

| カラム名       | 型             | NULL | 説明                           |
| -------------- | -------------- | ---- | ------------------------------ |
| `id`           | `VARCHAR(21)`  | NO   | 公開ID（PK、nanoid）           |
| `user_id`      | `VARCHAR(128)` | NO   | 公開者のAuthUID                |
| `user_name`    | `VARCHAR(255)` | NO   | 公開者の表示名                 |
| `deck_data`    | `JSONB`        | NO   | デッキ情報全体（DeckForCloud） |
| `comment`      | `TEXT`         | YES  | コメント                       |
| `hashtags`     | `TEXT[]`       | NO   | ハッシュタグ配列               |
| `image_urls`   | `TEXT[]`       | YES  | 画像URL配列                    |
| `view_count`   | `INTEGER`      | NO   | 閲覧数（デフォルト: 0）        |
| `like_count`   | `INTEGER`      | NO   | いいね数（デフォルト: 0）      |
| `published_at` | `TIMESTAMP`    | NO   | 公開日時                       |
| `created_at`   | `TIMESTAMP`    | NO   | レコード作成日時               |
| `updated_at`   | `TIMESTAMP`    | NO   | レコード更新日時               |

**注記**:

- `deck_data`にはDeckForCloud型のJSONが格納されます（id, name, slots, aceSlotId, deckType, songId, liveGrandPrixId, liveGrandPrixDetailId, score, memo, createdAt, updatedAt）
- 個別カラム（deck_id, deck_name等）は検索・インデックス用に冗長化してもよい

---

## バリデーションルール

### 必須パラメータ

- `id`: 21文字の英数字（nanoid形式）
- `deck.id`: 文字列
- `deck.name`: 1文字以上、255文字以下
- `deck.slots`: 配列、要素数18個
- `hashtags`: 配列（空配列可）

### 任意パラメータ

- `comment`: 最大1000文字
- `imageUrls`: 配列、最大3要素
- その他 `deck` 内のパラメータ

### バリデーションエラー例

- `deck.name` が空 → 400 Bad Request
- `deck.slots` の要素数が18でない → 400 Bad Request
- `imageUrls` が4枚以上 → 400 Bad Request
- `id` の形式が不正 → 400 Bad Request
- `id` が既に存在 → 409 Conflict

---

## 補足事項

### 公開IDの重複について

- フロントエンドで生成した `id` が既に存在する場合は 409 エラーを返す

### 将来的な拡張

- いいね機能: `POST /decks/{id}/like`, `DELETE /decks/{id}/like`
- 閲覧数カウント: `POST /decks/{id}/view`
- コメント機能: `POST /decks/{id}/comments`
- レポート機能: `POST /decks/{id}/report`

---

## TypeScript型定義（参考）

### DeckPublicationRequest（リクエスト）

```typescript
/**
 * デッキ公開リクエスト用の型
 * PublishedDeckから送信に必要なフィールドのみをPick
 */
type DeckPublicationRequest = Pick<
  PublishedDeck,
  'id' | 'deck' | 'comment' | 'hashtags' | 'imageUrls'
>;

interface DeckForCloud {
  id: string;
  name: string;
  slots: DeckSlotForCloud[];
  aceSlotId: number | null;
  deckType?: string;
  songId?: string;
  liveGrandPrixId?: string;
  liveGrandPrixDetailId?: string;
  score?: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

interface DeckSlotForCloud {
  slotId: number;
  cardId: string | null;
  limitBreak?: number;
}
```

### PublishedDeck（レスポンス）

```typescript
/**
 * 公開済みデッキ型
 * サーバーから取得する公開されたデッキのデータ
 */
interface PublishedDeck {
  /** 公開ID（デッキ公開時のユニークID） */
  id: string;

  /** 基本デッキ情報 */
  deck: DeckForCloud;

  /** 公開者のAuthUID */
  userId: string;

  /** 公開者の表示名 */
  userName: string;

  /** コメント */
  comment?: string;

  /** ハッシュタグ配列 */
  hashtags: string[];

  /** アップロード画像URL配列 */
  imageUrls?: string[];

  /** 閲覧数 */
  viewCount: number;

  /** いいね数 */
  likeCount: number;

  /** 公開日時 */
  publishedAt: string;
}
```

---

## 変更履歴

| 日付       | バージョン | 変更内容                                                           |
| ---------- | ---------- | ------------------------------------------------------------------ |
| 2025-12-28 | 1.0        | 初版作成                                                           |
| 2025-12-28 | 1.1        | DELETE /decks/{id} エンドポイント仕様を追加                        |
| 2025-12-29 | 1.2        | 実装に合わせて型定義を修正（PublishedDeck構造、isPublished削除等） |
