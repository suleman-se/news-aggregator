export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  category: string;
  author?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  enabled: boolean;
}

export interface NewsFilters {
  search: string;
  startDate?: Date;
  endDate?: Date;
  fromDate?: string;
  toDate?: string;
  categories: string[];
  authors: string[];
}