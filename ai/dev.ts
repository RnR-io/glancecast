import { config } from 'dotenv';
config();

import './schemas.ts';
import '@/ai/flows/generate-daily-brief.ts';
import '@/ai/flows/get-weather-flow.ts';
import '@/ai/flows/get-news-flow.ts';
import '@/ai/flows/get-stocks-flow.ts';
