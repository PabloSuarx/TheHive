import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['thehive.pablosuarez.dev', '127.0.0.1'],
  }
});