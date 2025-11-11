/**
 * Preview API - Generate preview URL for draft posts
 * Allows viewing unpublished posts as they will appear on frontend
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Only allow authenticated users to preview
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Set preview cookie and redirect to preview page
  res.setPreviewData({
    postId: id,
    userId: session.user?.email,
  });

  // Redirect to preview page with preview mode enabled
  res.redirect(`/preview/post/${id}`);
}
