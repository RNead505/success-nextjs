import Link from 'next/link';
import styles from './UpsellAd.module.css';

type UpsellAdProps = {
  variant?: 'primary' | 'secondary' | 'sidebar';
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
};

export default function UpsellAd({
  variant = 'primary',
  title = 'Unlock Premium Content',
  description = 'Get unlimited access to exclusive articles, videos, and resources with SUCCESS+',
  ctaText = 'Start Your Free Trial',
  ctaLink = '/success-plus'
}: UpsellAdProps) {
  if (variant === 'sidebar') {
    return (
      <div className={styles.sidebarAd}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarBadge}>PREMIUM</div>
          <h3 className={styles.sidebarTitle}>SUCCESS+</h3>
          <p className={styles.sidebarText}>
            Exclusive content, expert insights, and unlimited access
          </p>
          <Link href={ctaLink} className={styles.sidebarCta}>
            {ctaText}
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'secondary') {
    return (
      <div className={styles.secondaryAd}>
        <div className={styles.secondaryContent}>
          <div className={styles.secondaryIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 0L24.5 15.5L40 20L24.5 24.5L20 40L15.5 24.5L0 20L15.5 15.5L20 0Z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.secondaryText}>
            <h3 className={styles.secondaryTitle}>{title}</h3>
            <p className={styles.secondaryDescription}>{description}</p>
          </div>
          <Link href={ctaLink} className={styles.secondaryCta}>
            {ctaText} →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.primaryAd}>
      <div className={styles.primaryContent}>
        <div className={styles.primaryBadge}>LIMITED OFFER</div>
        <h2 className={styles.primaryTitle}>{title}</h2>
        <p className={styles.primaryDescription}>{description}</p>
        <Link href={ctaLink} className={styles.primaryCta}>
          {ctaText}
        </Link>
        <p className={styles.primaryFooter}>Cancel anytime • No credit card required</p>
      </div>
    </section>
  );
}
