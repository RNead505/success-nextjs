import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import PodcastEditor from '../../../../components/admin/PodcastEditor';

export default function EditPodcast() {
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
      <PodcastEditor podcastId={id as string} />
    </AdminLayout>
  );
}
