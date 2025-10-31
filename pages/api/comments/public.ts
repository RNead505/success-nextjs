import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Public endpoint: Get approved comments for a post
    try {
      const { postId, status = 'APPROVED' } = req.query;

      if (!postId || typeof postId !== 'string') {
        return res.status(400).json({ error: 'postId is required' });
      }

      const comments = await prisma.comment.findMany({
        where: {
          postId,
          status: status as any,
        },
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          author: true,
          authorEmail: true,
          content: true,
          status: true,
          createdAt: true,
        },
      });

      return res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  if (req.method === 'POST') {
    // Public endpoint: Submit a new comment (requires authentication)
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session?.user) {
        return res.status(401).json({ error: 'You must be signed in to comment' });
      }

      const { postId, postTitle, content } = req.body;

      if (!postId || !postTitle || !content) {
        return res.status(400).json({ error: 'postId, postTitle, and content are required' });
      }

      if (content.trim().length < 3) {
        return res.status(400).json({ error: 'Comment must be at least 3 characters' });
      }

      // Auto-approve admin comments, moderate others
      const isAdmin = session.user.role === 'ADMIN';
      const commentStatus = isAdmin ? 'APPROVED' : 'PENDING';

      const comment = await prisma.comment.create({
        data: {
          postId,
          postTitle,
          author: session.user.name || 'Anonymous',
          authorEmail: session.user.email || '',
          content: content.trim(),
          status: commentStatus,
          ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '',
          userAgent: req.headers['user-agent'] || '',
        },
      });

      // Send admin notification for pending comments
      if (commentStatus === 'PENDING') {
        await sendAdminNotification(comment);
      }

      return res.status(201).json({
        ...comment,
        message: isAdmin
          ? 'Comment posted successfully'
          : 'Your comment has been submitted and is awaiting moderation',
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Failed to submit comment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Placeholder for admin notification
async function sendAdminNotification(comment: any) {
  // TODO: Implement email notification to admin
  console.log('Admin notification: New comment pending moderation', {
    postTitle: comment.postTitle,
    author: comment.author,
    excerpt: comment.content.substring(0, 100),
  });

  // When implementing email, use SendGrid or Resend:
  // await sendEmail({
  //   to: process.env.ADMIN_EMAIL,
  //   subject: `New Comment on "${comment.postTitle}"`,
  //   html: `
  //     <p>New comment from ${comment.author} (${comment.authorEmail}):</p>
  //     <blockquote>${comment.content}</blockquote>
  //     <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/comments">Review in Admin Dashboard</a></p>
  //   `
  // });
}
