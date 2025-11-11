/**
 * Google Analytics 4 Tracking Utilities
 *
 * Usage:
 * - Import and use these functions to track custom events
 * - Page views are tracked automatically via _app.tsx
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Track a pageview event
 * @param url - The page URL to track
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    });
  }
};

/**
 * Track a custom event
 * @param action - The action name (e.g., 'subscribe', 'purchase', 'login')
 * @param params - Additional event parameters
 */
export const event = ({ action, category, label, value }: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track newsletter subscription
 */
export const trackNewsletterSubscription = (email: string) => {
  event({
    action: 'newsletter_subscribe',
    category: 'engagement',
    label: email,
  });
};

/**
 * Track article read (scroll depth)
 */
export const trackArticleRead = (articleSlug: string, scrollPercent: number) => {
  if (scrollPercent >= 75) {
    event({
      action: 'article_read',
      category: 'engagement',
      label: articleSlug,
      value: scrollPercent,
    });
  }
};

/**
 * Track subscription purchase
 */
export const trackSubscriptionPurchase = (tier: string, amount: number) => {
  event({
    action: 'purchase',
    category: 'ecommerce',
    label: `SUCCESS+ ${tier}`,
    value: amount,
  });
};

/**
 * Track user login
 */
export const trackLogin = (method: string) => {
  event({
    action: 'login',
    category: 'user',
    label: method,
  });
};

/**
 * Track user registration
 */
export const trackRegistration = (method: string) => {
  event({
    action: 'sign_up',
    category: 'user',
    label: method,
  });
};

/**
 * Track search queries
 */
export const trackSearch = (query: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: query,
  });
};

/**
 * Track video play
 */
export const trackVideoPlay = (videoTitle: string) => {
  event({
    action: 'video_play',
    category: 'engagement',
    label: videoTitle,
  });
};

/**
 * Track podcast play
 */
export const trackPodcastPlay = (podcastTitle: string) => {
  event({
    action: 'podcast_play',
    category: 'engagement',
    label: podcastTitle,
  });
};

/**
 * Track social share
 */
export const trackShare = (platform: string, contentTitle: string) => {
  event({
    action: 'share',
    category: 'engagement',
    label: `${platform}: ${contentTitle}`,
  });
};

/**
 * Track outbound link click
 */
export const trackOutboundLink = (url: string) => {
  event({
    action: 'click',
    category: 'outbound',
    label: url,
  });
};
