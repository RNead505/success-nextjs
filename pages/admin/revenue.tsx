import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Legacy Revenue Page - Redirects to new comprehensive Revenue Analytics
 *
 * The old /admin/revenue page showed only SUCCESS+ subscription data.
 * The new /admin/revenue-analytics page shows ALL revenue sources:
 * - Subscriptions (SUCCESS+)
 * - Transactions (Stripe, PayKickstart)
 * - Orders (WooCommerce, Store, Magazine)
 */
export default function AdminRevenue() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to comprehensive revenue analytics page
    router.replace('/admin/revenue-analytics');
  }, [router]);

  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/admin/revenue-analytics',
      permanent: false,
    },
  };
}
