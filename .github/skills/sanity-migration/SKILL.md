---
name: sanity-migration
description: 'Sanity移行作業のワークフロースキル。Use when: Sanityスキーマ定義・リポジトリ実装・GROQクエリ実装・データインポートなど、Sanity移行タスク（Phase 1〜5）を行うとき。ドキュメント参照・TASKSチェック・Notionチケット確認・作業ブランチ生成の手順を提供する。'
argument-hint: '実施するPhaseまたはタスク（例: Phase 1, newsRepository）'
---

# Sanity 移行作業ワークフロー

## ドキュメント構成

移行作業を始める前に必ず以下のドキュメントを参照すること。

| ファイル                                                                                                                    | 内容                                                          |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [docs/sanity-migration/00_SUMMARY_DESIGN.md](../../../docs/sanity-migration/00_SUMMARY_DESIGN.md)                           | 全体アーキテクチャ・移行方針の概要                            |
| [docs/sanity-migration/01_PHASE1_SETUP.md](../../../docs/sanity-migration/01_PHASE1_SETUP.md)                               | Phase 1: 環境セットアップ・スキーマ定義・データインポート詳細 |
| [docs/sanity-migration/02_PHASE2_3_FRONTEND_MIGRATION.md](../../../docs/sanity-migration/02_PHASE2_3_FRONTEND_MIGRATION.md) | Phase 2〜3: フロントエンド統合の実装仕様                      |
| [docs/sanity-migration/03_PHASE4_5_STABILIZATION.md](../../../docs/sanity-migration/03_PHASE4_5_STABILIZATION.md)           | Phase 4〜5: 安定化・完全移行の実装仕様                        |
| [docs/sanity-migration/TASKS.md](../../../docs/sanity-migration/TASKS.md)                                                   | 進捗管理タスクリスト（作業後に必ず更新）                      |

## 作業手順

### 1. ドキュメント・タスク確認

- 実施フェーズに対応するドキュメントを読む
- `TASKS.md` で対象タスクが未完了であることを確認する

### 2. Notionチケット確認

- Notion MCP で対応チケット（LLES-XXX）を確認する
- チケットが存在しない場合は作業前に起票し、EPICを **Convert to Sanity**（LLES-265）に設定する
- チケットの目的・終了条件を確認してから作業を開始する

### 3. 作業ブランチの作成

以下のルールに従ってブランチを作成する：

```
# 親ブランチ
EPIC/convert-to-sanity

# 作業ブランチ（親ブランチから派生）
git checkout EPIC/convert-to-sanity
git checkout -b LLES-XXX
```

### 4. 実装

- 対応ドキュメントの仕様に厳密に従って実装する
- **コミット・PRは行わない**。実装のみを行いユーザーに引き渡す

### 5. TASKSの更新

実装完了後、`docs/sanity-migration/TASKS.md` の該当チェックボックスを `[x]` にする。

## フェーズとチケット対応

| Phase     | 対象                                       | Notionタグ目安     |
| --------- | ------------------------------------------ | ------------------ |
| Phase 1   | 環境変数・client.ts・スキーマ・インポート  | LLES-267〜LLES-271 |
| Phase 2-A | news / maintenance GROQ置き換え            | LLES-272〜LLES-275 |
| Phase 2-B | songs / effectKeywords GROQ置き換え        | LLES-276〜LLES-281 |
| Phase 3   | useCards・イベントデータ GROQ置き換え      | LLES-282〜LLES-285 |
| Phase 4   | TraitAnalysis 設計・実装                   | LLES-286〜LLES-287 |
| Phase 5   | Apollo/MicroCMS除却・旧バックエンドArchive | LLES-288〜LLES-291 |

## 注意事項

- `docs/sanity-migration/` 配下の設計ドキュメントはソースオブトゥルース。実装で迷ったら必ず参照する
- **コミット・PRは絶対に行わない**。実装完了後はユーザーに作業内容を報告して終了する
- タスク完了後は必ず `TASKS.md` を更新する（チェックボックスを埋める）
- Notionチケットのステータスも作業開始時→完了時に更新する
