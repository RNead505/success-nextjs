import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

/**
 * Newsletter subscription endpoint
 * Creates both a newsletter subscriber and a CRM contact
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, source = 'website' } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    // Check if already subscribed
    const existing = await prisma.newsletter_subscribers.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return res.status(200).json({
          message: "You're already subscribed to our newsletter!",
          alreadySubscribed: true
        });
      } else {
        // Reactivate subscription
        await prisma.newsletter_subscribers.update({
          where: { email: email.toLowerCase() },
          data: {
            status: 'ACTIVE',
            subscribedAt: new Date(),
            unsubscribedAt: null
          }
        });

        return res.status(200).json({
          message: 'Welcome back! Your subscription has been reactivated.',
          reactivated: true
        });
      }
    }

    // Create newsletter subscriber
    await prisma.newsletter_subscribers.create({
      data: {
        id: randomUUID(),
        email: email.toLowerCase(),
        status: 'ACTIVE',
        subscribedAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // Also create/update CRM contact
    const existingContact = await prisma.contacts.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingContact) {
      // Update existing contact
      await prisma.contacts.update({
        where: { email: email.toLowerCase() },
        data: {
          firstName: firstName || existingContact.firstName,
          tags: [...new Set([...existingContact.tags, 'newsletter-subscriber'])],
          lastContactedAt: new Date()
        }
      });
    } else {
      // Create new contact
      await prisma.contacts.create({
        data: {
          id: randomUUID(),
          email: email.toLowerCase(),
          firstName: firstName || null,
          source,
          tags: ['newsletter-subscriber'],
          status: 'ACTIVE',
          updatedAt: new Date(),
        }
      });
    }

    // Optional: Send welcome email
    await sendWelcomeEmail(email, firstName);

    // Log activity
    console.log('Newsletter subscription:', {
      email,
      source,
      timestamp: new Date().toISOString()
    });

    return res.status(201).json({
      message: 'Thanks for subscribing! Check your email for confirmation.',
      success: true
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
}

/**
 * Send welcome email to new subscriber
 */
async function sendWelcomeEmail(email: string, firstName?: string) {
  try {
    // For now, just log. You can integrate with SendGrid or your email service
    console.log('Welcome email would be sent to:', email);

    // Example SendGrid integration:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to SUCCESS Magazine Newsletter',
      text: `Hi ${firstName || 'there'}! Thanks for subscribing...`,
      html: `<strong>Hi ${firstName || 'there'}!</strong><p>Thanks for subscribing...</p>`
    };

    await sgMail.send(msg);
    */
  } catch (error) {
    console.error('Welcome email error:', error);
    // Don't fail the subscription if email fails
  }
}
