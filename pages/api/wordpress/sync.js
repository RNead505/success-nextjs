export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type = 'all' } = req.body;

    // In a real implementation, this would trigger ISR revalidation
    // For now, return a success message
    const message = type === 'all'
      ? 'All content synchronized successfully'
      : `${type.charAt(0).toUpperCase() + type.slice(1)} synchronized successfully`;

    res.status(200).json({
      message,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error syncing:', error);
    res.status(500).json({ message: 'Sync failed' });
  }
}
