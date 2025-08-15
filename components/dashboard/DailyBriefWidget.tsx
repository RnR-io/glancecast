'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Wand2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type DailyBriefWidgetProps = ComponentProps<typeof Card> & {
  onGenerate: () => void;
  brief: string;
  isGenerating: boolean;
};

export default function DailyBriefWidget({ onGenerate, brief, isGenerating, className, ...props }: DailyBriefWidgetProps) {
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle>AI Daily Brief</CardTitle>
          </div>
          <Button onClick={onGenerate} disabled={isGenerating}>
            <Wand2 className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Brief'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="bg-card/50 p-4 rounded-lg min-h-[150px] text-foreground/90 prose prose-invert prose-p:my-2 prose-headings:my-3">
          {isGenerating ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : brief ? (
             <pre className="whitespace-pre-wrap font-mono text-sm">{brief}</pre>
          ) : (
            <p className="text-muted-foreground">Click "Generate Brief" to get your personalized summary for the day.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
