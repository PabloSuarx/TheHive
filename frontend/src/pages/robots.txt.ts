import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /carrito
Disallow: /checkout
Disallow: /perfil
Disallow: /login
Disallow: /registro

Sitemap: https://thehive.pablosuarez.dev/sitemap.xml`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' }
  });
};