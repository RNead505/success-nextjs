import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import { prisma } from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { enabled } = req.body;

      // Update the feature flag in database
      await prisma.$executeRaw`
        UPDATE feature_flags
        SET
          enabled = ${enabled},
          "lastModifiedBy" = ${session.user.email},
          "lastModifiedAt" = ${new Date()}
        WHERE id = ${id as string}
      `;

      // Log this action in audit logs
      await prisma.$executeRaw`
        INSERT INTO audit_logs ("userEmail", "userName", action, "entityType", "entityId", "changes", "ipAddress", "createdAt")
        VALUES (
          ${session.user.email},
          ${session.user.name},
          ${enabled ? 'feature_flag.enabled' : 'feature_flag.disabled'},
          'FeatureFlag',
          ${id as string},
          ${JSON.stringify({ enabled })},
          ${req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown'},
          ${new Date()}
        )
      `;

      console.log(`Feature flag ${id} ${enabled ? 'enabled' : 'disabled'} by ${session.user.name}`);

      return res.status(200).json({ message: 'Feature flag updated' });
    } catch (error) {
      console.error('Error updating feature flag:', error);
      return res.status(500).json({ error: 'Failed to update feature flag' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
