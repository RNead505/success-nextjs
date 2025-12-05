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

    if (req.method === 'GET') {
      const {
        status,
        page = '1',
        limit = '20',
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {};

      if (status && status !== 'all') {
        where.status = status;
      }

      // Fetch disputes
      const [disputes, total] = await Promise.all([
        prisma.disputes.findMany({
          where,
          include: {
            users: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: limitNum,
          skip,
        }),
        prisma.disputes.count({ where })
      ]);

      const response = {
        disputes: disputes.map(dispute => ({
          id: dispute.id,
          customerName: dispute.users?.name || 'Unknown',
          customerEmail: dispute.users?.email || 'Unknown',
          amount: dispute.amount || 0,
          reason: dispute.reason || 'Unknown',
          status: dispute.status || 'needs_response',
          createdAt: dispute.createdAt.toISOString(),
          dueDate: dispute.dueDate?.toISOString(),
          stripeDisputeId: dispute.stripeDisputeId,
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      };

      return res.status(200).json(response);
    }

    if (req.method === 'POST') {
      const { customerEmail, chargeId, amount, reason, notes } = req.body;

      if (!customerEmail || !chargeId || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Find user by email
      const user = await prisma.users.findUnique({
        where: { email: customerEmail }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate due date (typically 7 days for Stripe disputes)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      // Create dispute
      const dispute = await prisma.disputes.create({
        data: {
          id: `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          chargeId,
          amount: parseFloat(amount),
          reason: reason || 'general',
          status: 'needs_response',
          dueDate,
          notes,
          createdBy: session.user.email,
        },
      });

      // Log activity
      await prisma.staff_activity_feed.create({
        data: {
          id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: session.user.id,
          userName: session.user.name || session.user.email,
          userEmail: session.user.email,
          action: 'DISPUTE_CREATED',
          description: `Created dispute for $${amount} - ${reason}`,
          entityType: 'dispute',
          entityId: dispute.id,
          department: 'CUSTOMER_SERVICE',
        },
      });

      return res.status(201).json({
        dispute: {
          id: dispute.id,
          amount: dispute.amount,
          reason: dispute.reason,
          status: dispute.status,
          createdAt: dispute.createdAt.toISOString(),
        },
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error handling disputes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
