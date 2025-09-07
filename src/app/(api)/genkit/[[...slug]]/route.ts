import {nextHandler} from '@genkit-ai/next/server';
import '@/ai/dev'; // Make sure your flows are loaded

export const {GET, POST, PUT, DELETE, OPTIONS} = nextHandler();
