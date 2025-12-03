/**
 * WooCommerce API Client
 * Two-way sync for order fulfillment
 */

import crypto from 'crypto';

interface WooCommerceConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
}

class WooCommerceAPI {
  private config: WooCommerceConfig;

  constructor(config: WooCommerceConfig) {
    this.config = config;
  }

  /**
   * Generate OAuth 1.0a signature for WooCommerce API
   */
  private generateOAuthSignature(method: string, url: string, params: Record<string, string>) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(this.config.consumerSecret)}&`;

    return crypto
      .createHmac('sha1', signingKey)
      .update(baseString)
      .digest('base64');
  }

  /**
   * Make authenticated request to WooCommerce API
   */
  private async request(method: string, endpoint: string, data?: any) {
    const url = `${this.config.url}/wp-json/wc/v3${endpoint}`;

    // OAuth 1.0a parameters
    const oauthParams: Record<string, string> = {
      oauth_consumer_key: this.config.consumerKey,
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
    };

    // Generate signature
    const signature = this.generateOAuthSignature(method, url, oauthParams);
    oauthParams.oauth_signature = signature;

    // Build URL with OAuth params
    const queryString = Object.keys(oauthParams)
      .map(key => `${key}=${encodeURIComponent(oauthParams[key])}`)
      .join('&');

    const fullUrl = `${url}?${queryString}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WooCommerce API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * Update order status in WooCommerce
   */
  async updateOrderStatus(orderId: number, status: string) {
    return this.request('PUT', `/orders/${orderId}`, { status });
  }

  /**
   * Add tracking information to WooCommerce order
   * Note: Requires a tracking plugin like "Shipment Tracking" or similar
   */
  async addTracking(orderId: number, trackingData: {
    trackingNumber: string;
    trackingCarrier: string;
    trackingUrl?: string;
    dateShipped?: string;
  }) {
    // Update order meta with tracking info
    return this.request('POST', `/orders/${orderId}/notes`, {
      note: `Tracking Number: ${trackingData.trackingNumber}\nCarrier: ${trackingData.trackingCarrier}${trackingData.trackingUrl ? `\nTrack: ${trackingData.trackingUrl}` : ''}`,
      customer_note: true, // Make visible to customer
    });
  }

  /**
   * Mark order as completed in WooCommerce
   */
  async completeOrder(orderId: number) {
    return this.updateOrderStatus(orderId, 'completed');
  }

  /**
   * Get order details from WooCommerce
   */
  async getOrder(orderId: number) {
    return this.request('GET', `/orders/${orderId}`);
  }

  /**
   * Add note to WooCommerce order
   */
  async addOrderNote(orderId: number, note: string, customerNote: boolean = false) {
    return this.request('POST', `/orders/${orderId}/notes`, {
      note,
      customer_note: customerNote,
    });
  }
}

// Initialize WooCommerce client
export const woocommerce = new WooCommerceAPI({
  url: process.env.WOOCOMMERCE_STORE_URL || 'https://mysuccessplus.com',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
});

export default woocommerce;
