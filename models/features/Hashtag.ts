export interface PopularHashtag {
  hashtag: string;
  count: number;
}

export interface PopularHashtagSummary {
  hashtags: PopularHashtag[];
  aggregatedAt: string | null;
}
