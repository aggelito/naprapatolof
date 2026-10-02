import type { APIRoute } from 'astro';
import { generateClinicMarkdown } from '../lib/agent-content';
import { clinic } from '../lib/clinic';

export const GET: APIRoute = () =>
  new Response(generateClinicMarkdown(clinic), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
