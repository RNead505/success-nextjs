import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Auth.module.css';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForced, setIsForced] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        setIsForced(!data.user.hasChangedDefaultPassword);
      } catch (err) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const hasUppercase = /[A-Z]/.test(formData.newPassword);
    const hasLowercase = /[a-z]/.test(formData.newPassword);
    const hasNumber = /[0-9]/.test(formData.newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      setError('Password must include uppercase, lowercase, and number');
      return;
    }

    if (formData.newPassword === 'SUCCESS123!') {
      setError('You cannot use the default password. Please choose a new password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to change password');
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isForced) {
      router.push('/admin');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <div className={styles.authHeader}>
          <h1>Change Password</h1>
          {isForced && (
            <p className={styles.warningText}>
              For security, you must change your password before accessing the admin
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="Enter current password"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="Enter new password"
              disabled={loading}
            />
            <small className={styles.helpText}>
              Must be at least 8 characters with uppercase, lowercase, and number
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
            {!isForced && (
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
