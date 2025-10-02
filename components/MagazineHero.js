import styles from './MagazineHero.module.css'; // This line must be correct

export default function MagazineHero() {
  const heroImage = "https://www.success.com/wp-content/uploads/2025/08/sd25-05-september-featured-scaled.jpg";

  return (
    // Make sure the `className` uses the `styles` object
    <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
      <div className={styles.overlay}>
        <div className={styles.header}>
          <span className={styles.headerText}>Inside the Magazine</span>
        </div>
        <div className={styles.contentGrid}>
          <div className={styles.mainFeature}>
            <p className={styles.subheading}>The Startup Launch Guide</p>
            <p className={styles.date}>September 2025</p>
            <h1 className={styles.title}>Jesse Itzler</h1>
            <p className={styles.description}>
              With a robust business portfolio built entirely off instinct and dedication...
            </p>
          </div>
          <div className={styles.sideFeatures}>
            <div className={styles.featureItem}>
              <h3>Bring Your Vision To Life</h3>
              <p>Don't skip these key business considerations when starting out</p>
            </div>
            <div className={styles.featureItem}>
              <h3>Artificial Intelligence, Real Results</h3>
              <p>How AI can save money and improve business operations</p>
            </div>
            <p className={styles.subscribeText}>
              Subscribe now to enjoy these and other exclusive featured content!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}