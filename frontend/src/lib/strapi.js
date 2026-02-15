import { getSecret } from "astro:env/server";

const STRAPI_TOKEN = getSecret("STRAPI_TOKEN");
const STRAPI_URL = getSecret("STRAPI_URL");

export async function fetchAPI(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    'populate': '*',
    ...params
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_TOKEN}`
  };

  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}?${queryParams}`, {
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

export async function getButtons() {
  const response = await fetchAPI('ui-component');
  return response.data.buttons;
}