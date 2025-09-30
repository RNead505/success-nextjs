export async function fetchWordPressData(endpoint) {
  const API_URL = process.env.WORDPRESS_API_URL;

  if (!API_URL) {
    throw new Error("WORDPRESS_API_URL is not defined in .env.local");
  }

  const response = await fetch(`${API_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch data from endpoint: ${endpoint}`);
  }

  const data = await response.json();
  return data;
}