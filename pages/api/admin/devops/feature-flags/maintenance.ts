import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    const { enabled } = req.body;
    console.log(`Maintenance mode ${enabled ? 'enabled' : 'disabled'} by ${session.user.name}`);
    return res.status(200).json({ message: 'Maintenance mode updated' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
