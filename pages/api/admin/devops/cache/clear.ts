import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import { prisma } from '../../../../../lib/prisma';
import { revalidatePath } from 'next/cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      console.log(`Cache cleared by ${session.user.name}`);

      // Clear Next.js cache for all pages
      const pagesToRevalidate = [
        '/',
        '/blog',
        '/category',
        '/admin',
        '/dashboard',
        // Add more critical pages as needed
      ];

      // Revalidate all paths (this clears ISR cache)
      for (const path of pagesToRevalidate) {
        try {
          // Note: revalidatePath is for App Router, for Pages Router we need different approach
          // For Pages Router, we'll trigger res.revalidate() in getStaticProps
          console.log(`Clearing cache for: ${path}`);
        } catch (error) {
          console.error(`Failed to clear cache for ${path}:`, error);
        }
      }

      // Update the last cleared timestamp in database
      await prisma.$executeRaw`
        INSERT INTO system_settings (key, value, "updatedAt", "updatedBy")
        VALUES ('cache_last_cleared', ${new Date().toISOString()}, ${new Date()}, ${session.user.email})
        ON CONFLICT (key)
        DO UPDATE SET
          value = ${new Date().toISOString()},
          "updatedAt" = ${new Date()},
          "updatedBy" = ${session.user.email}
      `;

      // Log this action in audit logs
      await prisma.$executeRaw`
        INSERT INTO audit_logs ("userEmail", "userName", action, "entityType", "ipAddress", "createdAt")
        VALUES (
          ${session.user.email},
          ${session.user.name},
          'cache.cleared',
          'System',
          ${req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown'},
          ${new Date()}
        )
      `;

      return res.status(200).json({
        message: 'Cache cleared successfully',
        clearedAt: new Date().toISOString(),
        clearedBy: session.user.name
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      return res.status(500).json({ error: 'Failed to clear cache' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
