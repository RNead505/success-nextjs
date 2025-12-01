import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import { prisma } from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch real feature flags from database
      const flags = await prisma.$queryRaw<any[]>`
        SELECT
          id,
          name,
          description,
          enabled,
          "affectedUsers",
          "lastModifiedBy",
          "lastModifiedAt",
          "createdAt"
        FROM feature_flags
        ORDER BY "createdAt" DESC
      `;

      // Get maintenance mode from system_settings
      const maintenanceSettings = await prisma.$queryRaw<any[]>`
        SELECT value
        FROM system_settings
        WHERE key = 'maintenance_mode'
        LIMIT 1
      `;

      const maintenanceMode = maintenanceSettings[0]?.value === 'true';

      return res.status(200).json({
        flags: flags.map(flag => ({
          id: flag.id,
          name: flag.name,
          description: flag.description,
          enabled: flag.enabled,
          affectedUsers: Number(flag.affectedUsers),
          lastModifiedBy: flag.lastModifiedBy || session.user.name,
          lastModifiedAt: flag.lastModifiedAt?.toISOString() || flag.createdAt?.toISOString()
        })),
        maintenanceMode
      });
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      return res.status(500).json({ error: 'Failed to fetch feature flags' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
