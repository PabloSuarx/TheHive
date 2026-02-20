import type { StrapiImage, Seo } from './common';

export interface BlogCategory {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface Tag {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface Blog {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    blogPublishedAt: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    featuredImage: StrapiImage | null;
    blog_category: BlogCategory | null;
    tags: Tag[];
    seo: Seo;
    readingTime?: number;
}
