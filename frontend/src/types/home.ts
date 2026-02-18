import type { Button } from "./common";

export interface Testimonial {
    author: string;
    location: string;
    rating: number;
    text: string;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface FeaturedProduct {
    name: string;
    description: string;
    price: number;
    weight: string;
    image: string;
    slug: string;
    badge?: {
        text: string;
        color: string;
    };
}

export interface Stat {
    value: string;
    label: string;
}

export interface HeroSection {
    title: string;
    description: string;
    mainImage?: {
        url: string;
        alternativeText?: string;
    };
    stat: Stat[];
    button?: Button[];
}