import type { APIRoute } from 'astro';
import { generateRobotsTxt } from '../lib/agent-content';
import { clinic } from '../lib/clinic';

export const GET: APIRoute = () =>
  new Response(generateRobotsTxt(clinic), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
