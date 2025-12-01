import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const flags = [
      { id: '1', name: 'New Dashboard UI', description: 'Enable the redesigned admin dashboard', enabled: true, affectedUsers: 47, lastModifiedBy: 'Admin User', lastModifiedAt: new Date().toISOString() },
      { id: '2', name: 'AI Content Suggestions', description: 'Show AI-powered content recommendations', enabled: false, affectedUsers: 1247, lastModifiedBy: 'Admin User', lastModifiedAt: new Date().toISOString() },
      { id: '3', name: 'Advanced Analytics', description: 'Enable premium analytics features', enabled: true, affectedUsers: 523, lastModifiedBy: 'Admin User', lastModifiedAt: new Date().toISOString() },
      { id: '4', name: 'Beta Features', description: 'Enable experimental beta features', enabled: false, affectedUsers: 89, lastModifiedBy: 'Admin User', lastModifiedAt: new Date().toISOString() },
    ];
    return res.status(200).json({ flags, maintenanceMode: false });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
