
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type SpotifyWidgetProps = ComponentProps<typeof Card> & {
    playlistUrl: string;
};

export default function SpotifyWidget({ playlistUrl, className, ...props }: SpotifyWidgetProps) {
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    updateEmbedUrl(playlistUrl);
  }, [playlistUrl]);

  const updateEmbedUrl = (urlToParse: string) => {
     try {
      if (!urlToParse) {
        setEmbedUrl('');
        return;
      }
      const url = new URL(urlToParse);
      const pathname = url.pathname;
      const parts = pathname.split('/');
      const type = parts[1];
      const id = parts[2];
      if ((type === 'playlist' || type === 'album' || type === 'artist') && id) {
        setEmbedUrl(`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`);
      } else {
        setEmbedUrl('');
      }
    } catch (error) {
      setEmbedUrl('');
    }
  }

  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between p-2">
        <div className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            <CardTitle>Spotify</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-2 p-2">
        {embedUrl ? (
            <iframe
            key={embedUrl}
            style={{ borderRadius: '0px' }}
            src={embedUrl}
            width="100%"
            height="100%"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist"
            className="flex-grow border-0"
            ></iframe>
        ) : (
            <div className="flex flex-col items-start justify-start h-full text-muted-foreground p-2 font-code">
                <p>&gt; No playlist loaded.</p>
                <p>&gt; Go to settings to enter a valid Spotify URL.</p>
                <span className="animate-pulse">_</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
