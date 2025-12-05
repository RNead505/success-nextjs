import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { requireAdminAuth } from '@/lib/adminAuth';

export default function NewExclusiveArticle() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new post page with SUCCESS+ tags pre-selected
    router.push('/admin/posts/new?tags=success-plus,insider&exclusive=true');
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirecting to article editor...</p>
    </div>
  );
}

// Force SSR to prevent NextRouter errors during build

// Server-side authentication check
export const getServerSideProps = requireAdminAuth;
