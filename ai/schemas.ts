/**
 * @fileOverview This file contains the Zod schemas and TypeScript types for the application's AI flows.
 * By centralizing schemas here, we can share them between client and server components without
 * violating the 'use server' directive.
 */

import { z } from 'zod';

// Weather Schemas
export const WeatherInputSchema = z.object({
  location: z.string().describe('The location to get the weather for.'),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

const HourlyForecastSchema = z.object({
    time: z.string(),
    temperature: z.number(),
    condition: z.string(),
});

export const WeatherOutputSchema = z.object({
  location: z.string(),
  temperature: z.number(),
  unit: z.enum(['C', 'F']),
  condition: z.string(),
  hourly: z.array(HourlyForecastSchema).describe("The hourly forecast for the next 5 hours."),
});
export type WeatherOutput = z.infer<typeof WeatherOutputSchema>;


// News Schemas
export const NewsInputSchema = z.object({
  location: z.string().describe('The location to get the news for.'),
});
export type NewsInput = z.infer<typeof NewsInputSchema>;

const NewsItemSchema = z.object({
  title: z.string(),
  source: z.string(),
  time: z.string(),
  link: z.string().url(),
});

export const NewsOutputSchema = z.array(NewsItemSchema);
export type NewsOutput = z.infer<typeof NewsOutputSchema>;


// Stocks Schemas
export const StocksInputSchema = z.object({
  symbols: z.array(z.string()).describe('A list of stock symbols to fetch data for.'),
  location: z.string().describe('The location to get the stock prices for, to determine the currency.'),
});
export type StocksInput = z.infer<typeof StocksInputSchema>;

const StockSchema = z.object({
    symbol: z.string(),
    price: z.number(),
    currency: z.string().describe('The currency of the stock price, e.g., USD, EUR, JPY.'),
    change: z.string(),
    changeValue: z.number(),
    trend: z.array(z.number()).describe('A series of recent price points to draw a small chart.'),
});

const StockCategorySchema = z.object({
    category: z.string().describe("The name of the stock category, e.g., 'My Stocks'."),
    stocks: z.array(StockSchema),
});

export const StocksOutputSchema = z.object({
    stockData: z.array(StockCategorySchema),
});
export type StocksOutput = z.infer<typeof StocksOutputSchema>;

// Daily Brief Schemas
export const GenerateDailyBriefInputSchema = z.object({
  weather: z.string().describe('Current weather information.'),
  news: z.string().describe('Latest news headlines.'),
  stocks: z.string().describe('Stock market data for selected stocks.'),
});
export type GenerateDailyBriefInput = z.infer<typeof GenerateDailyBriefInputSchema>;

export const GenerateDailyBriefOutputSchema = z.object({
  brief: z.string().describe('A personalized daily brief summarizing key information.'),
});
export type GenerateDailyBriefOutput = z.infer<typeof GenerateDailyBriefOutputSchema>;
