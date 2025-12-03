import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]';
import { prisma } from '../../../../../../lib/prisma';
import { sendCampaignEmail, sendEmailBatch } from '../../../../../../lib/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid campaign ID' });
  }

  try {
    // Get campaign with template
    const campaign = await prisma.campaigns.findUnique({
      where: { id },
      include: {
        email_templates: true,
        campaign_contacts: {
          include: {
            contacts: true,
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (!campaign.email_templates) {
      return res.status(400).json({ error: 'Campaign has no email template' });
    }

    if (campaign.status === 'SENT') {
      return res.status(400).json({ error: 'Campaign has already been sent' });
    }

    // Get all contacts for this campaign
    const contacts = campaign.campaign_contacts.map(cc => cc.contacts);

    if (contacts.length === 0) {
      return res.status(400).json({ error: 'No contacts in this campaign' });
    }

    const htmlTemplate = campaign.email_templates.html;
    const subject = campaign.subject;

    // Create email sending tasks
    const emailTasks = contacts.map((contact) => {
      return async () => {
        const result = await sendCampaignEmail(contact, subject, htmlTemplate);

        // Log the email event
        if (result.success) {
          await prisma.email_events.create({
            data: {
              id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              campaignId: id,
              contactId: contact.id,
              emailAddress: contact.email,
              event: 'sent',
              eventData: {},
            },
          });
        }

        return result;
      };
    });

    // Send in batches of 100 with 1 second delay
    const { sentCount, failedCount, errors } = await sendEmailBatch(emailTasks, 100, 1000);

    // Update campaign with stats
    await prisma.campaigns.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        sentCount,
        failedCount,
        sendErrors: errors.length > 0 ? errors : null,
      },
    });

    // Log activity
    await prisma.activity_logs.create({
      data: {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        action: 'SEND_CAMPAIGN',
        entity: 'campaign',
        entityId: id,
        details: JSON.stringify({
          name: campaign.name,
          sentCount,
          failedCount,
          totalContacts: contacts.length,
        }),
      },
    });

    return res.status(200).json({
      success: true,
      sentCount,
      failedCount,
      totalContacts: contacts.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : [], // Return first 10 errors only
    });
  } catch (error: any) {
    console.error('Error sending campaign:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
