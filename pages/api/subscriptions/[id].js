import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      return getSubscription(req, res, id);
    case 'DELETE':
      return cancelSubscription(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getSubscription(req, res, id) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function cancelSubscription(req, res, id) {
  try {
    // Update subscription status to CANCELED
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELED',
        cancelAtPeriodEnd: true,
      },
    });

    // In a real implementation, you would also cancel the Stripe subscription here
    // using the stripeSubscriptionId

    return res.status(200).json({
      message: 'Subscription canceled successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
