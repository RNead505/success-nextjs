import { buffer } from 'micro';
import { stripe } from '../../../lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  if (!stripe) {
    console.error('Stripe is not configured');
    return res.status(500).json({ message: 'Stripe not configured' });
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription) {
  const customerId = subscription.customer;

  // Find user by Stripe customer ID
  const user = await prisma.users.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Create or update subscription record
  await prisma.subscriptions.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status.toUpperCase(),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status.toUpperCase(),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log('Subscription created for user:', user.id);
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;

  const user = await prisma.users.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await prisma.subscriptions.update({
    where: { userId: user.id },
    data: {
      status: subscription.status.toUpperCase(),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log('Subscription updated for user:', user.id);
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;

  const user = await prisma.users.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await prisma.subscriptions.update({
    where: { userId: user.id },
    data: {
      status: 'CANCELED',
      cancelAtPeriodEnd: false,
    },
  });

  console.log('Subscription deleted for user:', user.id);
}

// Handle successful payment
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;

  const user = await prisma.users.findFirst({
    where: { stripeCustomerId: customerId },
    include: { subscriptions: true },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Send confirmation email
  const { sendEmail, getSubscriptionConfirmationHTML } = require('../../../lib/email');
  const amount = (invoice.amount_paid / 100).toFixed(2);
  const plan = user.subscriptions?.stripePriceId || 'SUCCESS+';

  await sendEmail({
    to: user.email,
    subject: 'Payment Successful - SUCCESS+ Subscription',
    html: getSubscriptionConfirmationHTML(user.name || 'Subscriber', plan, amount),
  });

  console.log('Payment succeeded and email sent for user:', user.id);
}

// Handle failed payment
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  const user = await prisma.users.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await prisma.subscriptions.update({
    where: { userId: user.id },
    data: {
      status: 'PAST_DUE',
    },
  });

  // Send payment failed email
  const { sendEmail, getPaymentFailedHTML } = require('../../../lib/email');

  await sendEmail({
    to: user.email,
    subject: 'Payment Failed - Action Required',
    html: getPaymentFailedHTML(user.name || 'Subscriber'),
  });

  console.log('Payment failed and email sent for user:', user.id);
}
