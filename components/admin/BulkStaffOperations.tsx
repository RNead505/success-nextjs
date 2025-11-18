import { useState } from 'react';
import styles from './BulkStaffOperations.module.css';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface BulkStaffOperationsProps {
  onComplete?: () => void;
}

export default function BulkStaffOperations({ onComplete }: BulkStaffOperationsProps) {
  const [operationType, setOperationType] = useState<'assign' | 'transfer'>('assign');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [action, setAction] = useState('');
  const [newRole, setNewRole] = useState('');
  const [fromUserId, setFromUserId] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [transferType, setTransferType] = useState('ALL_CONTENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);
  const [staffLoaded, setStaffLoaded] = useState(false);

  const loadStaff = async () => {
    try {
      const response = await fetch('/api/admin/staff');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load staff');
      }

      setAllStaff(data.staff || []);
      setStaffLoaded(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStaffSelection = (staffId: string) => {
    setSelectedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStaff.length === allStaff.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(allStaff.map(s => s.id));
    }
  };

  const handleBulkAssign = async () => {
    if (selectedStaff.length === 0) {
      setError('Please select at least one staff member');
      return;
    }

    if (!action) {
      setError('Please select an action');
      return;
    }

    if (action === 'UPDATE_ROLE' && !newRole) {
      setError('Please select a new role');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/staff/bulk-assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedStaff,
          action,
          newRole: action === 'UPDATE_ROLE' ? newRole : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform bulk operation');
      }

      setSuccess(`Successfully processed ${data.processedItems} of ${data.totalItems} staff members`);

      if (data.errors.length > 0) {
        setError(`Errors: ${data.errors.join(', ')}`);
      }

      setSelectedStaff([]);
      onComplete?.();

      // Reload staff list
      await loadStaff();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkTransfer = async () => {
    if (!fromUserId || !toUserId) {
      setError('Please select both source and destination users');
      return;
    }

    if (fromUserId === toUserId) {
      setError('Source and destination users must be different');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/staff/bulk-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId,
          toUserId,
          transferType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform bulk transfer');
      }

      setSuccess(
        `Successfully transferred ${data.processedItems} of ${data.totalItems} items from ${data.fromUser.name} to ${data.toUser.name}`
      );

      if (data.errors.length > 0) {
        setError(`Errors: ${data.errors.join(', ')}`);
      }

      setFromUserId('');
      setToUserId('');
      onComplete?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!staffLoaded) {
    return (
      <div className={styles.container}>
        <button onClick={loadStaff} className={styles.loadButton}>
          Load Staff for Bulk Operations
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Bulk Staff Operations</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${operationType === 'assign' ? styles.active : ''}`}
            onClick={() => setOperationType('assign')}
          >
            Bulk Assign
          </button>
          <button
            className={`${styles.tab} ${operationType === 'transfer' ? styles.active : ''}`}
            onClick={() => setOperationType('transfer')}
          >
            Transfer Content
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {operationType === 'assign' ? (
        <div className={styles.assignSection}>
          <div className={styles.actionSelector}>
            <label>Bulk Action:</label>
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="">Select action...</option>
              <option value="UPDATE_ROLE">Update Role</option>
              <option value="ACTIVATE">Activate Accounts</option>
              <option value="DEACTIVATE">Deactivate Accounts</option>
            </select>

            {action === 'UPDATE_ROLE' && (
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="">Select new role...</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
                <option value="AUTHOR">Author</option>
              </select>
            )}
          </div>

          <div className={styles.staffList}>
            <div className={styles.listHeader}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedStaff.length === allStaff.length}
                  onChange={handleSelectAll}
                />
                Select All ({allStaff.length} staff members)
              </label>
            </div>

            <div className={styles.staffItems}>
              {allStaff.map((staff) => (
                <div key={staff.id} className={styles.staffItem}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(staff.id)}
                      onChange={() => handleStaffSelection(staff.id)}
                    />
                    <div className={styles.staffInfo}>
                      <span className={styles.staffName}>{staff.name}</span>
                      <span className={styles.staffEmail}>{staff.email}</span>
                      <span className={styles.staffRole}>{staff.role}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <p className={styles.selectionCount}>
              {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={handleBulkAssign}
              disabled={loading || selectedStaff.length === 0 || !action}
              className={styles.submitButton}
            >
              {loading ? 'Processing...' : 'Apply Bulk Action'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.transferSection}>
          <div className={styles.transferForm}>
            <div className={styles.formGroup}>
              <label>Transfer From:</label>
              <select value={fromUserId} onChange={(e) => setFromUserId(e.target.value)}>
                <option value="">Select staff member...</option>
                {allStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.email}) - {staff.role}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Transfer To:</label>
              <select value={toUserId} onChange={(e) => setToUserId(e.target.value)}>
                <option value="">Select staff member...</option>
                {allStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.email}) - {staff.role}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Transfer Type:</label>
              <select value={transferType} onChange={(e) => setTransferType(e.target.value)}>
                <option value="ALL_CONTENT">All Content & Posts</option>
                <option value="PENDING_ONLY">Pending/Draft Items Only</option>
              </select>
            </div>

            <div className={styles.transferInfo}>
              <h4>Transfer Details</h4>
              <p>
                This will transfer content ownership from the source user to the destination user.
                The original author information will be preserved in revision history.
              </p>
              <ul>
                <li><strong>All Content:</strong> Transfers all editorial calendar items and posts</li>
                <li><strong>Pending Only:</strong> Transfers only drafts and in-progress items</li>
              </ul>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={handleBulkTransfer}
              disabled={loading || !fromUserId || !toUserId}
              className={styles.submitButton}
            >
              {loading ? 'Transferring...' : 'Transfer Content'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
