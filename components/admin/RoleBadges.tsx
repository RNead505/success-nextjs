import React from 'react';
import styles from './RoleBadges.module.css';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'STAFF';
export type MembershipTier = 'Free' | 'Customer' | 'SUCCESSPlus' | 'VIP' | 'Enterprise';

interface RoleBadgesProps {
  // For User admin page
  userRole?: UserRole;
  membershipTier?: MembershipTier | null;

  // For Member/Customer page
  memberTier?: MembershipTier;
  platformRole?: UserRole | null;
}

/**
 * Combined Role Badge Component
 *
 * Shows user role badges with optional membership tier
 * or membership tier badges with optional platform role
 */
export default function RoleBadges({
  userRole,
  membershipTier,
  memberTier,
  platformRole,
}: RoleBadgesProps) {
  // User Admin Page: Show platform role first, then membership tier
  if (userRole) {
    return (
      <div className={styles.badgeContainer}>
        <span className={`${styles.badge} ${styles[`role-${userRole.toLowerCase()}`]}`}>
          {formatUserRole(userRole)}
        </span>
        {membershipTier && membershipTier !== 'Free' && (
          <span className={`${styles.badge} ${styles[`tier-${membershipTier.toLowerCase()}`]}`}>
            {formatMembershipTier(membershipTier)}
          </span>
        )}
      </div>
    );
  }

  // Member/Customer Page: Show membership tier first, then platform role
  if (memberTier) {
    return (
      <div className={styles.badgeContainer}>
        <span className={`${styles.badge} ${styles[`tier-${memberTier.toLowerCase()}`]}`}>
          {formatMembershipTier(memberTier)}
        </span>
        {platformRole && (
          <span className={`${styles.badge} ${styles[`role-${platformRole.toLowerCase()}`]}`}>
            {formatUserRole(platformRole)}
          </span>
        )}
      </div>
    );
  }

  return null;
}

function formatUserRole(role: UserRole): string {
  const roleMap: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    EDITOR: 'Editor',
    AUTHOR: 'Author',
    STAFF: 'Staff',
  };
  return roleMap[role] || role;
}

function formatMembershipTier(tier: MembershipTier): string {
  const tierMap: Record<MembershipTier, string> = {
    Free: 'Free',
    Customer: 'Customer',
    SUCCESSPlus: 'SUCCESS+',
    VIP: 'VIP',
    Enterprise: 'Enterprise',
  };
  return tierMap[tier] || tier;
}
