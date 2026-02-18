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

export async function fetchAPI(endpoint, params = {}) {
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

export async function get(endpoint, params = {}) {
  const data = await fetchAPI(endpoint, params);
  // console.log(data);
  return data?.data || null;
}