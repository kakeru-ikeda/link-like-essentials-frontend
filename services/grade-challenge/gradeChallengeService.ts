import { GradeChallenge, GradeChallengeDetail } from '@/models/grade-challenge/GradeChallenge';
import { Song } from '@/models/song/Song';
import { DeckType } from '@/models/shared/enums';

/**
 * グレードチャレンジ関連のビジネスロジックを提供するサービス
 */
export class GradeChallengeService {
  /**
   * グレードチャレンジの詳細から楽曲情報を変換
   * GraphQLレスポンスの `category` フィールドを `deckType` に統一
   * 
   * @param detail グレードチャレンジ詳細
   * @returns 楽曲情報（部分型）
   */
  static transformStageDetailToSong(detail: GradeChallengeDetail): Partial<Song> | undefined {
    if (!detail.song) return undefined;

    // GraphQLレスポンスではcategoryフィールドとして来る
    const songData = detail.song as unknown as { category?: DeckType; deckType?: DeckType } & Song;
    const deckType = songData.category || songData.deckType;

    return {
      id: detail.song.id,
      songName: detail.song.songName,
      centerCharacter: detail.song.centerCharacter,
      participations: detail.song.participations,
      liveAnalyzerImageUrl: detail.song.liveAnalyzerImageUrl,
      deckType: deckType,
    };
  }

  /**
   * イベントの日付範囲をフォーマット
   * 
   * @param startDate 開始日
   * @param endDate 終了日
   * @returns フォーマット済み日付範囲（例: "12/1～12/15"）
   */
  static formatEventDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    });
    const end = new Date(endDate).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    });

    return `${start}～${end}`;
  }

  /**
   * 開催中のイベントかどうかを判定
   * 
   * @param event グレードチャレンジイベント
   * @returns 開催中の場合true
   */
  static isActiveEvent(event: GradeChallenge): boolean {
    const now = new Date();
    const endDate = new Date(event.endDate);
    return endDate > now;
  }

  /**
   * イベントリストから開催中のイベントを抽出
   * 
   * @param events グレードチャレンジイベントリスト
   * @returns 開催中のイベント（なければnull）
   */
  static findActiveEvent(events: GradeChallenge[]): GradeChallenge | null {
    return events.find((event) => this.isActiveEvent(event)) || null;
  }

  /**
   * ステージ詳細が詳細リストに存在するかチェック
   * 
   * @param detailId ステージ詳細ID
   * @param details ステージ詳細リスト
   * @returns 存在する場合true
   */
  static isStageDetailInList(detailId: string, details: GradeChallengeDetail[]): boolean {
    return details.some((detail) => detail.id === detailId);
  }
}
