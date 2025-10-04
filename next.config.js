/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.success.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Enable compression
  compress: true,
  // Optimize production build
  productionBrowserSourceMaps: false,
  // Enable SWC minification for faster builds
  swcMinify: true,
};

module.exports = nextConfig;