# SUCCESS Magazine - Soft Launch Implementation Guide

**Last Updated:** 2025-01-10
**Target:** 2-3 week staff beta before public launch
**Status:** Step 1 Complete ✅

---

## 📋 **TABLE OF CONTENTS**

1. [Step 1: Registration & Auth Polish](#step-1-registration--auth-polish) ✅
2. [Step 2: Analytics & Email](#step-2-analytics--email)
3. [Step 3: Stripe Subscriptions](#step-3-stripe-subscriptions)
4. [Step 4: WordPress → Prisma Migration](#step-4-wordpress--prisma-migration)
5. [Step 5: SEO, Sitemaps, Redirects](#step-5-seo-sitemaps-redirects)
6. [Step 6: Admin Polish](#step-6-admin-polish)
7. [Step 7: QA & Beta Testing](#step-7-qa--beta-testing)

---

## ✅ **STEP 1: REGISTRATION & AUTH POLISH**

### **What Was Built**

- ✅ Invite code system for non-@success.com emails
- ✅ Domain restriction (@success.com auto-approval)
- ✅ Forced password change on first login
- ✅ Protected `/admin/*` and `/dashboard/*` routes via middleware
- ✅ Password reset flow (forgot password)
- ✅ Last login tracking

### **Database Changes**

Added to `users` table:
- `invitedBy` - Who invited this user
- `inviteCode` - Invite code used (if any)
- `membershipTier` - FREE | INSIDER | COLLECTIVE

New `invite_codes` table:
- Tracks all generated invite codes
- Email-specific or generic codes
- Expiration and usage limits
- Admin-only creation

### **Files Created/Modified**

**Created:**
- `lib/auth-utils.ts` - Invite code generation, password reset tokens
- `pages/forgot-password.tsx` - Password reset request page
- `pages/api/admin/invites/create.ts` - Admin API to generate invite codes
- `pages/api/admin/invites/list.ts` - Admin API to list all invites
- `docs/soft-launch.md` - This file

**Modified:**
- `prisma/schema.prisma` - Added invite_codes table, membership tier enum
- `pages/register.tsx` - Added invite code input field
- `pages/api/auth/register.ts` - Validates invite codes
- `pages/api/auth/[...nextauth].ts` - Tracks last login, passes membership tier
- `middleware.ts` - Protects admin routes, enforces password change
- `.env.example` - Updated with Steps 1-3 variables

### **Environment Variables Required**

```bash
# Step 1 - Required
DATABASE_URL="postgres://..."
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"  # or production URL
```

### **Commands to Run**

```bash
# 1. Generate Prisma migration
npx prisma migrate dev --name add_invite_codes_and_membership_tier

# 2. Generate Prisma client
npx prisma generate

# 3. Start development server
npm run dev

# 4. (Optional) Open Prisma Studio to view data
npx prisma studio
```

### **Testing Checklist**

#### ✅ **Test 1: Staff Registration (@success.com)**

**Steps:**
1. Go to `http://localhost:3000/register`
2. Enter email: `test@success.com`
3. Enter name: `Test User`
4. Select role: `Editor`
5. Click "Create Account"

**Expected:**
- Account created successfully
- Redirected to login page
- Default password shown: `SUCCESS123!`

#### ✅ **Test 2: Non-Staff Registration (Without Invite)**

**Steps:**
1. Go to `http://localhost:3000/register`
2. Enter email: `external@gmail.com`
3. Enter name: `External User`
4. Click "Create Account"

**Expected:**
- Error: "Either use a @success.com email or provide a valid invite code"

#### ✅ **Test 3: Create Invite Code (Admin)**

**Steps:**
1. Login as admin user
2. POST to `/api/admin/invites/create`:
```bash
curl -X POST http://localhost:3000/api/admin/invites/create \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "email": "contractor@example.com",
    "role": "AUTHOR",
    "expiresInDays": 7,
    "maxUses": 1
  }'
```

**Expected:**
- Response with invite code: `SUCCESS-XXXX-XXXX-XXXX`

#### ✅ **Test 4: Register with Invite Code**

**Steps:**
1. Go to `http://localhost:3000/register?code=SUCCESS-XXXX-XXXX-XXXX`
2. Invite code should pre-fill
3. Enter email: `contractor@example.com`
4. Enter name: `Contract Writer`
5. Click "Create Account"

**Expected:**
- Account created successfully
- Role matches invite code role
- Invite code marked as used

#### ✅ **Test 5: First Login & Forced Password Change**

**Steps:**
1. Go to `http://localhost:3000/admin/login`
2. Login with `test@success.com` / `SUCCESS123!`
3. After successful login, attempt to access `/admin`

**Expected:**
- Automatically redirected to `/admin/change-password?required=true`
- Cannot access any admin pages until password changed
- After changing password, full admin access granted

#### ✅ **Test 6: Protected Route Without Auth**

**Steps:**
1. Open incognito browser
2. Go to `http://localhost:3000/admin`

**Expected:**
- Redirected to `/admin/login?callbackUrl=/admin`
- After login, redirected back to `/admin`

#### ✅ **Test 7: Forgot Password Flow**

**Steps:**
1. Go to `http://localhost:3000/forgot-password`
2. Enter email: `test@success.com`
3. Click "Send Reset Link"

**Expected:**
- Success message shown
- In development, console logs reset URL
- Token expires in 1 hour
- (In Step 2, email will be sent)

### **Rollback Plan**

If Step 1 causes issues:

```bash
# 1. Revert database migration
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# 2. Restore previous schema
git checkout HEAD~1 -- prisma/schema.prisma

# 3. Regenerate Prisma client
npx prisma generate

# 4. Restart server
npm run dev
```

### **Known Limitations (To Address in Step 2)**

- ❌ Password reset emails not sent (logs to console only)
- ❌ Welcome emails not sent on registration
- ❌ Invite emails not sent when code is created

---

## 🔜 **STEP 2: ANALYTICS & EMAIL** (Next)

### **Goals**

- Add Google Analytics 4 with server-side pageview tracking
- Add Resend for transactional emails:
  - Password reset emails
  - Welcome emails (staff registration)
  - Invite code emails
  - Receipt emails (post-Stripe integration)

### **Files to Create**

- `lib/analytics.ts` - GA4 integration
- `lib/email.ts` - Resend email utilities
- `app/instrumentation.ts` - Server-side analytics
- `components/GoogleAnalytics.tsx` - Client-side GA4

### **Environment Variables**

```bash
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="SUCCESS Magazine <noreply@success.com>"
```

### **Implementation Plan**

1. Set up Resend account (free tier)
2. Verify sender domain
3. Create email templates
4. Update forgot-password API to send emails
5. Add welcome email on registration
6. Add GA4 tracking to all pages
7. Test email delivery

---

## 🔜 **STEP 3: STRIPE SUBSCRIPTIONS** (After Step 2)

### **Goals**

- Single plan subscription (SUCCESS+ INSIDER)
- Checkout flow on `/subscribe` page
- Webhook handler for subscription events
- Membership tier gating (FREE vs INSIDER vs COLLECTIVE)
- Receipt emails via Resend

### **Implementation Plan**

1. Create Stripe product: "SUCCESS+ INSIDER"
2. Add monthly ($9.99) and annual ($99) prices
3. Set up webhook endpoint
4. Create checkout session API
5. Update user membership on successful payment
6. Add middleware to gate premium content
7. Test with Stripe test cards

---

## 📊 **CURRENT STATUS**

| Step | Status | Completion | Blockers |
|------|--------|------------|----------|
| **1. Auth & Registration** | ✅ Complete | 100% | None |
| **2. Analytics & Email** | 🟡 In Progress | 0% | Need Resend account |
| **3. Stripe Subscriptions** | ⏳ Pending | 0% | Blocked by Step 2 |
| **4. WordPress Migration** | ⏳ Pending | 0% | - |
| **5. SEO & Redirects** | ⏳ Pending | 0% | - |
| **6. Admin Polish** | ⏳ Pending | 0% | - |
| **7. QA & Beta Testing** | ⏳ Pending | 0% | Blocked by Steps 1-6 |

---

## 🚨 **DEPLOYMENT NOTES**

### **Vercel Environment Variables**

Add these to Vercel dashboard → Settings → Environment Variables:

**Step 1 (Required Now):**
```
DATABASE_URL="postgres://..." (from Vercel Postgres)
NEXTAUTH_SECRET="..." (generate new for production)
NEXTAUTH_URL="https://success-nextjs.vercel.app"
```

**Step 2 (Required Next):**
```
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="SUCCESS Magazine <noreply@success.com>"
```

**Step 3 (Required After Step 2):**
```
STRIPE_SECRET_KEY="sk_live_..." (use sk_test_... for preview)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..." (use pk_test_... for preview)
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_INSIDER_MONTHLY="price_..."
STRIPE_PRICE_INSIDER_ANNUAL="price_..."
```

### **Database Migrations on Vercel**

Migrations run automatically on deploy via:
```json
// package.json
{
  "scripts": {
    "vercel-build": "prisma generate && next build"
  }
}
```

### **Testing in Production**

Use Vercel preview deployments for testing:

```bash
# Create preview branch
git checkout -b feature/step-2-email

# Push to trigger preview deployment
git push origin feature/step-2-email

# Vercel creates: https://success-nextjs-git-feature-step-2-email-xxx.vercel.app
```

---

## 🎯 **SUCCESS CRITERIA**

Step 1 is complete when:

- [x] Staff can register with @success.com emails
- [x] Non-staff require valid invite codes
- [x] First login forces password change
- [x] Admin routes protected from unauthorized access
- [x] Password reset flow functional (logged to console)
- [x] All tests pass
- [x] Deployed to Vercel preview environment

---

## 📞 **SUPPORT & TROUBLESHOOTING**

### **Common Issues**

**Issue:** "Prisma Client not generated"
```bash
# Fix:
npx prisma generate
```

**Issue:** "Database connection failed"
```bash
# Check DATABASE_URL in .env.local
# Verify Postgres is running
# Test connection:
npx prisma db push
```

**Issue:** "NextAuth session not persisting"
```bash
# Check NEXTAUTH_SECRET is set
# Verify NEXTAUTH_URL matches your domain
# Clear browser cookies and retry
```

**Issue:** "Middleware redirects in loop"
```bash
# Check that /admin/login is not in protectedRoutes array
# Verify session token is being set correctly
# Check browser Network tab for redirect chain
```

### **Development Commands**

```bash
# Start dev server
npm run dev

# View database
npx prisma studio

# Create migration
npx prisma migrate dev --name description_here

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📚 **ADDITIONAL RESOURCES**

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Resend Docs](https://resend.com/docs)
- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/9304153)

---

**Ready for Step 2!** 🚀
