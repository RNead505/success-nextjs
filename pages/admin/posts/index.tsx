import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import PostsListWithFilters from '../../../components/admin/PostsListWithFilters';

export default function AdminPosts() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PostsListWithFilters />
    </AdminLayout>
  );
}

// Force SSR to prevent NextRouter errors during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}
