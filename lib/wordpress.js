export async function fetchWordPressData(endpoint, retries = 3, delay = 1000) {
  const API_URL = process.env.WORDPRESS_API_URL;

  if (!API_URL) {
    throw new Error("WORDPRESS_API_URL is not defined in .env.local");
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        headers: {
          'User-Agent': 'SUCCESS-Next.js',
        },
      });

      if (!response.ok) {
        // If rate limited or server error, retry
        if (response.status === 429 || response.status >= 500) {
          if (attempt < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
            continue;
          }
        }
        throw new Error(`Failed to fetch data from endpoint: ${endpoint} (Status: ${response.status})`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
    }
  }
}