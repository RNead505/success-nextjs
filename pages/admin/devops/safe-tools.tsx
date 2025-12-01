import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import ConfirmationModal from '../../../components/admin/ConfirmationModal';
import styles from './SafeTools.module.css';

export default function SafeToolsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.role !== 'SUPER_ADMIN') {
      router.push('/admin');
    }
  }, [session]);

  const tools = [
    { id: 'rebuild-search', name: 'Rebuild Search Index', icon: '🔍', risk: 'medium', description: 'Rebuilds the search index. Takes 5-10 minutes.', confirmationType: 'medium' as const },
    { id: 'regen-sitemap', name: 'Regenerate Sitemaps', icon: '🗺️', risk: 'low', description: 'Regenerates XML sitemaps for SEO.', confirmationType: 'medium' as const },
    { id: 'send-test-email', name: 'Send Test Email', icon: '✉️', risk: 'safe', description: 'Sends a test email to verify email configuration.', confirmationType: 'low' as const },
    { id: 'verify-webhooks', name: 'Verify Webhooks', icon: '⚡', risk: 'safe', description: 'Tests all configured webhooks.', confirmationType: 'low' as const },
    { id: 'db-health-check', name: 'Database Health Check', icon: '💾', risk: 'safe', description: 'Runs diagnostics on database connections (read-only).', confirmationType: 'low' as const },
    { id: 'clear-cache', name: 'Clear Application Cache', icon: '🗑️', risk: 'medium', description: 'Clears all application caches. May slow site temporarily.', confirmationType: 'medium' as const },
  ];

  const handleToolClick = (tool: typeof tools[0]) => {
    if (tool.risk === 'safe') {
      // Run safe tools immediately
      runTool(tool.id);
    } else {
      // Show confirmation for non-safe tools
      setSelectedTool(tool);
      setShowModal(true);
    }
  };

  const runTool = async (toolId: string) => {
    setProcessing(toolId);
    try {
      const res = await fetch('/api/admin/devops/safe-tools/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✓ ${data.message}`);
      } else {
        alert('✗ Tool execution failed');
      }
    } catch (error) {
      console.error('Error running tool:', error);
      alert('✗ Tool execution failed');
    } finally {
      setProcessing(null);
      setShowModal(false);
      setSelectedTool(null);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe': return '#10b981';
      case 'low': return '#3b82f6';
      case 'medium': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Safe Tools</h1>
            <p className={styles.subtitle}>System maintenance and diagnostic tools</p>
          </div>
        </div>

        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <div key={tool.id} className={styles.toolCard}>
              <div className={styles.toolIcon}>{tool.icon}</div>
              <h3 className={styles.toolName}>{tool.name}</h3>
              <p className={styles.toolDescription}>{tool.description}</p>
              <div className={styles.toolFooter}>
                <span
                  className={styles.riskBadge}
                  style={{ backgroundColor: getRiskColor(tool.risk) }}
                >
                  {tool.risk === 'safe' ? '✓ Safe' : tool.risk === 'low' ? 'Low Risk' : 'Medium Risk'}
                </span>
                <button
                  className={`${styles.runButton} ${tool.risk === 'safe' ? styles.safe : tool.risk === 'medium' ? styles.caution : styles.default}`}
                  onClick={() => handleToolClick(tool)}
                  disabled={processing !== null}
                >
                  {processing === tool.id ? '⟳ Running...' : '▶ Run'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedTool(null); }}
        onConfirm={() => selectedTool && runTool(selectedTool.id)}
        title={`Run ${selectedTool?.name}`}
        message={selectedTool?.description || ''}
        confirmText="Run Tool"
        confirmationType={selectedTool?.confirmationType}
        actionType={selectedTool?.risk === 'medium' ? 'caution' : 'safe'}
      />
    </AdminLayout>
  );
}
