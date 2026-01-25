export interface News {
  id: string;
  title: string;
  body?: string;
  content?: string;
  thumbnail?: {
    url: string;
    width?: number;
    height?: number;
  };
  category?: {
    id: string;
    name: string;
  };
  publishedAt?: string;
  revisedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
