import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

/**
 * Get the current session on the server side
 * Use this in API routes and getServerSideProps
 */
export async function getSession(req, res) {
  return await getServerSession(req, res, authOptions);
}

/**
 * Require authentication for an API route
 * Returns the session if authenticated, otherwise sends 401 response
 */
export async function requireAuth(req, res) {
  const session = await getSession(req, res);

  if (!session) {
    res.status(401).json({
      message: 'Unauthorized. Please sign in to access this resource.'
    });
    return null;
  }

  return session;
}

/**
 * Require specific role(s) for an API route
 * Returns the session if authorized, otherwise sends 403 response
 */
export async function requireRole(req, res, allowedRoles = []) {
  const session = await requireAuth(req, res);

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.user.role)) {
    res.status(403).json({
      message: 'Forbidden. You do not have permission to access this resource.',
      requiredRoles: allowedRoles,
      yourRole: session.user.role
    });
    return null;
  }

  return session;
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(session) {
  return session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'ADMIN';
}

/**
 * Check if user has editor or higher privileges
 */
export function canEdit(session) {
  const editRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  return editRoles.includes(session?.user?.role);
}
