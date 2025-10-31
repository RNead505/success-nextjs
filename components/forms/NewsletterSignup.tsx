import { useState } from 'react';
import styles from './NewsletterSignup.module.css';

interface NewsletterSignupProps {
  source?: string; // Track where signup came from
  inline?: boolean; // Inline vs modal styling
  placeholder?: string;
  buttonText?: string;
}

export default function NewsletterSignup({
  source = 'website',
  inline = false,
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe'
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email address');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          source
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Thanks for subscribing! Check your email for confirmation.');
        setEmail('');
        setFirstName('');

        // Track conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            method: source
          });
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div className={inline ? styles.inlineContainer : styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>
          {!inline && (
            <input
              type="text"
              placeholder="First Name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.input}
              disabled={status === 'loading'}
            />
          )}

          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            disabled={status === 'loading'}
          />

          <button
            type="submit"
            disabled={status === 'loading'}
            className={styles.button}
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
        </div>

        {message && (
          <div className={status === 'success' ? styles.successMessage : styles.errorMessage}>
            {message}
          </div>
        )}
      </form>

      {!inline && (
        <p className={styles.disclaimer}>
          By subscribing, you agree to receive our newsletter and accept our{' '}
          <a href="/privacy">Privacy Policy</a>. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}
