import create from 'zustand';
import { NewsFilters, NewsSource } from '../types/news';

interface NewsStore {
  filters: NewsFilters;
  sources: NewsSource[];
  setFilters: (filters: Partial<NewsFilters>) => void;
  toggleSource: (sourceId: string) => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
  filters: {
    search: '',
    categories: [],
    authors: [],
    fromDate: '',
    toDate: '',
  },
  sources: [
    { id: 'newsapi', name: 'NewsAPI', enabled: true },
    { id: 'guardian', name: 'The Guardian', enabled: true },
    { id: 'nyt', name: 'The New York Times', enabled: true },
  ],
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  toggleSource: (sourceId) =>
    set((state) => ({
      sources: state.sources.map((source) =>
        source.id === sourceId
          ? { ...source, enabled: !source.enabled }
          : source
      ),
    })),
}));