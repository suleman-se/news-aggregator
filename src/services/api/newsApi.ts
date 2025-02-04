import axios from 'axios';
import { Article } from '../../types/news';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;

const newsApiClient = axios.create({
  baseURL: 'https://newsapi.org/v2',
  params: {
    apiKey: NEWS_API_KEY,
  },
});

const guardianClient = axios.create({
  baseURL: 'https://content.guardianapis.com',
  params: {
    'api-key': GUARDIAN_API_KEY,
  },
});

const nytClient = axios.create({
  baseURL: 'https://api.nytimes.com/svc/search/v2',
  params: {
    'api-key': NYT_API_KEY,
  },
});

export const fetchNewsApiArticles = async (query: string): Promise<Article[]> => {
  const response = await newsApiClient.get('/everything', {
    params: { q: query },
  });
  
  return response.data.articles.map((article: any) => ({
    id: article.url,
    title: article.title,
    description: article.description,
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    source: article.source.name,
    category: 'general',
    author: article.author,
  }));
};

export const fetchGuardianArticles = async (query: string): Promise<Article[]> => {
  const response = await guardianClient.get('/search', {
    params: { q: query },
  });
  
  return response.data.response.results.map((article: any) => ({
    id: article.id,
    title: article.webTitle,
    description: article.fields?.trailText || '',
    url: article.webUrl,
    imageUrl: article.fields?.thumbnail,
    publishedAt: article.webPublicationDate,
    source: 'The Guardian',
    category: article.sectionName,
    author: article.fields?.byline,
  }));
};

export const fetchNYTArticles = async (query: string): Promise<Article[]> => {
  const response = await nytClient.get('/articlesearch.json', {
    params: { q: query },
  });
  
  return response.data.response.docs.map((article: any) => ({
    id: article._id,
    title: article.headline.main,
    description: article.abstract,
    url: article.web_url,
    imageUrl: article.multimedia[0]?.url ? `https://www.nytimes.com/${article.multimedia[0].url}` : undefined,
    publishedAt: article.pub_date,
    source: 'The New York Times',
    category: article.section_name,
    author: article.byline?.original,
  }));
};