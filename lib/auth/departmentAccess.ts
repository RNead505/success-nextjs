import { prisma } from '@/lib/prisma';
import { Department } from '@prisma/client';

/**
 * Check if a user has access to a specific department
 */
export async function hasDepartmentAccess(
  userId: string,
  department: Department
): Promise<boolean> {
  // Super admins have access to everything
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  // Check if user is assigned to this department
  const assignment = await prisma.staff_departments.findUnique({
    where: {
      userId_department: {
        userId,
        department,
      },
    },
  });

  return !!assignment;
}

/**
 * Get all departments a user has access to
 */
export async function getUserDepartments(userId: string): Promise<Department[]> {
  // Super admins have access to all departments
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return [];

  if (user.role === 'SUPER_ADMIN') {
    return [
      'SUPER_ADMIN',
      'CUSTOMER_SERVICE',
      'EDITORIAL',
      'SUCCESS_PLUS',
      'DEV',
      'MARKETING',
      'COACHING',
    ];
  }

  // Get assigned departments
  const assignments = await prisma.staff_departments.findMany({
    where: { userId },
    select: { department: true },
  });

  return assignments.map(a => a.department);
}

/**
 * Get department from route path
 */
export function getDepartmentFromPath(pathname: string): Department | null {
  if (pathname.startsWith('/admin/super')) return 'SUPER_ADMIN';
  if (pathname.startsWith('/admin/customer-service')) return 'CUSTOMER_SERVICE';
  if (pathname.startsWith('/admin/editorial')) return 'EDITORIAL';
  if (pathname.startsWith('/admin/success-plus')) return 'SUCCESS_PLUS';
  if (pathname.startsWith('/admin/dev')) return 'DEV';
  if (pathname.startsWith('/admin/marketing')) return 'MARKETING';
  if (pathname.startsWith('/admin/coaching')) return 'COACHING';
  return null;
}

/**
 * Get route prefix for a department
 */
export function getDepartmentRoute(department: Department): string {
  const routes: Record<Department, string> = {
    SUPER_ADMIN: '/admin/super',
    CUSTOMER_SERVICE: '/admin/customer-service',
    EDITORIAL: '/admin/editorial',
    SUCCESS_PLUS: '/admin/success-plus',
    DEV: '/admin/dev',
    MARKETING: '/admin/marketing',
    COACHING: '/admin/coaching',
  };
  return routes[department];
}
