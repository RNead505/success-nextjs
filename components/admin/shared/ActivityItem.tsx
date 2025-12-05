import { Department } from '@prisma/client';
import styles from './ActivityItem.module.css';

interface ActivityItemProps {
  activity: {
    id: string;
    userName: string;
    action: string;
    description?: string;
    entityType?: string;
    department?: Department;
    createdAt: string;
  };
}

const departmentColors: Record<Department, string> = {
  SUPER_ADMIN: '#111827',
  CUSTOMER_SERVICE: '#3b82f6',
  EDITORIAL: '#10b981',
  SUCCESS_PLUS: '#8b5cf6',
  DEV: '#ef4444',
  MARKETING: '#f59e0b',
  COACHING: '#06b6d4',
};

const departmentLabels: Record<Department, string> = {
  SUPER_ADMIN: 'Super Admin',
  CUSTOMER_SERVICE: 'Customer Service',
  EDITORIAL: 'Editorial',
  SUCCESS_PLUS: 'SUCCESS+',
  DEV: 'Dev',
  MARKETING: 'Marketing',
  COACHING: 'Coaching',
};

export default function ActivityItem({ activity }: ActivityItemProps) {
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  const getActionIcon = (action: string) => {
    if (action.includes('created') || action.includes('added')) return '•';
    if (action.includes('updated') || action.includes('edited')) return '';
    if (action.includes('deleted') || action.includes('removed')) return '=Ñ';
    if (action.includes('published')) return '=€';
    if (action.includes('cancelled')) return 'L';
    if (action.includes('completed')) return '';
    if (action.includes('scheduled')) return '=Å';
    if (action.includes('moved')) return '”';
    return '=Ë';
  };

  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon}>
        {getActionIcon(activity.action)}
      </div>
      <div className={styles.activityContent}>
        <div className={styles.activityText}>
          <span className={styles.userName}>{activity.userName}</span>
          {' '}
          <span className={styles.action}>
            {activity.description || activity.action}
          </span>
        </div>
        <div className={styles.activityMeta}>
          {activity.department && (
            <span
              className={styles.departmentBadge}
              style={{ background: departmentColors[activity.department] }}
            >
              {departmentLabels[activity.department]}
            </span>
          )}
          <span className={styles.timestamp}>{getTimeAgo(activity.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
