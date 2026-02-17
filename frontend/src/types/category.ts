import type { StrapiImage, Seo } from './common';
import type { Product } from './product';

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: StrapiImage | null;
  seo: Seo;
  products: Product[];
}