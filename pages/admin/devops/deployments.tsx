import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import ConfirmationModal from '../../../components/admin/ConfirmationModal';
import styles from './Deployments.module.css';

interface Deployment {
  id: string;
  version: string;
  branch: string;
  commit: string;
  deployedBy: string;
  deployedAt: string;
  status: 'success' | 'failed' | 'in_progress';
  environment: 'production' | 'staging';
}

export default function DeploymentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [currentVersion, setCurrentVersion] = useState('');
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);

  useEffect(() => {
    if (session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'ADMIN') {
      router.push('/admin');
      return;
    }
    fetchDeployments();
  }, [session]);

  const fetchDeployments = async () => {
    try {
      const res = await fetch('/api/admin/devops/deployments');
      if (res.ok) {
        const data = await res.json();
        setDeployments(data.deployments);
        setCurrentVersion(data.currentVersion);
      }
    } catch (error) {
      console.error('Error fetching deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const res = await fetch('/api/admin/devops/deployments/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment: 'production' }),
      });

      if (res.ok) {
        alert('Deployment initiated successfully!');
        fetchDeployments();
      } else {
        const error = await res.json();
        alert(`Deployment failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deploying:', error);
      alert('Deployment failed. Please try again.');
    } finally {
      setDeploying(false);
      setShowDeployModal(false);
    }
  };

  const handleRollback = async (deploymentId: string) => {
    setDeploying(true);
    try {
      const res = await fetch('/api/admin/devops/deployments/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deploymentId }),
      });

      if (res.ok) {
        alert('Rollback initiated successfully!');
        fetchDeployments();
      } else {
        const error = await res.json();
        alert(`Rollback failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error rolling back:', error);
      alert('Rollback failed. Please try again.');
    } finally {
      setDeploying(false);
      setShowRollbackModal(false);
      setSelectedDeployment(null);
    }
  };

  const openRollbackModal = (deployment: Deployment) => {
    setSelectedDeployment(deployment);
    setShowRollbackModal(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading deployments...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Deployments Dashboard</h1>
            <p className={styles.subtitle}>Manage production deployments and rollbacks</p>
          </div>
          <button
            className={styles.deployButton}
            onClick={() => setShowDeployModal(true)}
            disabled={deploying}
          >
            {deploying ? 'Deploying...' : '🚀 Deploy Latest'}
          </button>
        </div>

        <div className={styles.currentVersion}>
          <div className={styles.versionBadge}>
            <span className={styles.versionLabel}>Current Version:</span>
            <span className={styles.versionNumber}>{currentVersion || 'v1.0.0'}</span>
          </div>
          <div className={styles.versionInfo}>
            <span>Environment: <strong>Production</strong></span>
            <span className={styles.statusDot}>●</span>
            <span className={styles.statusText}>Live</span>
          </div>
        </div>

        <div className={styles.deploymentsSection}>
          <h2 className={styles.sectionTitle}>Deployment History</h2>

          {deployments.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No deployments yet</p>
            </div>
          ) : (
            <div className={styles.deploymentsList}>
              {deployments.map((deployment) => (
                <div key={deployment.id} className={styles.deploymentCard}>
                  <div className={styles.deploymentHeader}>
                    <div className={styles.deploymentVersion}>
                      <span className={styles.versionTag}>{deployment.version}</span>
                      <span className={`${styles.statusBadge} ${styles[deployment.status]}`}>
                        {deployment.status === 'success' ? '✓ Success' :
                         deployment.status === 'failed' ? '✗ Failed' :
                         '⟳ In Progress'}
                      </span>
                    </div>
                    {deployment.status === 'success' && deployment.version !== currentVersion && (
                      <button
                        className={styles.rollbackButton}
                        onClick={() => openRollbackModal(deployment)}
                        disabled={deploying}
                      >
                        ⟲ Rollback
                      </button>
                    )}
                  </div>

                  <div className={styles.deploymentDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Branch:</span>
                      <span className={styles.detailValue}>{deployment.branch}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Commit:</span>
                      <span className={styles.detailValue}>
                        <code>{deployment.commit.substring(0, 8)}</code>
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Deployed by:</span>
                      <span className={styles.detailValue}>{deployment.deployedBy}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Deployed at:</span>
                      <span className={styles.detailValue}>
                        {new Date(deployment.deployedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Environment:</span>
                      <span className={styles.detailValue}>
                        {deployment.environment}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deploy Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        onConfirm={handleDeploy}
        title="Deploy Latest Version"
        message="⚠️ Are you sure you want to deploy the latest version? This will update the live production site."
        confirmText="Deploy"
        confirmationType="high"
        requireTyping="DEPLOY"
        impact="This will affect all live site visitors"
        actionType="destructive"
        lastPerformedBy={deployments[0]?.deployedBy}
        lastPerformedDate={deployments[0]?.deployedAt ? new Date(deployments[0].deployedAt).toLocaleDateString() : undefined}
      />

      {/* Rollback Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRollbackModal}
        onClose={() => {
          setShowRollbackModal(false);
          setSelectedDeployment(null);
        }}
        onConfirm={() => selectedDeployment && handleRollback(selectedDeployment.id)}
        title="Rollback Deployment"
        message={`⚠️ Are you sure you want to rollback to version ${selectedDeployment?.version}? This will revert the live site to a previous state.`}
        confirmText="Rollback"
        confirmationType="high"
        requireTyping="ROLLBACK"
        impact="This will affect all live site visitors"
        actionType="destructive"
      />
    </AdminLayout>
  );
}
