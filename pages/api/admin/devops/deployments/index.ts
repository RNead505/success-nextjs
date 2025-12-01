import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      // Mock deployment data - in production, this would come from Vercel API or your deployment system
      const deployments = [
        {
          id: '1',
          version: 'v1.2.3',
          branch: 'main',
          commit: 'a1b2c3d4e5f6g7h8i9j0',
          deployedBy: 'Admin User',
          deployedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          environment: 'production',
        },
        {
          id: '2',
          version: 'v1.2.2',
          branch: 'main',
          commit: 'b2c3d4e5f6g7h8i9j0k1',
          deployedBy: 'Admin User',
          deployedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          environment: 'production',
        },
        {
          id: '3',
          version: 'v1.2.1',
          branch: 'main',
          commit: 'c3d4e5f6g7h8i9j0k1l2',
          deployedBy: 'Admin User',
          deployedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          environment: 'production',
        },
      ];

      return res.status(200).json({
        deployments,
        currentVersion: 'v1.2.3',
      });
    } catch (error) {
      console.error('Error fetching deployments:', error);
      return res.status(500).json({ error: 'Failed to fetch deployments' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
