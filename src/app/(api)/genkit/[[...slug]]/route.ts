import {nextHandler} from '@genkit-ai/next';
import '@/ai/dev'; // Make sure your flows are loaded

export const GET = nextHandler();
export const POST = nextHandler();
export const PUT = nextHandler();
export const DELETE = nextHandler();
export const OPTIONS = nextHandler();
