import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import styles from './Documentation.module.css';

export default function DocumentationPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role !== 'SUPER_ADMIN') {
      router.push('/admin');
    }
  }, [session]);

  const docs = [
    {
      category: 'Getting Started',
      items: [
        { title: 'Admin Dashboard Overview', icon: '📊', description: 'Learn the basics of the admin dashboard' },
        { title: 'User Management', icon: '👥', description: 'Managing users and permissions' },
        { title: 'Content Management', icon: '📝', description: 'Creating and editing content' },
      ]
    },
    {
      category: 'Troubleshooting',
      items: [
        { title: 'Common Issues', icon: '🔧', description: 'Solutions to frequently encountered problems' },
        { title: 'Deployment Issues', icon: '🚀', description: 'Fixing deployment and build errors' },
        { title: 'Database Errors', icon: '💾', description: 'Resolving database connection issues' },
      ]
    },
    {
      category: 'Video Tutorials',
      items: [
        { title: 'Platform Overview (10 min)', icon: '🎥', description: 'Complete walkthrough of the platform' },
        { title: 'Content Publishing (5 min)', icon: '🎬', description: 'How to publish articles and pages' },
        { title: 'Analytics Dashboard (8 min)', icon: '📈', description: 'Understanding your analytics' },
      ]
    },
    {
      category: 'API Reference',
      items: [
        { title: 'REST API Documentation', icon: '🔌', description: 'Complete API endpoint reference' },
        { title: 'Webhooks Guide', icon: '⚡', description: 'Setting up and managing webhooks' },
        { title: 'Authentication', icon: '🔐', description: 'API authentication and security' },
      ]
    },
  ];

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Documentation Hub</h1>
            <p className={styles.subtitle}>Guides, tutorials, and reference materials</p>
          </div>
        </div>

        <div className={styles.contact}>
          <div className={styles.contactBox}>
            <h3>Need Help?</h3>
            <p>Contact our support team:</p>
            <a href="mailto:dev@success.com" className={styles.contactLink}>dev@success.com</a>
            <span className={styles.contactDivider}>or</span>
            <a href="tel:+18005551234" className={styles.contactLink}>1-800-555-1234</a>
          </div>
        </div>

        {docs.map((category, idx) => (
          <div key={idx} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category.category}</h2>
            <div className={styles.itemsGrid}>
              {category.items.map((item, itemIdx) => (
                <div key={itemIdx} className={styles.docCard}>
                  <div className={styles.docIcon}>{item.icon}</div>
                  <h3 className={styles.docTitle}>{item.title}</h3>
                  <p className={styles.docDescription}>{item.description}</p>
                  <button className={styles.readButton}>Read More →</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
