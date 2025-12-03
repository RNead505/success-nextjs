import { useState } from 'react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmationType?: 'low' | 'medium' | 'high';
  requireTyping?: string; // Text user must type to confirm (for high-risk actions)
  impact?: string; // e.g., "This affects 1,247 active users"
  actionType?: 'safe' | 'caution' | 'destructive';
  lastPerformedBy?: string;
  lastPerformedDate?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmationType = 'medium',
  requireTyping,
  impact,
  actionType = 'caution',
  lastPerformedBy,
  lastPerformedDate,
}: ConfirmationModalProps) {
  const [typedText, setTypedText] = useState('');
  const [showSecondConfirmation, setShowSecondConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmationType === 'high' && !showSecondConfirmation) {
      // Show second confirmation for high-risk actions
      setShowSecondConfirmation(true);
      return;
    }

    if (requireTyping && typedText !== requireTyping) {
      return;
    }

    onConfirm();
    handleClose();
  };

  const handleClose = () => {
    setTypedText('');
    setShowSecondConfirmation(false);
    onClose();
  };

  const isConfirmDisabled = requireTyping && typedText !== requireTyping;

  const getButtonClass = () => {
    switch (actionType) {
      case 'safe':
        return styles.confirmButtonSafe;
      case 'caution':
        return styles.confirmButtonCaution;
      case 'destructive':
        return styles.confirmButtonDestructive;
      default:
        return styles.confirmButtonCaution;
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {actionType === 'destructive' && '⚠️ '}
            {title}
          </h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.body}>
          {!showSecondConfirmation ? (
            <>
              <p className={styles.message}>{message}</p>

              {impact && (
                <div className={styles.impact}>
                  <strong>Impact:</strong> {impact}
                </div>
              )}

              {lastPerformedBy && lastPerformedDate && (
                <div className={styles.lastPerformed}>
                  <small>
                    Last performed by <strong>{lastPerformedBy}</strong> on{' '}
                    <strong>{lastPerformedDate}</strong>
                  </small>
                </div>
              )}

              {requireTyping && (
                <div className={styles.typeConfirm}>
                  <label htmlFor="confirmTyping" className={styles.label}>
                    Type <code className={styles.code}>{requireTyping}</code> to confirm:
                  </label>
                  <input
                    id="confirmTyping"
                    type="text"
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    className={styles.input}
                    placeholder={`Type ${requireTyping}`}
                    autoFocus
                  />
                </div>
              )}
            </>
          ) : (
            <div className={styles.secondConfirmation}>
              <p className={styles.warningText}>
                ⚠️ <strong>Are you absolutely sure?</strong>
              </p>
              <p className={styles.message}>This action cannot be undone.</p>
              {impact && (
                <div className={styles.impact}>
                  <strong>Impact:</strong> {impact}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={handleClose}>
            {cancelText}
          </button>
          <button
            className={getButtonClass()}
            onClick={handleConfirm}
            disabled={!!isConfirmDisabled}
          >
            {showSecondConfirmation ? 'Yes, I\'m Sure' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
