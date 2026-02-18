export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    small: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  focalPoint: { x: number; y: number } | null;
}

export interface Seo {
  id: number;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalURL: string | null;
  noIndex: boolean;
  noFollow: boolean;
}

export interface Button {
  id: number;
  content: string;
  link: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
  isExternal: boolean;
}
