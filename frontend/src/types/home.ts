
export interface Testimonial {
    author: string;
    location: string;
    rating: number; // 1-5
    text: string;
}

export interface Feature {
    icon: string; // Emoji for now, or could be an icon name
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
    stats: Stat[];
    ctaButton?: {
        text: string;
        url: string;
    };
}
