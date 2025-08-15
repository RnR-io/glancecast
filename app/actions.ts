
'use server';

import { generateDailyBrief } from '@/ai/flows/generate-daily-brief';
import { getNews } from '@/ai/flows/get-news-flow';
import { getStocks } from '@/ai/flows/get-stocks-flow';
import { getWeather } from '@/ai/flows/get-weather-flow';
import type { GenerateDailyBriefInput, NewsInput, NewsOutput, StocksInput, StocksOutput, WeatherInput, WeatherOutput } from '@/ai/schemas';

export async function getDailyBrief(input: GenerateDailyBriefInput): Promise<{ brief: string } | { error: string }> {
  try {
    const result = await generateDailyBrief(input);
    return { brief: result.brief };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate daily brief. Please try again.' };
  }
}

export async function getNewsAction(input: NewsInput): Promise<{ news: NewsOutput } | { error: string }> {
  try {
    const result = await getNews(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get news data. Please try again.' };
  }
}

export async function getStocksAction(input: StocksInput): Promise<{ stocks: StocksOutput } | { error: string }> {
  try {
    const result = await getStocks(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get stock data. Please try again.' };
  }
}

export async function getWeatherAction(input: WeatherInput): Promise<{ weather: WeatherOutput } | { error: string }> {
  try {
    const result = await getWeather(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get weather data. Please try again.' };
  }
}
