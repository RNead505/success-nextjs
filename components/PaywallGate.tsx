import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './PaywallGate.module.css';

interface PaywallGateProps {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  children: React.ReactNode;
}

export default function PaywallGate({
  articleId,
  articleTitle,
  articleUrl,
  children
}: PaywallGateProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isBlocked, setIsBlocked] = useState(false);
  const [articleCount, setArticleCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [config, setConfig] = useState({
    freeArticleLimit: 3,
    popupTitle: "You've reached your free article limit",
    popupMessage: "Subscribe to SUCCESS+ to get unlimited access to our premium content.",
    ctaButtonText: "Subscribe Now"
  });

  useEffect(() => {
    checkPaywallStatus();
  }, [session, articleId]);

  async function checkPaywallStatus() {
    try {
      // Fetch paywall config
      const configRes = await fetch('/api/paywall/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);

        // Check if paywall is disabled
        if (!configData.enablePaywall) {
          setIsBlocked(false);
          return;
        }

        // Check if article is bypassed
        if (configData.bypassedArticles?.includes(articleId)) {
          setIsBlocked(false);
          return;
        }
      }

      // Check subscription status
      if (session?.user?.subscription?.status === 'ACTIVE') {
        setIsBlocked(false);
        trackArticleView(false);
        return;
      }

      // Track view and check limit
      const response = await fetch('/api/paywall/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          articleTitle,
          articleUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        setArticleCount(data.count);

        if (data.blocked) {
          setIsBlocked(true);
          setShowPaywall(true);
        } else {
          setIsBlocked(false);
        }
      }
    } catch (error) {
      console.error('Paywall check failed:', error);
      // Fail open - don't block on error
      setIsBlocked(false);
    }
  }

  async function trackArticleView(blocked: boolean) {
    try {
      await fetch('/api/paywall/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          articleTitle,
          articleUrl,
          blocked,
          userId: session?.user?.id
        })
      });
    } catch (error) {
      console.error('Failed to track article view:', error);
    }
  }

  function handleSubscribe() {
    router.push('/subscribe');
  }

  function handleLogin() {
    router.push('/signin');
  }

  if (isBlocked && showPaywall) {
    return (
      <div className={styles.paywallContainer}>
        {/* Show preview of content */}
        <div className={styles.contentPreview}>
          <div className={styles.fade}>
            {children}
          </div>
        </div>

        {/* Paywall overlay */}
        <div className={styles.paywallOverlay}>
          <div className={styles.paywallModal}>
            <div className={styles.paywallIcon}>🔒</div>
            <h2 className={styles.paywallTitle}>{config.popupTitle}</h2>
            <p className={styles.paywallMessage}>{config.popupMessage}</p>

            <div className={styles.paywallStats}>
              <p>You've read <strong>{articleCount}</strong> of <strong>{config.freeArticleLimit}</strong> free articles this month.</p>
            </div>

            <div className={styles.paywallActions}>
              <button
                onClick={handleSubscribe}
                className={styles.primaryButton}
              >
                {config.ctaButtonText}
              </button>

              {!session && (
                <button
                  onClick={handleLogin}
                  className={styles.secondaryButton}
                >
                  Already a subscriber? Sign In
                </button>
              )}
            </div>

            <div className={styles.paywallBenefits}>
              <h3>SUCCESS+ Benefits:</h3>
              <ul>
                <li>✓ Unlimited access to all articles</li>
                <li>✓ Exclusive magazine content</li>
                <li>✓ Members-only newsletters</li>
                <li>✓ Ad-free reading experience</li>
                <li>✓ Access to video & podcast library</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has access - show full content
  return <>{children}</>;
}
