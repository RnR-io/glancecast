
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlarmClock, Timer, Play, Pause, RotateCcw } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type ClockWidgetProps = ComponentProps<typeof Card> & {
    location?: string;
};

// A simple mapping for demo purposes. In a real app, you'd use a more robust library.
const locationToTimeZone: Record<string, string> = {
    'New York': 'America/New_York',
    'London': 'Europe/London',
    'Tokyo': 'Asia/Tokyo',
    'India': 'Asia/Kolkata',
    'UAE': 'Asia/Dubai'
};

export default function ClockWidget({ className, location, ...props }: ClockWidgetProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [timer, setTimer] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [remaining, setRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateClock = () => setTime(new Date());
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/timer-done.mp3');
    }
  }, []);

  useEffect(() => {
    if (isActive && remaining > 0) {
      timerId.current = setInterval(() => {
        setRemaining(r => r - 1);
      }, 1000);
    } else if (remaining === 0 && isActive) {
      setIsActive(false);
      if(audioRef.current) {
        audioRef.current.play();
      }
      if (timerId.current) clearInterval(timerId.current);
    }

    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, [isActive, remaining]);

  const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTimer(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const startTimer = () => {
    const totalSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
    if (totalSeconds > 0) {
      setRemaining(totalSeconds);
      setIsActive(true);
    }
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setRemaining(0);
    if (timerId.current) clearInterval(timerId.current);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getTimeForLocation = (loc?: string) => {
      if (!time) return '00:00 AM';
      try {
        const timeZone = loc ? locationToTimeZone[loc] : undefined;
        return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone });
      } catch (e) {
          // Fallback to local time if timezone is invalid
        return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      }
  }

  const getFormattedDate = () => {
      if (!time) return '';
      return time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <AlarmClock className="w-6 h-6 text-primary" />
                <CardTitle>Clock</CardTitle>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="text-center bg-card/50 p-4 rounded-lg mb-4 space-y-2">
          <div>
            <p className="text-6xl font-bold tracking-widest">
              {getTimeForLocation(location)}
            </p>
            <p className="text-muted-foreground">{location || 'Local Time'}</p>
            <p className="text-sm text-foreground/80">{getFormattedDate()}</p>
          </div>
          <div className="pt-2 border-t border-border/50">
            <p className="text-2xl font-bold tracking-wider">
                {getTimeForLocation('UAE')}
            </p>
            <p className="text-xs text-muted-foreground">UAE Time</p>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Timer</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col items-center justify-center bg-card/50 p-4 rounded-lg">
                        {remaining > 0 || isActive ? (
                        <p className="text-4xl font-bold tracking-widest mb-4">
                            {formatTime(remaining)}
                        </p>
                        ) : (
                        <div className="flex items-center gap-2 mb-4">
                            <Input type="number" name="hours" value={timer.hours} onChange={handleTimerChange} className="w-20 text-center" min="0" />
                            <span>:</span>
                            <Input type="number" name="minutes" value={timer.minutes} onChange={handleTimerChange} className="w-20 text-center" min="0" max="59" />
                            <span>:</span>
                            <Input type="number" name="seconds" value={timer.seconds} onChange={handleTimerChange} className="w-20 text-center" min="0" max="59" />
                        </div>
                        )}

                        <div className="flex gap-2">
                            {isActive && remaining > 0 ? (
                            <Button onClick={togglePause} variant="outline" size="icon"><Pause /></Button>
                            ) : (
                            <Button onClick={isActive ? togglePause : startTimer} variant="outline" size="icon"><Play /></Button>
                            )}
                            <Button onClick={resetTimer} variant="destructive" size="icon"><RotateCcw /></Button>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

      </CardContent>
    </Card>
  );
}
