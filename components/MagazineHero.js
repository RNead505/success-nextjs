import styles from './MagazineHero.module.css';
import { decodeHtmlEntities } from '../lib/htmlDecode';

export default function MagazineHero({ magazine }) {
  if (!magazine) {
    return null;
  }

  const heroImage = magazine._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                    magazine.meta_data?.['image-for-listing-page']?.[0] ||
                    '';
  const title = magazine.meta_data?.['magazine-banner-heading']?.[0] || magazine.title?.rendered || '';
  const date = magazine.meta_data?.['magazine-published-text']?.[0] || '';
  const description = magazine.meta_data?.['magazine-banner-description']?.[0] || '';

  // Parse related articles if available
  const relatedDataRaw = magazine.meta_data?.['magazine-banner-related-data']?.[0];
  let sideFeatures = [];

  if (relatedDataRaw) {
    try {
      // PHP serialized data - extract articles manually
      const item0Match = relatedDataRaw.match(/item-0.*?banner-related-data-title";s:\d+:"([^"]+)".*?banner-related-data-description";s:\d+:"([^"]+)"/);
      const item1Match = relatedDataRaw.match(/item-1.*?banner-related-data-title";s:\d+:"([^"]+)".*?banner-related-data-description";s:\d+:"([^"]+)"/);

      if (item0Match) {
        sideFeatures.push({ title: item0Match[1], description: item0Match[2] });
      }
      if (item1Match) {
        sideFeatures.push({ title: item1Match[1], description: item1Match[2] });
      }
    } catch (e) {
      console.error('Error parsing magazine related data:', e);
    }
  }

  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
      <div className={styles.overlay}>
        <div className={styles.header}>
          <span className={styles.headerText}>Inside the Magazine</span>
        </div>
        <div className={styles.contentGrid}>
          <div className={styles.mainFeature}>
            <p className={styles.subheading}>{magazine.slug?.replace(/-/g, ' ').toUpperCase() || 'The Legacy Issue'}</p>
            <p className={styles.date}>{decodeHtmlEntities(date)}</p>
            <h1 className={styles.title}>{decodeHtmlEntities(title)}</h1>
            <p className={styles.description}>{decodeHtmlEntities(description)}</p>
          </div>
          <div className={styles.sideFeatures}>
            {sideFeatures.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <h3>{decodeHtmlEntities(feature.title)}</h3>
                <p>{decodeHtmlEntities(feature.description)}</p>
              </div>
            ))}
            <p className={styles.subscribeText}>
              Subscribe now to enjoy these and other exclusive featured content!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}