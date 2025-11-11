import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      avatar?: string;
      createdAt?: Date | string;
      hasChangedDefaultPassword?: boolean;
      membershipTier?: string;
      subscription?: {
        status: string;
        currentPeriodEnd?: Date;
        stripePriceId?: string;
        stripeSubscriptionId?: string;
      };
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    avatar?: string;
    createdAt?: Date | string;
    hasChangedDefaultPassword?: boolean;
    membershipTier?: string;
    subscription?: {
      status: string;
      currentPeriodEnd?: Date;
      stripePriceId?: string;
      stripeSubscriptionId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    avatar?: string;
    createdAt?: Date | string;
    hasChangedDefaultPassword?: boolean;
    membershipTier?: string;
    subscription?: {
      status: string;
      currentPeriodEnd?: Date;
      stripePriceId?: string;
      stripeSubscriptionId?: string;
    };
  }
}
