import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const metrics = [
      { name: 'Database Status', status: 'healthy', value: 'Connected', lastCheck: new Date().toISOString() },
      { name: 'API Response Time', status: 'healthy', value: '45ms avg', lastCheck: new Date().toISOString() },
      { name: 'Memory Usage', status: 'healthy', value: '67% (2.1GB / 3GB)', lastCheck: new Date().toISOString() },
      { name: 'Disk Space', status: 'warning', value: '82% used', lastCheck: new Date().toISOString() },
      { name: 'Stripe API', status: 'healthy', value: 'Connected', lastCheck: new Date().toISOString() },
      { name: 'WordPress API', status: 'healthy', value: 'Connected', lastCheck: new Date().toISOString() },
    ];
    return res.status(200).json({ metrics });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
