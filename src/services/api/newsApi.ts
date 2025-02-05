import axios from "axios";
import { Article } from "../../types/news";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;

const newsApiClient = axios.create({
  baseURL: "https://newsapi.org/v2/top-headlines",
  params: {
    apiKey: NEWS_API_KEY,
  },
});

const guardianClient = axios.create({
  baseURL: "https://content.guardianapis.com",
  params: {
    "api-key": GUARDIAN_API_KEY,
    "show-fields": "thumbnail,trailText,byline",
  },
});

const nytClient = axios.create({
  baseURL: "https://api.nytimes.com/svc/search/v2",
  params: {
    "api-key": NYT_API_KEY,
  },
});

type Payload = {
  q: string;
  category?: string;
};

export const fetchNewsApiArticles = async ({ q, category }: Payload): Promise<Article[]> => {
  const response = await newsApiClient.get("/", {
    params: { q, category: category || undefined },
  });

  return response.data.articles.map((article: any) => ({
    id: article.url,
    title: article.title,
    description: article.description,
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    source: article.source.name,
    category: category || "general", 
    author: article.author,
  }));
};

export const fetchGuardianArticles = async ({ q, category }: Payload): Promise<Article[]> => {
  let response = await guardianClient.get("/search", {
    params: {
      q,
      section: category || undefined,
    }
  });

  // Temporary fix as we are getting empty results with section filter
  if (response.data.response.results.length === 0 && category) {
    response = await guardianClient.get("/search", { params: { q } });
  }

  return response.data.response.results.map((article: any) => ({
    id: article.id,
    title: article.webTitle,
    description: article.fields?.trailText || "",
    url: article.webUrl,
    imageUrl: article.fields?.thumbnail,
    publishedAt: article.webPublicationDate,
    source: "The Guardian",
    category: category || article.sectionName,
    author: article.fields?.byline,
  }));
};

export const fetchNYTArticles = async ({ q, category }: Payload): Promise<Article[]> => {
  const formattedCategory = category ? `section_name:("${category}")` : ""; // 🛑 FIX: Apply correct filtering

  const response = await nytClient.get("/articlesearch.json", {
    params: {
      q,
      fq: formattedCategory,
    },
  });

  return response.data.response.docs.map((article: any) => ({
    id: article._id,
    title: article.headline.main,
    description: article.abstract,
    url: article.web_url,
    imageUrl: article.multimedia?.length
      ? `https://www.nytimes.com/${article.multimedia[0].url}`
      : undefined, // 🛑 FIX: Ensure valid image URL
    publishedAt: article.pub_date,
    source: "The New York Times",
    category: category || article.section_name,
    author: article.byline?.original,
  }));
};
