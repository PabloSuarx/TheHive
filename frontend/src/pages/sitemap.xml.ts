import { getProducts, getCategories, getBlogs } from '../lib/strapi';

const SITE_URL = import.meta.env.SITE || 'https://thehive.pablosuarez.dev';

export async function GET() {
  const products = await getProducts();
  const categories = await getCategories();
  const blogs = await getBlogs();

  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/productos', priority: '0.9', changefreq: 'weekly' },
    { url: '/categorias', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/contacto', priority: '0.6', changefreq: 'monthly' },
    { url: '/sobre-nosotros', priority: '0.5', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
${products.map(p => `  <url>
    <loc>${SITE_URL}/producto/${p.slug}</loc>
    <lastmod>${p.updatedAt ? p.updatedAt.split('T')[0] : today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${categories.map(c => `  <url>
    <loc>${SITE_URL}/categoria/${c.slug}</loc>
    <lastmod>${c.updatedAt ? c.updatedAt.split('T')[0] : today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${blogs.map(b => `  <url>
    <loc>${SITE_URL}/blog/${b.slug}</loc>
    <lastmod>${b.updatedAt ? b.updatedAt.split('T')[0] : today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}