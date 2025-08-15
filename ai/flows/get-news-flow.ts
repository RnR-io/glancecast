
'use server';
/**
 * @fileOverview A flow for fetching news articles from Google News.
 *
 * - getNews - A function that handles the news fetching process.
 * - NewsInput - The input type for the getNews function.
 * - NewsOutput - The return type for the getNews function.
 */

import { ai } from '@/ai/genkit';
import { NewsInputSchema, NewsOutputSchema, type NewsInput, type NewsOutput } from '@/ai/schemas';

const getNewsTool = ai.defineTool(
  {
    name: 'getNewsTool',
    description: 'Get the latest news headlines for a given location.',
    inputSchema: NewsInputSchema,
    outputSchema: NewsOutputSchema,
  },
  async ({ location }) => {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(location)}&hl=en-US&gl=US&ceid=US:en`;
    const converterUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
      const response = await fetch(converterUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.status !== 'ok') {
        throw new Error(`API error: ${data.message}`);
      }

      return data.items.map((item: any) => ({
        title: item.title,
        source: item.author || 'Google News',
        time: new Date(item.pubDate).toLocaleDateString(),
        link: item.link,
      })).slice(0, 10);

    } catch (error: any) {
      console.error('Error fetching live news, falling back to mock data.', error);
      // Fallback to mock data in case of an error
      return [
        { title: 'Could not fetch live news.', source: 'System', time: 'now', link: '#' },
      ];
    }
  }
);

export async function getNews(input: NewsInput): Promise<{ news: NewsOutput } | { error: string }> {
    try {
        const news = await getNewsFlow(input);
        return { news };
    } catch(e: any) {
        return { error: e.message || "Failed to get news" };
    }
}

const getNewsFlow = ai.defineFlow(
  {
    name: 'getNewsFlow',
    inputSchema: NewsInputSchema,
    outputSchema: NewsOutputSchema,
  },
  async (input) => {
    const news = await getNewsTool(input);
    return news;
  }
);
