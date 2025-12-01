import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import ConfirmationModal from '../../../components/admin/ConfirmationModal';
import styles from './FeatureFlags.module.css';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  affectedUsers: number;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export default function FeatureFlagsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'ADMIN') {
      router.push('/admin');
      return;
    }
    fetchFlags();
  }, [session]);

  const fetchFlags = async () => {
    try {
      const res = await fetch('/api/admin/devops/feature-flags');
      if (res.ok) {
        const data = await res.json();
        setFlags(data.flags);
        setMaintenanceMode(data.maintenanceMode);
      }
    } catch (error) {
      console.error('Error fetching flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFlag = async (flag: FeatureFlag) => {
    try {
      const res = await fetch(`/api/admin/devops/feature-flags/${flag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !flag.enabled }),
      });

      if (res.ok) {
        fetchFlags();
      }
    } catch (error) {
      console.error('Error toggling flag:', error);
    } finally {
      setShowToggleModal(false);
      setSelectedFlag(null);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const res = await fetch('/api/admin/devops/feature-flags/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !maintenanceMode }),
      });

      if (res.ok) {
        fetchFlags();
      }
    } catch (error) {
      console.error('Error toggling maintenance:', error);
    } finally {
      setShowMaintenanceModal(false);
    }
  };

  const openToggleModal = (flag: FeatureFlag) => {
    setSelectedFlag(flag);
    setShowToggleModal(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading feature flags...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Feature Flags</h1>
            <p className={styles.subtitle}>Toggle features on/off across the platform</p>
          </div>
          <button
            className={`${styles.maintenanceButton} ${maintenanceMode ? styles.active : ''}`}
            onClick={() => setShowMaintenanceModal(true)}
          >
            {maintenanceMode ? '🔧 Maintenance Mode: ON' : '🔧 Enable Maintenance Mode'}
          </button>
        </div>

        {maintenanceMode && (
          <div className={styles.maintenanceBanner}>
            ⚠️ <strong>Maintenance Mode is Active</strong> - The site is currently in maintenance mode
          </div>
        )}

        <div className={styles.flagsList}>
          {flags.map((flag) => (
            <div key={flag.id} className={styles.flagCard}>
              <div className={styles.flagInfo}>
                <div className={styles.flagHeader}>
                  <h3 className={styles.flagName}>{flag.name}</h3>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={flag.enabled}
                      onChange={() => openToggleModal(flag)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <p className={styles.flagDescription}>{flag.description}</p>
                <div className={styles.flagMeta}>
                  <span className={styles.affectedUsers}>
                    Affects <strong>{flag.affectedUsers.toLocaleString()}</strong> users
                  </span>
                  {flag.lastModifiedBy && flag.lastModifiedAt && (
                    <span className={styles.lastModified}>
                      Last modified by <strong>{flag.lastModifiedBy}</strong> on{' '}
                      {new Date(flag.lastModifiedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Flag Confirmation */}
      <ConfirmationModal
        isOpen={showToggleModal}
        onClose={() => { setShowToggleModal(false); setSelectedFlag(null); }}
        onConfirm={() => selectedFlag && handleToggleFlag(selectedFlag)}
        title={`${selectedFlag?.enabled ? 'Disable' : 'Enable'} ${selectedFlag?.name}`}
        message={`⚠️ Turning this ${selectedFlag?.enabled ? 'OFF' : 'ON'} will affect ${selectedFlag?.affectedUsers.toLocaleString()} users. Continue?`}
        confirmText="Confirm"
        confirmationType="medium"
        impact={`This affects ${selectedFlag?.affectedUsers.toLocaleString()} active users`}
        actionType="caution"
        lastPerformedBy={selectedFlag?.lastModifiedBy}
        lastPerformedDate={selectedFlag?.lastModifiedAt ? new Date(selectedFlag.lastModifiedAt).toLocaleDateString() : undefined}
      />

      {/* Maintenance Mode Confirmation */}
      <ConfirmationModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        onConfirm={handleToggleMaintenance}
        title={`${maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode`}
        message={`${maintenanceMode ? 'Disable maintenance mode to restore normal site access.' : '⚠️ This will display a maintenance page to all visitors.'}`}
        confirmText="Confirm"
        confirmationType="high"
        requireTyping="MAINTENANCE"
        impact="This affects all site visitors"
        actionType="destructive"
      />
    </AdminLayout>
  );
}
