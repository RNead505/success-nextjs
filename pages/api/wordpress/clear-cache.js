export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // In a real implementation, this would clear Next.js cache
    // and trigger full revalidation
    res.status(200).json({
      message: 'Cache cleared successfully',
      clearedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ message: 'Failed to clear cache' });
  }
}
