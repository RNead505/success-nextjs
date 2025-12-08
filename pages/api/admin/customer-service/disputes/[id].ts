import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { hasDepartmentAccess } from '@/lib/departmentAuth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req }) as any;

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check department access
    if (!hasDepartmentAccess(session.user.role, session.user.primaryDepartment, 'CUSTOMER_SERVICE')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.query;

    if (req.method === 'GET') {
      const dispute = await prisma.disputes.findUnique({
        where: { id: id as string },
        include: {
          users: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      // Get status history (if you have a separate table for it)
      const statusHistory = await prisma.dispute_status_history.findMany({
        where: { disputeId: id as string },
        orderBy: { createdAt: 'desc' },
      }).catch(() => []);

      return res.status(200).json({
        dispute: {
          id: dispute.id,
          customerName: dispute.users?.name || 'Unknown',
          customerEmail: dispute.users?.email || 'Unknown',
          amount: dispute.amount || 0,
          reason: dispute.reason || 'Unknown',
          status: dispute.status || 'pending',
          createdAt: dispute.createdAt.toISOString(),
          dueDate: dispute.dueDate?.toISOString(),
          chargeId: dispute.chargeId,
          notes: dispute.notes,
          stripeDisputeId: dispute.stripeDisputeId,
          statusHistory: statusHistory.map(h => ({
            status: h.status,
            changedAt: h.createdAt.toISOString(),
            changedBy: h.changedBy,
            notes: h.notes,
          })),
        },
      });
    }

    if (req.method === 'PATCH') {
      const { status, notes } = req.body;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (notes) {
        // Append notes to existing notes
        const existing = await prisma.disputes.findUnique({
          where: { id: id as string },
          select: { notes: true },
        });
        updateData.notes = existing?.notes
          ? `${existing.notes}\n\n[${new Date().toISOString()}] ${notes}`
          : notes;
      }

      const dispute = await prisma.disputes.update({
        where: { id: id as string },
        data: updateData,
      });

      // Create status history entry if status changed
      if (status) {
        await prisma.dispute_status_history.create({
          data: {
            id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            disputeId: id as string,
            status,
            changedBy: session.user.email,
            notes,
          },
        }).catch((err) => {
          console.error('Failed to create status history:', err);
        });
      }

      // Log activity
      await prisma.staff_activity_feed.create({
        data: {
          id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: session.user.id,
          userName: session.user.name || session.user.email,
          userEmail: session.user.email,
          action: status ? 'DISPUTE_STATUS_UPDATED' : 'DISPUTE_NOTES_ADDED',
          description: status
            ? `Updated dispute status to ${status}`
            : 'Added notes to dispute',
          entityType: 'dispute',
          entityId: id as string,
          department: 'CUSTOMER_SERVICE',
        },
      });

      return res.status(200).json({
        dispute: {
          id: dispute.id,
          status: dispute.status,
          notes: dispute.notes,
        },
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error handling dispute:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
