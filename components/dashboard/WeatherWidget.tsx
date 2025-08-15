
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CloudSun, Sun, Cloud, CloudRain } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import type { WeatherOutput } from '@/ai/schemas';

export type WeatherData = WeatherOutput;

type WeatherWidgetProps = ComponentProps<typeof Card> & {
  data: WeatherData;
};

const weatherIcons: { [key: string]: React.ElementType } = {
  Sunny: Sun,
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Default: CloudSun,
};

function getWeatherIcon(condition: string) {
    const Icon = Object.keys(weatherIcons).find(key => condition.toLowerCase().includes(key.toLowerCase()));
    return weatherIcons[Icon || 'Default'];
}

export default function WeatherWidget({ data, className, ...props }: WeatherWidgetProps) {
  const MainIcon = getWeatherIcon(data.condition);

  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Weather</CardTitle>
        <CloudSun className="w-6 h-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="flex items-center justify-around text-center p-4 rounded-lg bg-card/50 h-full mb-4">
          <div>
            <MainIcon className="w-16 h-16 mx-auto text-primary" />
          </div>
          <div>
            <p className="text-4xl font-bold">{data.temperature}°{data.unit}</p>
            <p className="text-muted-foreground">{data.condition}</p>
            <p className="font-semibold">{data.location}</p>
          </div>
        </div>
        <Separator />
        <div className="mt-4">
            <h4 className="text-center font-bold mb-2">5-Hour Forecast</h4>
            <div className="flex justify-around text-center">
                {data.hourly.map((hour, index) => {
                    const HourIcon = getWeatherIcon(hour.condition);
                    return (
                        <div key={index} className="flex flex-col items-center gap-1">
                            <p className="text-sm font-medium">{hour.time}</p>
                            <HourIcon className="w-8 h-8 text-primary" />
                            <p className="text-lg font-bold">{hour.temperature}°</p>
                        </div>
                    )
                })}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
