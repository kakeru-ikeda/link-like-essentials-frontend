# 軽量セッション（コンテキスト引き継ぎ型）設計書

## 概要

Slack/Discord スレッド（`thread_ts` / `threadId`）単位で、直前ジョブの結果サマリーを次のジョブのプロンプトに自動注入する仕組み（**Approach A：軽量セッション**）。

Copilot CLI 自体はステートレスのままで、プロンプトに前回文脈（`previousContext`）を組み込むことで継続性を提供する。

```
1回目メンション → ジョブ実行 → PR作成 → resultSummary 保存
2回目メンション（同スレッド） → 前の resultSummary をプロンプト先頭に自動注入
```

---

## ジョブ間リンク条件

同一スレッドへの新規ジョブ投入時、以下のキーが一致する直前ジョブを DB から取得して `parentJobId` で紐付ける。

| キー | 説明 |
|------|------|
| `threadId` | Slack の `thread_ts` または Discord の `threadId` |
| `channelId` | チャンネル ID |
| `platform` | `slack` / `discord` |
| `repository` | 対象リポジトリ名 |
| `userId` | ジョブ所有者（後述の安全性チェックに使用） |

参照先ジョブが存在しない場合（スレッド最初のメンション）は従来通り単発ジョブとして動作する。

---

## 文脈の注入方法

### DB スキーマ変更（CATAPULT 側）

```prisma
model Job {
  id            String   @id @default(cuid())
  // ... 既存フィールド ...
  parentJobId   String?
  parent        Job?     @relation("JobHierarchy", fields: [parentJobId], references: [id])
  children      Job[]    @relation("JobHierarchy")
}
```

### `ExecuteOptions` インターフェース拡張

```typescript
// packages/worker/src/executor.ts
interface ExecuteOptions {
  prompt: string;
  instructions?: string;
  previousContext?: string; // ← 追加: 前回ジョブの文脈サマリー
  // ... 既存フィールド ...
}
```

### プロンプト構築（`buildPrompt()` 拡張イメージ）

```typescript
// packages/worker/src/executor.ts
private buildPrompt(options: ExecuteOptions): string {
  const previousContextSection = options.previousContext
    ? `## 前回の作業サマリー\n${options.previousContext}`
    : "";

  return [
    branchInstruction,
    options.instructions ?? "",
    previousContextSection,
    options.prompt,
  ]
    .filter(Boolean)
    .join("\n\n");
}
```

`previousContext` は空の場合は無視される。

---

## 保持範囲・制限

| 項目 | 仕様 |
|------|------|
| 参照範囲 | 同一スレッドの直前ジョブ（1 世代のみ） |
| 最大文字数 | 4,096 文字（超過分は末尾トリム） |
| 保持内容 | `resultSummary`、`prUrl`（存在する場合） |
| セッション有効期限 | 制限なし（スレッドが継続する限り有効）※注1 |

```typescript
const MAX_PREVIOUS_CONTEXT_LENGTH = 4096;

function truncatePreviousContext(context: string): string {
  if (context.length <= MAX_PREVIOUS_CONTEXT_LENGTH) return context;
  return context.slice(0, MAX_PREVIOUS_CONTEXT_LENGTH) + "\n...(省略)";
}
```

> **注1**: ジョブレコードの DB 保持期間はアプリケーションの運用方針に従う。
> 長期間使用されていないスレッドのジョブは定期クリーンアップの対象とすることを推奨する。

---

## 安全性

- `parentJobId` の参照先ジョブの `userId` と現在ジョブの `userId` が一致する場合のみ文脈を注入する。
- 不一致の場合は `parentJobId` を設定せず、単発ジョブとして扱う。

```typescript
// 所有者検証の例
if (parentJob && parentJob.userId === currentUserId) {
  jobData.parentJobId = parentJob.id;
  jobData.previousContext = buildContext(parentJob);
}
```

---

## 実装箇所（CATAPULT バックエンド）

| ファイル | 変更内容 |
|----------|----------|
| `prisma/schema.prisma` | `Job` モデルに `parentJobId` 自己参照リレーションを追加 |
| `packages/bot/src/handlers/mention.ts` | `thread_ts` で直前ジョブを検索し `parentJobId` を設定 |
| `packages/bot/src/handlers/task.ts` | 直前ジョブの `resultSummary` を取得して `previousContext` として引き渡し |
| `packages/worker/src/executor.ts` | `ExecuteOptions` に `previousContext?: string` 追加・`buildPrompt()` で注入 |
| `packages/worker/src/job-processor.ts` | `previousContext` を `executor.execute()` に渡す |

---

## UI/UX（通知メッセージ）

同スレッドでフォローアップを検知した際、Bot は以下のメッセージを追加で通知する。

```
📎 前回ジョブのサマリーを参照して実行します。
```

---

## 受け入れ条件

1. 同一スレッドで連続してタスクを投げると、2 回目以降のジョブのプロンプトに前回サマリーが含まれる。
2. 単発のメンション（スレッド最初のジョブ）では従来通り動作する。
3. 異なる `userId` のジョブを誤参照しない。
4. `previousContext` が 4,096 文字を超える場合はトリムされる。
5. CI（型チェック / リント / テスト）が通る。
