import { useState, useEffect, useMemo } from "react";
import { ArticleCard } from "./ArticleCard";
import { useNewsStore } from "../store/useNewsStore";
import { fetchNewsApiArticles, fetchGuardianArticles, fetchNYTArticles } from "../services/api/newsApi";
import { Loader } from "lucide-react";
import { Article } from "../types/news";

export const NewsFeed: React.FC = () => {
  const { filters, sources } = useNewsStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const payload = useMemo(() => ({
    q: filters.search || undefined,
    category: filters.categories.length ? filters.categories.join(",") : undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
    authors: filters.authors.length ? filters.authors.join(",") : undefined,
  }), [filters.search, filters.categories, filters.fromDate, filters.toDate, filters.authors]);

  const enabledSources = useMemo(() => sources.filter((s) => s.enabled), [sources]);

  useEffect(() => {
    if (!filters.search && filters.categories.length === 0 && filters.authors.length === 0 && !filters.fromDate) {
      setArticles([]);
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(enabledSources.map((source) => {
          switch (source.id) {
            case "newsapi": return fetchNewsApiArticles(payload);
            case "guardian": return fetchGuardianArticles(payload);
            case "nyt": return fetchNYTArticles(payload);
            default: return Promise.resolve([]);
          }
        }));

        setArticles(results.flat().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filters, enabledSources, payload]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">News Feed</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">No articles found.</h2>
          <p className="text-gray-500">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      )}
    </div>
  );
};
