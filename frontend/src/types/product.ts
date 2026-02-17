import type { StrapiImage } from './common';
import type { Category } from './category';


export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  origin: string;
  beekeeper: string;
  crystallization: string;
  harvestSeason: string;
  flavorNotes: string | null;
  benefits: string | null;
  organic: boolean;
  featured: boolean;
  stock: number;
  rating: number | null;
  productpublishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  weightValue: number | null;
  weightUnit: string | null;
  mainImage: StrapiImage | null;
  category: Category;
  reviews: Review[];
  tags?: Tag[];
}

export interface Review {
  id: number;
  userName?: string;
  rating?: number;
  comment?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}
