import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const { deploymentId } = req.body;

      // Log the rollback action
      console.log(`Rollback initiated by ${session.user.name} for deployment ${deploymentId}`);

      // In production, this would trigger a Vercel rollback or redeployment
      // For now, we'll simulate a successful rollback

      // Simulate rollback delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      return res.status(200).json({
        message: 'Rollback initiated successfully',
        deploymentId,
        status: 'in_progress',
      });
    } catch (error) {
      console.error('Error initiating rollback:', error);
      return res.status(500).json({ error: 'Failed to initiate rollback' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
