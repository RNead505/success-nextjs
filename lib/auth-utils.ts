import { prisma } from './prisma';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * Generate a secure invite code
 * Format: SUCCESS-XXXX-XXXX-XXXX
 */
export function generateInviteCode(): string {
  const segments = [];
  for (let i = 0; i < 3; i++) {
    segments.push(crypto.randomBytes(2).toString('hex').toUpperCase());
  }
  return `SUCCESS-${segments.join('-')}`;
}

/**
 * Create an invite code for staff registration
 */
export async function createInviteCode({
  email,
  role = 'EDITOR',
  createdBy,
  expiresInDays = 7,
  maxUses = 1,
}: {
  email?: string;
  role?: 'EDITOR' | 'AUTHOR' | 'ADMIN' | 'SUPER_ADMIN';
  createdBy: string;
  expiresInDays?: number;
  maxUses?: number;
}) {
  const code = generateInviteCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const invite = await prisma.invite_codes.create({
    data: {
      id: uuidv4(),
      code,
      email,
      role,
      createdBy,
      expiresAt,
      maxUses,
      uses: 0,
      isActive: true,
      createdAt: new Date(),
    },
  });

  return invite;
}

/**
 * Validate an invite code
 */
export async function validateInviteCode(code: string, email?: string) {
  const invite = await prisma.invite_codes.findUnique({
    where: { code },
  });

  if (!invite) {
    return { valid: false, error: 'Invalid invite code' };
  }

  if (!invite.isActive) {
    return { valid: false, error: 'This invite code has been deactivated' };
  }

  if (invite.uses >= invite.maxUses) {
    return { valid: false, error: 'This invite code has already been used' };
  }

  if (new Date() > invite.expiresAt) {
    return { valid: false, error: 'This invite code has expired' };
  }

  // If invite is email-specific, verify email matches
  if (invite.email && email && invite.email !== email) {
    return { valid: false, error: 'This invite code is for a different email address' };
  }

  return { valid: true, invite };
}

/**
 * Mark invite code as used
 */
export async function useInviteCode(code: string, userId: string) {
  const invite = await prisma.invite_codes.findUnique({
    where: { code },
  });

  if (!invite) {
    throw new Error('Invite code not found');
  }

  await prisma.invite_codes.update({
    where: { code },
    data: {
      uses: invite.uses + 1,
      usedBy: userId,
      usedAt: new Date(),
      isActive: invite.uses + 1 >= invite.maxUses ? false : true,
    },
  });
}

/**
 * Generate password reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create password reset token for user
 */
export async function createPasswordResetToken(email: string) {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const resetToken = generateResetToken();
  const resetTokenExpiry = new Date();
  resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

  await prisma.users.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry,
      updatedAt: new Date(),
    },
  });

  return { resetToken, user };
}

/**
 * Validate password reset token
 */
export async function validateResetToken(token: string) {
  const user = await prisma.users.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(), // Token must not be expired
      },
    },
  });

  if (!user) {
    return { valid: false, error: 'Invalid or expired reset token' };
  }

  return { valid: true, user };
}

/**
 * Check if password reset is required (first login)
 */
export async function requiresPasswordChange(userId: string): Promise<boolean> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { hasChangedDefaultPassword: true },
  });

  return user ? !user.hasChangedDefaultPassword : false;
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(userId: string) {
  await prisma.users.update({
    where: { id: userId },
    data: {
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
