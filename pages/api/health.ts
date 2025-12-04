import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
    },
    git: {
      // This will be set during build
      commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    },
  };

  res.status(200).json(health);
}
