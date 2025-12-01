import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const mockLogs = [
      { id: '1', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'critical', message: 'Database connection timeout', page: '/api/posts', userAgent: 'Mozilla/5.0...', stack: 'Error: timeout\n  at connect...' },
      { id: '2', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'high', message: 'Failed to fetch WordPress data', page: '/blog/[slug]', userAgent: 'Mozilla/5.0...', stack: 'Error: fetch failed...' },
      { id: '3', timestamp: new Date(Date.now() - 10800000).toISOString(), severity: 'medium', message: 'Slow query detected (2.3s)', page: '/admin/members', userAgent: 'Mozilla/5.0...', },
      { id: '4', timestamp: new Date(Date.now() - 14400000).toISOString(), severity: 'low', message: 'Cache miss for key: posts_1', page: '/api/posts', userAgent: 'Mozilla/5.0...', },
    ];
    return res.status(200).json({ logs: mockLogs });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
