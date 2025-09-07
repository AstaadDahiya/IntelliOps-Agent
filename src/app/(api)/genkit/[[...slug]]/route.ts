import {createNextHandler} from '@genkit-ai/next';
import '@/ai/dev'; // Make sure your flows are loaded

export const {GET, POST, PUT, DELETE, OPTIONS} = createNextHandler();
