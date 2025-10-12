export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Return sync status information
    const syncStatus = {
      lastSync: new Date().toISOString(),
      postsCount: 0,
      categoriesCount: 0,
      videosCount: 0,
      podcastsCount: 0,
      magazinesCount: 0,
      errors: []
    };

    res.status(200).json(syncStatus);
  } catch (error) {
    console.error('Error fetching sync status:', error);
    res.status(500).json({ message: 'Failed to fetch sync status' });
  }
}
