import { NextApiRequest, NextApiResponse } from 'next';
import { fetchWordPressData } from '../../../lib/wordpress';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { per_page = '50', page = '1', search = '', categories = '' } = req.query;

    let endpoint = `posts?_embed&per_page=${per_page}&page=${page}`;

    if (search) {
      endpoint += `&search=${encodeURIComponent(search as string)}`;
    }

    if (categories) {
      endpoint += `&categories=${categories}`;
    }

    const data = await fetchWordPressData(endpoint);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({
      error: 'Failed to fetch posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
