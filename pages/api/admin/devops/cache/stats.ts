import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      size: '124 MB',
      entries: 3847,
      lastCleared: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
