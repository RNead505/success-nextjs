import { put, del, list } from '@vercel/blob';
import sharp from 'sharp';

export interface ImageVariant {
  url: string;
  width: number;
  height: number;
  format: 'webp' | 'jpeg' | 'png';
  size: number;
}

export interface OptimizedImage {
  original: string;
  variants: ImageVariant[];
  blurhash?: string;
}

/**
 * Upload and optimize an image to Vercel Blob
 * Creates multiple variants (thumbnail, medium, large) and WebP versions
 */
export async function uploadAndOptimizeImage(
  file: Buffer,
  filename: string,
  options: {
    generateVariants?: boolean;
    maxWidth?: number;
    quality?: number;
  } = {}
): Promise<OptimizedImage> {
  const {
    generateVariants = true,
    maxWidth = 2000,
    quality = 80,
  } = options;

  const variants: ImageVariant[] = [];

  // Get image metadata
  const metadata = await sharp(file).metadata();
  const originalFormat = metadata.format as 'jpeg' | 'png' | 'webp';

  // Generate filename without extension
  const baseName = filename.replace(/\.[^/.]+$/, '');

  // Resize if needed
  let processedBuffer = file;
  if (metadata.width && metadata.width > maxWidth) {
    processedBuffer = await sharp(file)
      .resize(maxWidth, null, { withoutEnlargement: true })
      .toBuffer();
  }

  // Upload original (optimized)
  const originalOptimized = await sharp(processedBuffer)
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  const originalBlob = await put(`${baseName}-original.jpg`, originalOptimized, {
    access: 'public',
    addRandomSuffix: true,
  });

  if (!generateVariants) {
    return {
      original: originalBlob.url,
      variants: [{
        url: originalBlob.url,
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: 'jpeg',
        size: originalOptimized.length,
      }],
    };
  }

  // Generate variants
  const sizes = [
    { name: 'thumbnail', width: 150 },
    { name: 'small', width: 400 },
    { name: 'medium', width: 800 },
    { name: 'large', width: 1200 },
  ];

  for (const size of sizes) {
    // Only create variant if original is larger
    if (!metadata.width || metadata.width < size.width) continue;

    // JPEG variant
    const jpegBuffer = await sharp(file)
      .resize(size.width, null, { withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    const jpegBlob = await put(
      `${baseName}-${size.name}.jpg`,
      jpegBuffer,
      { access: 'public', addRandomSuffix: true }
    );

    const jpegMeta = await sharp(jpegBuffer).metadata();

    variants.push({
      url: jpegBlob.url,
      width: jpegMeta.width || size.width,
      height: jpegMeta.height || 0,
      format: 'jpeg',
      size: jpegBuffer.length,
    });

    // WebP variant (better compression)
    const webpBuffer = await sharp(file)
      .resize(size.width, null, { withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    const webpBlob = await put(
      `${baseName}-${size.name}.webp`,
      webpBuffer,
      { access: 'public', addRandomSuffix: true }
    );

    const webpMeta = await sharp(webpBuffer).metadata();

    variants.push({
      url: webpBlob.url,
      width: webpMeta.width || size.width,
      height: webpMeta.height || 0,
      format: 'webp',
      size: webpBuffer.length,
    });
  }

  return {
    original: originalBlob.url,
    variants,
  };
}

/**
 * Delete image and all its variants from Vercel Blob
 */
export async function deleteImage(urls: string[]): Promise<void> {
  await Promise.all(urls.map(url => del(url)));
}

/**
 * List all images in Vercel Blob
 */
export async function listImages(prefix?: string) {
  const { blobs } = await list({ prefix });
  return blobs;
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(variants: ImageVariant[]): string {
  return variants
    .filter(v => v.format === 'webp' || v.format === 'jpeg')
    .map(v => `${v.url} ${v.width}w`)
    .join(', ');
}

/**
 * Generate picture element HTML for responsive images
 */
export function generatePictureHTML(
  optimized: OptimizedImage,
  alt: string,
  className?: string
): string {
  const webpVariants = optimized.variants.filter(v => v.format === 'webp');
  const jpegVariants = optimized.variants.filter(v => v.format === 'jpeg');

  const webpSrcSet = generateSrcSet(webpVariants);
  const jpegSrcSet = generateSrcSet(jpegVariants);

  return `
    <picture>
      ${webpSrcSet ? `<source type="image/webp" srcset="${webpSrcSet}" />` : ''}
      ${jpegSrcSet ? `<source type="image/jpeg" srcset="${jpegSrcSet}" />` : ''}
      <img
        src="${optimized.original}"
        alt="${alt}"
        ${className ? `class="${className}"` : ''}
        loading="lazy"
        decoding="async"
      />
    </picture>
  `.trim();
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  } = options;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`,
    };
  }

  return { valid: true };
}
