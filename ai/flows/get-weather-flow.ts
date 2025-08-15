
'use server';
/**
 * @fileOverview A flow for fetching weather data using Google's AI.
 *
 * - getWeather - A function that handles the weather fetching process.
 * - WeatherInput - The input type for the getWeather function.
 * - WeatherOutput - The return type for the getWeather function.
 */

import { ai } from '@/ai/genkit';
import { WeatherInputSchema, WeatherOutputSchema, type WeatherInput, type WeatherOutput } from '@/ai/schemas';

export async function getWeather(input: WeatherInput): Promise<{ weather: WeatherOutput } | { error: string }> {
    try {
        const weather = await getWeatherFlow(input);
        return { weather };
    } catch(e: any) {
        return { error: e.message || "Failed to get weather" };
    }
}

const getWeatherFlow = ai.defineFlow(
  {
    name: 'getWeatherFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
        prompt: `Get the current weather and a 5-hour forecast for ${input.location}.`,
        model: 'googleai/gemini-2.0-flash',
        output: {
            schema: WeatherOutputSchema,
        }
    });

    const weatherData = llmResponse.output;
    if (!weatherData) {
        throw new Error('Could not get weather data from AI.');
    }
    return weatherData;
  }
);
