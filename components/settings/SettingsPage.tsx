
'use client';

import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SettingsPageProps = {
  location: string;
  onLocationChange: (location: string) => void;
  stockSymbols: string[];
  onStocksChange: (symbols: string[]) => void;
  spotifyUrl: string;
  onSpotifyUrlChange: (url: string) => void;
};

export default function SettingsPage({
  location: initialLocation,
  onLocationChange,
  stockSymbols: initialStockSymbols,
  onStocksChange,
  spotifyUrl: initialSpotifyUrl,
  onSpotifyUrlChange,
}: SettingsPageProps) {
  const [location, setLocation] = useState(initialLocation);
  const [stocks, setStocks] = useState(initialStockSymbols.join(', '));
  const [spotifyUrl, setSpotifyUrl] = useState(initialSpotifyUrl);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    setStocks(initialStockSymbols.join(', '));
  }, [initialStockSymbols]);

  useEffect(() => {
    setSpotifyUrl(initialSpotifyUrl);
  }, [initialSpotifyUrl]);


  const handleLocationSave = () => {
    onLocationChange(location);
  };
  
  const handleStocksSave = () => {
    const symbols = stocks.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    onStocksChange(symbols);
  };

  const handleSpotifyUrlSave = () => {
    onSpotifyUrlChange(spotifyUrl);
  };


  return (
    <div className="p-4 space-y-4">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Weather Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input 
                  id="location" 
                  placeholder="e.g., New York, US" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button size="sm" onClick={handleLocationSave}>Save</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Stock Market Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
                <Label htmlFor="stocks">Stock Symbols (comma-separated)</Label>
                 <div className="flex gap-2">
                    <Input 
                        id="stocks" 
                        placeholder="e.g., AAPL, GOOGL, MSFT" 
                        value={stocks}
                        onChange={(e) => setStocks(e.target.value)}
                    />
                    <Button size="sm" onClick={handleStocksSave}>Save</Button>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Spotify Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
                <Label htmlFor="spotify-url">Spotify Playlist/Album/Artist URL</Label>
                <div className="flex gap-2">
                    <Input 
                        id="spotify-url"
                        placeholder="https://open.spotify.com/..." 
                        value={spotifyUrl}
                        onChange={(e) => setSpotifyUrl(e.target.value)}
                    />
                    <Button size="sm" onClick={handleSpotifyUrlSave}>Save</Button>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>News Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Label htmlFor="news-source">Local News Source (URL)</Label>
              <Input id="news-source" placeholder="e.g., https://news.google.com/rss/geo/..." />
              <Button size="sm">Save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
