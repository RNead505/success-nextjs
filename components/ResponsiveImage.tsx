import { useState, useEffect } from 'react';
import styles from './ResponsiveImage.module.css';

interface ImageVariant {
  url: string;
  width: number;
  height: number;
  format: 'webp' | 'jpeg' | 'png';
  size: number;
}

interface ResponsiveImageProps {
  src: string;
  alt: string;
  variants?: ImageVariant[];
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  sizes?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  variants = [],
  width,
  height,
  priority = false,
  className = '',
  objectFit = 'cover',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Separate variants by format
  const webpVariants = variants.filter(v => v.format === 'webp').sort((a, b) => a.width - b.width);
  const jpegVariants = variants.filter(v => v.format === 'jpeg').sort((a, b) => a.width - b.width);

  // Generate srcset strings
  const webpSrcSet = webpVariants.length > 0
    ? webpVariants.map(v => `${v.url} ${v.width}w`).join(', ')
    : null;

  const jpegSrcSet = jpegVariants.length > 0
    ? jpegVariants.map(v => `${v.url} ${v.width}w`).join(', ')
    : null;

  // Use largest variant as fallback, or original src
  const fallbackSrc = jpegVariants.length > 0
    ? jpegVariants[jpegVariants.length - 1].url
    : src;

  // Preload if priority
  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = fallbackSrc;
      if (webpSrcSet) {
        link.setAttribute('imagesrcset', webpSrcSet);
        link.setAttribute('type', 'image/webp');
      }
      document.head.appendChild(link);
    }
  }, [priority, fallbackSrc, webpSrcSet]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  if (error) {
    return (
      <div className={`${styles.error} ${className}`}>
        <span>Failed to load image</span>
      </div>
    );
  }

  return (
    <picture className={`${styles.container} ${className}`}>
      {/* WebP source */}
      {webpSrcSet && (
        <source
          type="image/webp"
          srcSet={webpSrcSet}
          sizes={sizes}
        />
      )}

      {/* JPEG/PNG source */}
      {jpegSrcSet && (
        <source
          type="image/jpeg"
          srcSet={jpegSrcSet}
          sizes={sizes}
        />
      )}

      {/* Fallback image */}
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${styles.image} ${loaded ? styles.loaded : styles.loading} ${styles[objectFit]}`}
        style={{
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
        }}
      />

      {/* Loading skeleton */}
      {!loaded && (
        <div className={styles.skeleton} style={{
          paddingBottom: width && height ? `${(height / width) * 100}%` : '56.25%',
        }} />
      )}
    </picture>
  );
}
