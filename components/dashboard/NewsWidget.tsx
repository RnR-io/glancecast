'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Newspaper } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import type { NewsOutput } from '@/ai/schemas';

type NewsWidgetProps = ComponentProps<typeof Card> & {
  data: NewsOutput;
};

export default function NewsWidget({ data, className, ...props }: NewsWidgetProps) {
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">News Feed</CardTitle>
        <Newspaper className="w-6 h-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
         <ScrollArea className="h-72 flex-grow">
          <div className="space-y-4">
            {data.map((item, index) => (
              <a 
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer" 
                className="block p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-base">{item.title}</h3>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>{item.source}</span>
                  <span>{item.time}</span>
                </div>
              </a>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
