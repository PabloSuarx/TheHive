import { getSecret } from "astro:env/server";

const STRAPI_TOKEN = getSecret("STRAPI_TOKEN");
const STRAPI_URL = getSecret("STRAPI_URL");

function buildQuery(params, prefix = '') {
  const parts = [];

  for (const [key, value] of Object.entries(params)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      parts.push(buildQuery(value, fullKey));
    } else {
      parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
    }
  }

  return parts.filter(Boolean).join('&');
}

export async function fetchAPI(endpoint, params = { populate: '*' }) {
  const queryString = buildQuery(params);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_TOKEN}`
  };

  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}?${queryString}`, {
      headers: headers
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`HTTP error! status: ${response.status}`);
      console.error('Error details:', errorData); 
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function getSiteConfig() {
  const data = await fetchAPI('site-config');
  return data.data;
}

export async function getNavigation() {
  const data = await fetchAPI('navigation');
  return data.data;
}

export async function getFooter() {
  const data = await fetchAPI('footer');
  return data.data;
}

let cachedButtons = null;

export async function getButtons() {
  if (cachedButtons) return cachedButtons;
  const response = await fetchAPI('ui-component');
  cachedButtons = response.data.buttons;
  return cachedButtons;
}

export async function getCategories() {
  const response = await fetchAPI('categories');
  return response?.data || [];
}

export async function getCategoryBySlug(slug) {
  const response = await fetchAPI('categories', {
    filters: { slug: { $eq: slug } },
    populate: {
      image: true,
      seo: true,
      products: {
        populate: {
          mainImage: true,
          category: true
        }
      }
    }
  });
  return response?.data?.[0] || null;
}

export async function getProducts() {
  const response = await fetchAPI('products', {
    populate: {
      mainImage: true,
      category: true,
      tags: true
    }
  });
  return response?.data || [];
}

export async function getFeaturedProducts() {
  const response = await fetchAPI('products', {
    filters: { featured: { $eq: true } },
    populate: {
      mainImage: true,
      category: true
    }
  });
  return response?.data || [];
}

export async function getProductBySlug(slug) {
  const response = await fetchAPI('products', {
    filters: { slug: { $eq: slug } },
    populate: {
      mainImage: true,
      images: true,
      category: true,
      tags: true,
      seo: true,
      reviews: true
    }
  });
  return response?.data?.[0] || null;
}

export async function getBlogs() {
  const response = await fetchAPI('blogs', {
    populate: {
      featuredImage: true,
      blog_category: true,
      tags: true
    },
    sort: { blogPublishedAt: 'desc' }
  });
  return response?.data || [];
}

export async function getBlogCategories() {
  const response = await fetchAPI('blog-categories');
  return response?.data || [];
}

export async function getBlogBySlug(slug) {
  const response = await fetchAPI('blogs', {
    filters: { slug: { $eq: slug } },
    populate: {
      featuredImage: true,
      blog_category: true,
      tags: true,
      seo: true
    }
  });
  return response?.data?.[0] || null;
}

// ---- PRODUCTOS ----

export async function getProducts() {
  const response = await fetchAPI('products', {
    populate: {
      mainImage: true,
      category: true,
      tags: true
    }
  });
  return response?.data || [];
}

export async function getFeaturedProducts() {
  const response = await fetchAPI('products', {
    filters: { featured: { $eq: true } },
    populate: {
      mainImage: true,
      category: true
    }
  });
  return response?.data || [];
}

export async function getProductBySlug(slug) {
  const response = await fetchAPI('products', {
    filters: { slug: { $eq: slug } },
    populate: {
      mainImage: true,
      images: true,
      category: true,
      tags: true,
      seo: true,
      reviews: true
    }
  });
  return response?.data?.[0] || null;
}

// ---- BLOG ----

export async function getBlogs() {
  const response = await fetchAPI('blogs', {
    populate: {
      featuredImage: true,
      blog_category: true,
      tags: true
    },
    sort: { blogPublishedAt: 'desc' }
  });
  return response?.data || [];
}

export async function getBlogCategories() {
  const response = await fetchAPI('blog-categories');
  return response?.data || [];
}

export async function getBlogBySlug(slug) {
  const response = await fetchAPI('blogs', {
    filters: { slug: { $eq: slug } },
    populate: {
      featuredImage: true,
      blog_category: true,
      tags: true,
      seo: true
    }
  });
  return response?.data?.[0] || null;
}


