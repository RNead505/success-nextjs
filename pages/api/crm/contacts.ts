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
      const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(contacts);
    }

    if (req.method === 'POST') {
      const { email, firstName, lastName, phone, company, tags, source } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Check if contact already exists
      const existingContact = await prisma.contact.findUnique({
        where: { email },
      });

      if (existingContact) {
        return res.status(400).json({ message: 'Contact with this email already exists' });
      }

      const contact = await prisma.contact.create({
        data: {
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          phone: phone || null,
          company: company || null,
          tags: tags || [],
          source: source || 'manual',
          status: 'ACTIVE',
        },
      });

      return res.status(201).json(contact);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in contacts API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
