import type { APIRoute } from 'astro';
import { generateLlmsTxt } from '../lib/agent-content';
import { clinic } from '../lib/clinic';

export const GET: APIRoute = () =>
  new Response(generateLlmsTxt(clinic), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
