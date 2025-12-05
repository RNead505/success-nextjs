import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import VideoEditor from '../../../../components/admin/VideoEditor';
import { requireAdminAuth } from '@/lib/adminAuth';

export default function EditVideo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <VideoEditor videoId={id as string} />
    </AdminLayout>
  );
}

// Force SSR to prevent NextRouter errors during build

// Server-side authentication check
export const getServerSideProps = requireAdminAuth;
