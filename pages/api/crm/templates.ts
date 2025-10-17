import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const templates = await prisma.emailTemplate.findMany({
        include: {
          _count: {
            select: {
              campaigns: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(templates);
    }

    if (req.method === 'POST') {
      const { name, subject, content, isDefault } = req.body;

      if (!name || !subject || !content) {
        return res.status(400).json({ message: 'Name, subject, and content are required' });
      }

      // If this is set as default, unset all other defaults
      if (isDefault) {
        await prisma.emailTemplate.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const template = await prisma.emailTemplate.create({
        data: {
          name,
          subject,
          content,
          isDefault: isDefault || false,
        },
      });

      return res.status(201).json(template);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in templates API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
