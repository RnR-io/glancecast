
'use client';

import React, { useState, useEffect } from 'react';
import { Settings, TerminalSquare } from 'lucide-react';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import SpotifyWidget from '@/components/dashboard/SpotifyWidget';
import NewsWidget from '@/components/dashboard/NewsWidget';
import StockWidget from '@/components/dashboard/StockWidget';
import DailyBriefWidget from '@/components/dashboard/DailyBriefWidget';
import ClockWidget from '@/components/dashboard/ClockWidget';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getDailyBrief, getNewsAction, getStocksAction, getWeatherAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import SettingsPage from '@/components/settings/SettingsPage';
import { Skeleton } from '../ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { NewsOutput, StocksOutput, WeatherOutput } from '@/ai/schemas';

const defaultSpotifyUrl = 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M';


export default function Dashboard() {
  const [brief, setBrief] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherOutput | null>(null);
  const [newsData, setNewsData] = useState<NewsOutput | null>(null);
  const [stockData, setStockData] = useState<StocksOutput | null>(null);
  const [location, setLocation] = useState<string>('');
  const [stockSymbols, setStockSymbols] = useState<string[]>(['AAPL', 'GOOGL', 'TSLA']);
  const [spotifyUrl, setSpotifyUrl] = useState<string>('');
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [isStocksLoading, setIsStocksLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const savedLocation = localStorage.getItem('glancecast-location') || 'New York';
    const savedStocks = localStorage.getItem('glancecast-stocks');
    const savedSpotifyUrl = localStorage.getItem('glancecast-spotify-url');
    
    setLocation(savedLocation);
    
    if (savedStocks) {
      setStockSymbols(JSON.parse(savedStocks));
    }
    
    setSpotifyUrl(savedSpotifyUrl || defaultSpotifyUrl);

  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
      fetchNews(location);
      fetchStocks(stockSymbols, location);
    }
  }, [location, stockSymbols]);

  const fetchWeather = async (loc: string) => {
    setIsWeatherLoading(true);
    const result = await getWeatherAction({ location: loc });
    if ('error' in result) {
      toast({
        variant: "destructive",
        title: "Error fetching weather",
        description: result.error,
      });
      setWeatherData(null);
    } else {
      setWeatherData(result.weather);
    }
    setIsWeatherLoading(false);
  };

  const fetchNews = async (loc: string) => {
    setIsNewsLoading(true);
    const result = await getNewsAction({ location: loc });
    if ('error' in result) {
        toast({ variant: "destructive", title: "Error fetching news", description: result.error });
        setNewsData(null);
    } else {
        setNewsData(result.news);
    }
    setIsNewsLoading(false);
  };

  const fetchStocks = async (symbols: string[], loc: string) => {
    if (symbols.length === 0) {
      setStockData({stockData: [{category: 'My Stocks', stocks: []}]});
      setIsStocksLoading(false);
      return;
    };
    setIsStocksLoading(true);
    const result = await getStocksAction({ symbols, location: loc });
    if ('error' in result) {
        toast({ variant: "destructive", title: "Error fetching stocks", description: result.error });
        setStockData(null);
    } else {
        setStockData(result.stocks);
    }
    setIsStocksLoading(false);
  };


  const handleLocationChange = (newLocation: string) => {
    localStorage.setItem('glancecast-location', newLocation);
    setLocation(newLocation);
  };
  
  const handleStocksChange = (newSymbols: string[]) => {
    localStorage.setItem('glancecast-stocks', JSON.stringify(newSymbols));
    setStockSymbols(newSymbols);
  };

  const handleSpotifyUrlChange = (newUrl: string) => {
    localStorage.setItem('glancecast-spotify-url', newUrl);
    setSpotifyUrl(newUrl);
  };


  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    setBrief('');
    
    if (!weatherData || !newsData || !stockData || !stockData.stockData[0]) {
        toast({
            variant: "destructive",
            title: "Missing Data",
            description: "Cannot generate brief without weather, news, and stock data.",
        });
        setIsGenerating(false);
        return;
    }

    const input = {
      weather: JSON.stringify(weatherData),
      news: JSON.stringify(newsData),
      stocks: JSON.stringify(stockData.stockData[0].stocks),
    };
    const result = await getDailyBrief(input);
    if ('error' in result) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      setBrief(result.brief);
    }
    setIsGenerating(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background p-4 font-mono">
      <header className="flex items-center justify-between p-2 border-b-2 mb-4">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground uppercase">GlanceCast v1.0</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[500px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <SettingsPage
              location={location}
              onLocationChange={handleLocationChange}
              stockSymbols={stockSymbols}
              onStocksChange={handleStocksChange}
              spotifyUrl={spotifyUrl}
              onSpotifyUrlChange={handleSpotifyUrlChange}
            />
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-grow overflow-hidden">
        <div className="grid grid-cols-12 grid-rows-2 gap-4 h-full">
            {isWeatherLoading ? (
              <Card className="col-span-4 row-span-1"><CardHeader><CardTitle>Weather</CardTitle></CardHeader><CardContent><Skeleton className="h-full w-full" /></CardContent></Card>
            ) : weatherData ? (
              <WeatherWidget data={weatherData} className="col-span-12 md:col-span-3 row-span-1" />
            ) : <Card className="col-span-12 md:col-span-3 row-span-1"><CardHeader><CardTitle>Weather</CardTitle></CardHeader><CardContent><p>Could not load weather data.</p></CardContent></Card>}
            
            <DailyBriefWidget
              className="col-span-12 md:col-span-6 row-span-1"
              onGenerate={handleGenerateBrief}
              brief={brief}
              isGenerating={isGenerating}
            />

            <ClockWidget className="col-span-12 md:col-span-3 row-span-1" location={location} />
            
            {isNewsLoading ? (
                <Card className="col-span-12 md:col-span-4 row-span-1"><CardHeader><CardTitle>News Feed</CardTitle></CardHeader><CardContent><Skeleton className="h-full w-full" /></CardContent></Card>
            ) : newsData ? (
                <NewsWidget data={newsData} className="col-span-12 md:col-span-4 row-span-1" />
            ): <Card className="col-span-12 md:col-span-4 row-span-1"><CardHeader><CardTitle>News Feed</CardTitle></CardHeader><CardContent><p>Could not load news data.</p></CardContent></Card>}

            {isStocksLoading ? (
                <Card className="col-span-12 md:col-span-4 row-span-1"><CardHeader><CardTitle>Stocks</CardTitle></CardHeader><CardContent><Skeleton className="h-full w-full" /></CardContent></Card>
            ) : stockData ? (
                <StockWidget data={stockData} className="col-span-12 md:col-span-4 row-span-1" />
            ) : <Card className="col-span-12 md:col-span-4 row-span-1"><CardHeader><CardTitle>Stocks</CardTitle></CardHeader><CardContent><p>Could not load stock data.</p></CardContent></Card>}

             <SpotifyWidget playlistUrl={spotifyUrl} className="col-span-12 md:col-span-4 row-span-1" />
        </div>
      </main>
    </div>
  );
}
