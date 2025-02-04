import React, { useState, useEffect, useMemo } from "react";
import { ArticleCard } from "./ArticleCard";
import { useNewsStore } from "../store/useNewsStore";
import { fetchNewsApiArticles, fetchGuardianArticles, fetchNYTArticles } from "../services/api/newsApi";
import { Loader } from "lucide-react";

export const NewsFeed: React.FC = () => {
  const { filters, sources } = useNewsStore();
  const { search } = filters;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const enabledSources = useMemo(() => sources.filter((s) => s.enabled), [sources]);

  useEffect(() => {
    if (!search.trim()) {
      setArticles([]);
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const promises = enabledSources.map((source) => {
          switch (source.id) {
            case "newsapi":
              return fetchNewsApiArticles(search);
            case "guardian":
              return fetchGuardianArticles(search);
            case "nyt":
              return fetchNYTArticles(search);
            default:
              return Promise.resolve([]);
          }
        });

        const results = await Promise.all(promises);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        setArticles(results.flat().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [search, enabledSources]);

  if (!search) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">
          Enter a search term to find articles
        </h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
