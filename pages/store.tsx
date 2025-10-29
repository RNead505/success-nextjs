import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import styles from './Store.module.css';

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  category: string;
  link?: string;
};

type StorePageProps = {
  products: Product[];
  categories: string[];
};

export default function StorePage({ products, categories }: StorePageProps) {
  return (
    <Layout>
      <SEO
        title="SUCCESS Store - Books, Courses & Merchandise"
        description="Shop books, courses, merchandise and digital content from SUCCESS Magazine. Find resources for personal and professional development."
        url="https://www.success.com/store"
      />

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>SUCCESS Store</h1>
          <p className={styles.subtitle}>
            Books, courses, and resources to accelerate your personal and professional growth
          </p>
        </header>

        {/* Featured Products */}
        <section className={styles.featured}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <div className={styles.featuredGrid}>
            {products.filter(p => p.category === 'Featured').slice(0, 4).map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.title} loading="lazy" />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>{product.price}</p>
                  <a href={product.link || '#'} className={styles.buyButton}>
                    Add to Cart
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Categories */}
        {categories.map((category) => (
          <section key={category} className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>{category}</h2>
            <div className={styles.productsGrid}>
              {products
                .filter((p) => p.category === category)
                .map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      <img src={product.image} alt={product.title} loading="lazy" />
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productTitle}>{product.title}</h3>
                      <p className={styles.productPrice}>{product.price}</p>
                      <a href={product.link || '#'} className={styles.buyButton}>
                        Add to Cart
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}

        {/* Magazine Section */}
        <section className={styles.magazineSection}>
          <h2 className={styles.sectionTitle}>SUCCESS Magazine</h2>
          <div className={styles.magazineContent}>
            <div className={styles.magazineInfo}>
              <h3>Current Issue</h3>
              <p className={styles.issueTitle}>November/December 2025 - The Legacy Issue</p>
              <p className={styles.issueFeatured}>Featuring: Russell Brunson</p>
              <p className={styles.magazinePrice}>$9.99</p>
              <a href="/magazine" className={styles.buyButton}>
                View Current Issue
              </a>
            </div>
            <div className={styles.magazineImage}>
              {/* Magazine cover would go here */}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>Looking for More?</h2>
          <p>Explore our full catalog of books, courses, and digital content</p>
          <div className={styles.ctaButtons}>
            <a href="/bestsellers" className={styles.ctaButton}>
              View Bestsellers
            </a>
            <a href="/success-plus" className={styles.ctaButton}>
              Join SUCCESS+
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Featured and categorized products from mysuccessplus.com
  const products: Product[] = [
    // Featured Products
    {
      id: '1',
      title: 'Jim Rohn Book Bundle',
      price: '$129.99',
      image: 'https://www.success.com/wp-content/uploads/2025/10/9781637634547.jpg',
      category: 'Featured',
    },
    {
      id: '2',
      title: 'SUCCESS Magazine - Latest Issue',
      price: '$9.99',
      image: 'https://www.success.com/wp-content/uploads/2025/10/9781633697263.jpg',
      category: 'Featured',
    },
    {
      id: '3',
      title: 'The SUCCESS Starts Here Journal',
      price: '$14.99',
      image: 'https://www.success.com/wp-content/uploads/2025/10/9780593797204.jpg',
      category: 'Featured',
    },
    {
      id: '4',
      title: 'SUCCESS EST. 1897 Stone Cap',
      price: '$24.99',
      image: 'https://www.success.com/wp-content/uploads/2025/10/9780593714256.jpg',
      category: 'Featured',
    },

    // Books
    {
      id: '5',
      title: 'The Five Major Pieces to the Life Puzzle',
      price: '$24.99',
      image: 'https://www.success.com/wp-content/uploads/2025/10/9780306836510.jpg',
      category: 'Books',
    },
    {
      id: '6',
      title: 'The Seasons of Life',
      price: '$19.99',
      image: 'https://www.success.com/wp-content/uploads/2025/10/9781668051535.jpg',
      category: 'Books',
    },
    {
      id: '7',
      title: 'Twelve Pillars',
      price: '$22.99',
      image: 'https://www.success.com/wp-content/uploads/2025/09/9781647821043.jpg',
      category: 'Books',
    },
    {
      id: '8',
      title: 'Leading an Inspired Life',
      price: '$29.99',
      image: 'https://www.success.com/wp-content/uploads/2025/09/9781637747124.jpg',
      category: 'Books',
    },

    // Courses
    {
      id: '9',
      title: "Jim Rohn's Foundations for Success",
      price: '$199.99',
      image: 'https://www.success.com/wp-content/uploads/2025/09/9780593084526.jpg',
      category: 'Courses',
    },
    {
      id: '10',
      title: 'Leadership Masterclass',
      price: '$149.99',
      image: 'https://www.success.com/wp-content/uploads/2025/10/9781637634547.jpg',
      category: 'Courses',
    },
  ];

  const categories = ['Books', 'Courses', 'Merchandise'];

  return {
    props: {
      products,
      categories,
    },
    revalidate: 86400, // 24 hours
  };
};
