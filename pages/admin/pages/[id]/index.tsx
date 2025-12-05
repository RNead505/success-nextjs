import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import EnhancedPageEditor from '../../../../components/admin/EnhancedPageEditor';
import { requireAdminAuth } from '@/lib/adminAuth';

export default function EditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  if (!id || typeof id !== 'string') {
    return <div>Invalid page ID</div>;
  }

  return <EnhancedPageEditor pageId={id} />;
}

// Server-side authentication check
export const getServerSideProps = requireAdminAuth;
