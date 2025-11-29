-- Manual Migration: User/Member Separation
-- Run this SQL script directly on the database

-- Step 1: Drop old columns from users table that are moving to members
ALTER TABLE users DROP COLUMN IF EXISTS "membershipTier";
ALTER TABLE users DROP COLUMN IF EXISTS "subscriptionStatus";
ALTER TABLE users DROP COLUMN IF EXISTS "subscriptionExpiry";
ALTER TABLE users DROP COLUMN IF EXISTS "stripeCustomerId";

-- Step 2: Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS "memberId" TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Step 3: Create new enum types if they don't exist
DO $$ BEGIN
  CREATE TYPE "MemberStatus" AS ENUM ('Active', 'Inactive', 'Suspended', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PriorityLevel" AS ENUM ('Standard', 'High', 'VIP', 'Enterprise');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "DisputeType" AS ENUM ('REFUND', 'CHARGEBACK', 'DISPUTE', 'CANCELLATION');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 4: Update MembershipTier enum (handle existing values)
ALTER TYPE "MembershipTier" RENAME TO "MembershipTier_old";

CREATE TYPE "MembershipTier" AS ENUM ('Free', 'Customer', 'SUCCESSPlus', 'VIP', 'Enterprise');

-- Step 5: Update members table to use new enum
ALTER TABLE members
  ALTER COLUMN "membershipTier" TYPE "MembershipTier"
  USING CASE
    WHEN "membershipTier"::text = 'FREE' THEN 'Free'::  "MembershipTier"
    WHEN "membershipTier"::text = 'INSIDER' THEN 'Customer'::"MembershipTier"
    WHEN "membershipTier"::text = 'COLLECTIVE' THEN 'SUCCESSPlus'::"MembershipTier"
    ELSE 'Free'::"MembershipTier"
  END;

DROP TYPE "MembershipTier_old";

-- Step 6: Create transactions table
CREATE TABLE IF NOT EXISTS "transactions" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT,
  "paymentMethod" TEXT,
  "provider" TEXT NOT NULL,
  "providerTxnId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "transactions_memberId_idx" ON "transactions"("memberId");
CREATE INDEX IF NOT EXISTS "transactions_status_idx" ON "transactions"("status");
CREATE INDEX IF NOT EXISTS "transactions_createdAt_idx" ON "transactions"("createdAt");
CREATE INDEX IF NOT EXISTS "transactions_provider_idx" ON "transactions"("provider");

ALTER TABLE "transactions"
  ADD CONSTRAINT "transactions_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 7: Create subscribers table
CREATE TABLE IF NOT EXISTS "subscribers" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  "status" "SubscriberStatus" NOT NULL DEFAULT 'ACTIVE',
  "source" TEXT,
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribedAt" TIMESTAMP(3),
  "memberId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "subscribers_email_idx" ON "subscribers"("email");
CREATE INDEX IF NOT EXISTS "subscribers_status_idx" ON "subscribers"("status");
CREATE INDEX IF NOT EXISTS "subscribers_memberId_idx" ON "subscribers"("memberId");

ALTER TABLE "subscribers"
  ADD CONSTRAINT "subscribers_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 8: Create refund_disputes table
CREATE TABLE IF NOT EXISTS "refund_disputes" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL,
  "orderId" TEXT,
  "transactionId" TEXT,
  "type" "DisputeType" NOT NULL,
  "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
  "amount" DECIMAL(10,2) NOT NULL,
  "reason" TEXT,
  "description" TEXT,
  "resolution" TEXT,
  "assignedTo" TEXT,
  "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "refund_disputes_memberId_idx" ON "refund_disputes"("memberId");
CREATE INDEX IF NOT EXISTS "refund_disputes_status_idx" ON "refund_disputes"("status");
CREATE INDEX IF NOT EXISTS "refund_disputes_type_idx" ON "refund_disputes"("type");
CREATE INDEX IF NOT EXISTS "refund_disputes_createdAt_idx" ON "refund_disputes"("createdAt");

ALTER TABLE "refund_disputes"
  ADD CONSTRAINT "refund_disputes_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "refund_disputes"
  ADD CONSTRAINT "refund_disputes_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 9: Update subscriptions table - remove old userId, add memberId
-- First, store the mapping
CREATE TEMP TABLE subscription_user_mapping AS
SELECT id, "userId" FROM subscriptions WHERE "userId" IS NOT NULL;

ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS "subscriptions_userId_fkey";
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS "subscriptions_userId_key";

ALTER TABLE subscriptions DROP COLUMN IF EXISTS "userId";
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS "memberId" TEXT NOT NULL DEFAULT '';

-- Add indexes
CREATE INDEX IF NOT EXISTS "subscriptions_memberId_idx" ON "subscriptions"("memberId");
CREATE INDEX IF NOT EXISTS "subscriptions_stripeCustomerId_idx" ON "subscriptions"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions"("status");

-- Step 10: Update orders table - change userId to memberId
ALTER TABLE orders DROP CONSTRAINT IF EXISTS "orders_userId_fkey";

ALTER TABLE orders RENAME COLUMN "userId" TO "memberId";

CREATE INDEX IF NOT EXISTS "orders_memberId_idx" ON "orders"("memberId");

ALTER TABLE "orders"
  ADD CONSTRAINT "orders_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 11: Add indexes to members
CREATE INDEX IF NOT EXISTS "members_membershipStatus_idx" ON "members"("membershipStatus");
CREATE INDEX IF NOT EXISTS "members_membershipTier_idx" ON "members"("membershipTier");
CREATE INDEX IF NOT EXISTS "members_stripeCustomerId_idx" ON "members"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "members_paykickstartCustomerId_idx" ON "members"("paykickstartCustomerId");
CREATE INDEX IF NOT EXISTS "members_totalSpent_idx" ON "members"("totalSpent");

-- Step 12: Add indexes to users
CREATE INDEX IF NOT EXISTS "users_memberId_idx" ON "users"("memberId");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

-- Migration complete!
SELECT 'Migration SQL complete!' as status;
