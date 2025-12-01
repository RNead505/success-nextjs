import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import { prisma } from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const { enabled } = req.body;

      // Update maintenance mode in database
      await prisma.$executeRaw`
        INSERT INTO system_settings (key, value, "updatedAt", "updatedBy")
        VALUES ('maintenance_mode', ${enabled ? 'true' : 'false'}, ${new Date()}, ${session.user.email})
        ON CONFLICT (key)
        DO UPDATE SET
          value = ${enabled ? 'true' : 'false'},
          "updatedAt" = ${new Date()},
          "updatedBy" = ${session.user.email}
      `;

      // Log this critical action in audit logs
      await prisma.$executeRaw`
        INSERT INTO audit_logs ("userEmail", "userName", action, "entityType", "changes", "ipAddress", "createdAt")
        VALUES (
          ${session.user.email},
          ${session.user.name},
          ${enabled ? 'maintenance_mode.enabled' : 'maintenance_mode.disabled'},
          'System',
          ${JSON.stringify({ maintenanceMode: enabled })},
          ${req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown'},
          ${new Date()}
        )
      `;

      console.log(`Maintenance mode ${enabled ? 'enabled' : 'disabled'} by ${session.user.name}`);

      return res.status(200).json({ message: 'Maintenance mode updated', enabled });
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      return res.status(500).json({ error: 'Failed to update maintenance mode' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
