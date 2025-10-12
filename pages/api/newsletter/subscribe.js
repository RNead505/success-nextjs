import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  try {
    // Check if email already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      if (existing.status === 'UNSUBSCRIBED') {
        // Resubscribe
        await prisma.newsletterSubscriber.update({
          where: { email: email.toLowerCase() },
          data: {
            status: 'ACTIVE',
            subscribedAt: new Date(),
          },
        });
        return res.status(200).json({
          message: 'Welcome back! You have been resubscribed.',
          resubscribed: true
        });
      }
      return res.status(200).json({
        message: 'You are already subscribed!',
        alreadySubscribed: true
      });
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        status: 'ACTIVE',
        subscribedAt: new Date(),
      },
    });

    return res.status(201).json({
      message: 'Successfully subscribed! Check your email for confirmation.',
      success: true
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      message: 'Failed to subscribe. Please try again later.'
    });
  }
}
