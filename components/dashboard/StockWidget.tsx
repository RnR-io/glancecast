
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart } from 'recharts';
import React from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import type { StocksOutput } from '@/ai/schemas';

type StockWidgetProps = ComponentProps<typeof Card> & {
  data: StocksOutput;
};

const chartConfig = {
  price: {
    label: "Price",
  },
} satisfies ChartConfig;

// A simple mapping for demo purposes.
const currencyToSymbol: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'JPY': '¥',
    'GBP': '£',
    'INR': '₹',
};

export default function StockWidget({ data, className, ...props }: StockWidgetProps) {
  const stockCategory = data.stockData && data.stockData[0];
  const stocks = stockCategory ? stockCategory.stocks : [];
  const categoryName = stockCategory ? stockCategory.category : 'Stocks';


  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{categoryName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {stocks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-center w-[120px]">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((stock) => {
                const chartData = stock.trend.map((value, index) => ({ day: index, price: value }));
                const isPositive = stock.changeValue >= 0;
                const currencySymbol = currencyToSymbol[stock.currency] || '$';
                return (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-bold">{stock.symbol}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{stock.price.toFixed(2)}</TableCell>
                    <TableCell className={cn('text-right font-semibold flex justify-end items-center gap-1', isPositive ? 'text-[hsl(var(--chart-1))]' : 'text-destructive')}>
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {stock.change}
                    </TableCell>
                    <TableCell>
                      <ChartContainer config={chartConfig} className="h-10 w-full">
                        <AreaChart
                          accessibilityLayer
                          data={chartData}
                          margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                          }}
                        >
                          <defs>
                              <linearGradient id={`fill-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"} stopOpacity={0.1}/>
                              </linearGradient>
                          </defs>
                          <Area
                            dataKey="price"
                            type="natural"
                            fill={`url(#fill-${stock.symbol})`}
                            stroke={isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                            stackId="a"
                          />
                        </AreaChart>
                      </ChartContainer>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No stocks to display. Add symbols in settings.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
