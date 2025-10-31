/**
 * Email utility for sending transactional emails
 *
 * To use SendGrid:
 * 1. npm install @sendgrid/mail
 * 2. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL in .env.local
 *
 * To use Resend:
 * 1. npm install resend
 * 2. Set RESEND_API_KEY in .env.local
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using configured email service
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  // Check which email service is configured
  const useSendGrid = !!process.env.SENDGRID_API_KEY;
  const useResend = !!process.env.RESEND_API_KEY;

  if (!useSendGrid && !useResend) {
    console.log('[EMAIL PLACEHOLDER] Would send email:', { to, subject });
    console.log('[EMAIL PLACEHOLDER] HTML:', html.substring(0, 200) + '...');
    return false;
  }

  try {
    if (useSendGrid) {
      return await sendViaSendGrid({ to, subject, html, text });
    } else if (useResend) {
      return await sendViaResend({ to, subject, html, text });
    }
    return false;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send via SendGrid
 */
async function sendViaSendGrid({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const recipients = Array.isArray(to) ? to : [to];

    await sgMail.send({
      to: recipients,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
    });

    console.log('[SendGrid] Email sent successfully to:', recipients);
    return true;
  } catch (error) {
    console.error('[SendGrid] Error:', error);
    return false;
  }
}

/**
 * Send via Resend
 */
async function sendViaResend({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const recipients = Array.isArray(to) ? to : [to];

    await resend.emails.send({
      from: `SUCCESS Magazine <${process.env.RESEND_FROM_EMAIL || 'noreply@success.com'}>`,
      to: recipients,
      subject,
      html,
      text,
    });

    console.log('[Resend] Email sent successfully to:', recipients);
    return true;
  } catch (error) {
    console.error('[Resend] Error:', error);
    return false;
  }
}

/**
 * Email templates
 */

export function getWelcomeEmailHTML(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d32f2f; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #d32f2f; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SUCCESS Magazine!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name || 'there'}!</h2>
            <p>Thanks for subscribing to our newsletter. You'll receive weekly inspiration, success tips, and exclusive content delivered straight to your inbox.</p>
            <p>Here's what you can expect:</p>
            <ul>
              <li>Weekly success stories and interviews</li>
              <li>Actionable tips for personal and professional growth</li>
              <li>Exclusive content and early access to new features</li>
            </ul>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">Visit SUCCESS Magazine</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SUCCESS Magazine. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getSubscriptionConfirmationHTML(name: string, plan: string, amount: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #d32f2f; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Subscription Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Welcome to SUCCESS+, ${name}!</h2>
            <p>Your subscription is now active. You have full access to all premium content, videos, podcasts, and digital magazines.</p>
            <div class="details">
              <strong>Subscription Details:</strong>
              <p>Plan: <strong>${plan}</strong></p>
              <p>Amount: <strong>$${amount}</strong></p>
            </div>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account" class="button">Manage Your Subscription</a>
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SUCCESS Magazine. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPaymentFailedHTML(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #d32f2f; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Failed</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We were unable to process your recent payment for your SUCCESS+ subscription.</p>
            <p>To continue enjoying premium content, please update your payment method:</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/billing" class="button">Update Payment Method</a>
            <p>If you need assistance, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SUCCESS Magazine. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getContactFormAdminNotificationHTML(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d32f2f; color: white; padding: 20px; }
          .content { padding: 20px; background: #f9fafb; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #6b7280; }
          .value { margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            ${data.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
              </div>
            ` : ''}
            ${data.company ? `
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${data.company}</div>
              </div>
            ` : ''}
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${data.subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
