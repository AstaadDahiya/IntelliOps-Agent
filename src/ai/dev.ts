import { config } from 'dotenv';
config();

import '@/ai/flows/determine-optimal-action.ts';
import '@/ai/flows/analyze-alert-and-suggest-action.ts';
import '@/ai/flows/retrieve-contextual-solutions.ts';
import '@/ai/flows/run-intelliops-agent.ts';
