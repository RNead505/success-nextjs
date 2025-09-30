import { fetchWordPressData } from '../../lib/wordpress';

export default async function handler(req, res) {
  try {
    const posts = await fetchWordPressData('posts?_embed');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
}