import { LiveGrandPrix, LiveGrandPrixDetail } from '@/models/LiveGrandPrix';
import { Song } from '@/models/Song';
import { DeckType } from '@/models/enums';

/**
 * ライブグランプリフィルター
 */
export interface LiveGrandPrixFilter {
  yearTerm?: string;
  eventName?: string;
  startDateFrom?: string;
  startDateTo?: string;
}

/**
 * ライブグランプリ関連のビジネスロジックを提供するサービス
 */
export class LiveGrandPrixService {
  /**
   * deckTypeから期を抽出
   * 
   * @param deckType デッキタイプ
   * @returns 期（例: '103期', '104期'）
   */
  static extractYearTermFromDeckType(deckType?: DeckType): string | undefined {
    if (!deckType) return undefined;
    
    // DeckTypeの値から期を抽出(例: '103期', '104期', '105期' など)
    // ft.付きのデッキタイプも基本期に統一(例: '105期ft.梢' → '105期')
    const match = deckType.match(/^(\d{3}期)/);
    return match ? match[1] : undefined;
  }

  /**
   * ライブグランプリの詳細から楽曲情報を変換
   * GraphQLレスポンスの `category` フィールドを `deckType` に統一
   * 
   * @param detail ライブグランプリ詳細
   * @returns 楽曲情報（部分型）
   */
  static transformStageDetailToSong(detail: LiveGrandPrixDetail): Partial<Song> | undefined {
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
   * @param event ライブグランプリイベント
   * @returns 開催中の場合true
   */
  static isActiveEvent(event: LiveGrandPrix): boolean {
    const now = new Date();
    const endDate = new Date(event.endDate);
    return endDate > now;
  }

  /**
   * イベントリストから開催中のイベントを抽出
   * 
   * @param events ライブグランプリイベントリスト
   * @returns 開催中のイベント（なければnull）
   */
  static findActiveEvent(events: LiveGrandPrix[]): LiveGrandPrix | null {
    return events.find((event) => this.isActiveEvent(event)) || null;
  }

  /**
   * ライブグランプリが選択された期に存在するかチェック
   * 
   * @param eventId 選択中のイベントID
   * @param events 期でフィルタリングされたイベントリスト
   * @returns 存在する場合true
   */
  static isEventInCurrentTerm(eventId: string, events: LiveGrandPrix[]): boolean {
    return events.some((event) => event.id === eventId);
  }

  /**
   * ステージ詳細が詳細リストに存在するかチェック
   * 
   * @param detailId ステージ詳細ID
   * @param details ステージ詳細リスト
   * @returns 存在する場合true
   */
  static isStageDetailInList(detailId: string, details: LiveGrandPrixDetail[]): boolean {
    return details.some((detail) => detail.id === detailId);
  }
}
