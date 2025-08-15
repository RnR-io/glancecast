
'use server';
/**
 * @fileOverview A flow for fetching stock data using Google's AI.
 *
 * - getStocks - A function that handles the stock fetching process.
 * - StocksInput - The input type for the getStocks function.
 * - StocksOutput - The return type for the getStocks function.
 */

import { ai } from '@/ai/genkit';
import { StocksInputSchema, StocksOutputSchema, type StocksInput, type StocksOutput } from '@/ai/schemas';

export async function getStocks(input: StocksInput): Promise<{ stocks: StocksOutput } | { error: string }> {
    try {
        const stocks = await getStocksFlow(input);
        return { stocks };
    } catch(e: any) {
        return { error: e.message || "Failed to get stocks" };
    }
}

const getStocksFlow = ai.defineFlow(
  {
    name: 'getStocksFlow',
    inputSchema: StocksInputSchema,
    outputSchema: StocksOutputSchema,
  },
  async ({ symbols, location }) => {
    if (symbols.length === 0) {
      return { stockData: [{ category: 'My Stocks', stocks: [] }] };
    }
    const llmResponse = await ai.generate({
        prompt: `Get the latest stock data for the following symbols: ${symbols.join(', ')}. The user is in ${location}, so provide the prices in the local currency. Include a trend for the last 5 hours. Categorize the output under 'My Stocks'.`,
        model: 'googleai/gemini-2.0-flash',
        output: {
            schema: StocksOutputSchema,
        }
    });

    const stockData = llmResponse.output;
    if (!stockData) {
        throw new Error('Could not get stock data from AI.');
    }
    
    // The AI might return an empty object if it fails, so we need to handle that.
    if ((!stockData.stockData || stockData.stockData.length === 0) && symbols.length > 0) {
        // We will construct a dummy response to indicate failure for the given symbols
        const failedData = {
            category: 'My Stocks',
            stocks: symbols.map(symbol => ({
                symbol: symbol,
                price: 0,
                currency: "USD",
                change: "N/A",
                changeValue: 0,
                trend: [0,0,0,0,0],
            }))
        };
        return { stockData: [failedData] };
    }

    return stockData;
  }
);
