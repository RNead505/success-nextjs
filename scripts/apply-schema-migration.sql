-- Manual migration script to handle enum changes and schema updates
-- Run this to apply the new schema changes

BEGIN;

-- Step 1: Drop the old membershipTier and subscriptionStatus columns from users table
-- (We backed up the data - all were FREE/INACTIVE)
ALTER TABLE users DROP COLUMN IF EXISTS "membershipTier";
ALTER TABLE users DROP COLUMN IF EXISTS "subscriptionStatus";
ALTER TABLE users DROP COLUMN IF EXISTS "stripeCustomerId";

-- Step 2: Add the new memberId column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS "memberId" TEXT;
ALTER TABLE users ADD CONSTRAINT "users_memberId_key" UNIQUE ("memberId");

-- Step 3: Create the members table if it doesn't exist
CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "membershipTier" TEXT NOT NULL DEFAULT 'Free',
    "membershipStatus" TEXT NOT NULL DEFAULT 'Active',
    "lastLoginDate" TIMESTAMP(3),
    "totalSpent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "lifetimeValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    "billingAddress" JSONB,
    "shippingAddress" JSONB,
    "communicationPreferences" JSONB,
    "assignedCSRep" TEXT,
    "priorityLevel" TEXT NOT NULL DEFAULT 'Standard',
    "internalNotes" TEXT,
    "stripeCustomerId" TEXT UNIQUE,
    "paykickstartCustomerId" TEXT UNIQUE,
    "woocommerceCustomerId" INTEGER UNIQUE,
    "lastContactDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create indexes on members table
CREATE INDEX IF NOT EXISTS "members_email_idx" ON members(email);
CREATE INDEX IF NOT EXISTS "members_membershipStatus_idx" ON members("membershipStatus");
CREATE INDEX IF NOT EXISTS "members_membershipTier_idx" ON members("membershipTier");
CREATE INDEX IF NOT EXISTS "members_stripeCustomerId_idx" ON members("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "members_paykickstartCustomerId_idx" ON members("paykickstartCustomerId");
CREATE INDEX IF NOT EXISTS "members_totalSpent_idx" ON members("totalSpent");

-- Step 5: Create the transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "memberId" TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    "paymentMethod" TEXT,
    provider TEXT NOT NULL,
    "providerTxnId" TEXT,
    metadata JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "transactions_memberId_idx" ON transactions("memberId");
CREATE INDEX IF NOT EXISTS "transactions_status_idx" ON transactions(status);
CREATE INDEX IF NOT EXISTS "transactions_createdAt_idx" ON transactions("createdAt");
CREATE INDEX IF NOT EXISTS "transactions_provider_idx" ON transactions(provider);

-- Step 6: Create the subscribers table with new fields
CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email TEXT UNIQUE NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    type TEXT NOT NULL DEFAULT 'EmailNewsletter',
    "recipientType" TEXT NOT NULL DEFAULT 'Customer',
    "isComplimentary" BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    source TEXT,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),
    "memberId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscribers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES members(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "subscribers_email_idx" ON subscribers(email);
CREATE INDEX IF NOT EXISTS "subscribers_status_idx" ON subscribers(status);
CREATE INDEX IF NOT EXISTS "subscribers_type_idx" ON subscribers(type);
CREATE INDEX IF NOT EXISTS "subscribers_recipientType_idx" ON subscribers("recipientType");
CREATE INDEX IF NOT EXISTS "subscribers_isComplimentary_idx" ON subscribers("isComplimentary");
CREATE INDEX IF NOT EXISTS "subscribers_memberId_idx" ON subscribers("memberId");

-- Step 7: Create the refund_disputes table if it doesn't exist
CREATE TABLE IF NOT EXISTS refund_disputes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "memberId" TEXT NOT NULL,
    "orderId" TEXT,
    "transactionId" TEXT,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    description TEXT,
    resolution TEXT,
    "assignedTo" TEXT,
    priority TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refund_disputes_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT "refund_disputes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES orders(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "refund_disputes_memberId_idx" ON refund_disputes("memberId");
CREATE INDEX IF NOT EXISTS "refund_disputes_status_idx" ON refund_disputes(status);
CREATE INDEX IF NOT EXISTS "refund_disputes_type_idx" ON refund_disputes(type);
CREATE INDEX IF NOT EXISTS "refund_disputes_createdAt_idx" ON refund_disputes("createdAt");

-- Step 8: Update subscriptions table to use memberId instead of userId
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS "subscriptions_userId_fkey";
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS "subscriptions_userId_key";

-- Rename userId to memberId if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'subscriptions' AND column_name = 'userId'
    ) THEN
        ALTER TABLE subscriptions RENAME COLUMN "userId" TO "memberId";
    END IF;
END $$;

-- Add memberId column if it doesn't exist
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS "memberId" TEXT;

-- Add foreign key constraint
ALTER TABLE subscriptions ADD CONSTRAINT "subscriptions_memberId_fkey"
    FOREIGN KEY ("memberId") REFERENCES members(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "subscriptions_memberId_idx" ON subscriptions("memberId");

-- Step 9: Update orders table to use memberId
ALTER TABLE orders DROP CONSTRAINT IF EXISTS "orders_userId_fkey";

-- Rename userId to memberId if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'userId'
    ) THEN
        ALTER TABLE orders RENAME COLUMN "userId" TO "memberId";
    END IF;
END $$;

-- Add memberId column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS "memberId" TEXT;

-- Add foreign key constraint
ALTER TABLE orders ADD CONSTRAINT "orders_memberId_fkey"
    FOREIGN KEY ("memberId") REFERENCES members(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS "orders_memberId_idx" ON orders("memberId");

COMMIT;
