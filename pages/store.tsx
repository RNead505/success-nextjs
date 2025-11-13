import { GetServerSideProps } from 'next';
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
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x500/1a1a1a/ffffff?text=' + encodeURIComponent(product.title.substring(0, 30));
                    }}
                  />
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
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x500/1a1a1a/ffffff?text=' + encodeURIComponent(product.title.substring(0, 30));
                        }}
                      />
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

export const getServerSideProps: GetServerSideProps = async () => {
  // Comprehensive product catalog from SUCCESS Store
  const products: Product[] = [
    // Featured Products
    {
      id: '1',
      title: 'Jim Rohn Book Bundle',
      price: '$97.00',
      image: 'https://www.success.com/wp-content/uploads/2023/jim-rohn-bundle.jpg',
      category: 'Featured',
      link: '/store/jim-rohn-bundle'
    },
    {
      id: '2',
      title: 'SUCCESS Magazine - November/December 2025',
      price: '$9.99',
      image: 'https://www.success.com/wp-content/uploads/2025/11/nov-dec-2025.jpg',
      category: 'Featured',
      link: '/magazine'
    },
    {
      id: '3',
      title: 'The SUCCESS Starts Here Journal',
      price: '$9.71',
      image: 'https://www.success.com/wp-content/uploads/2024/success-journal.jpg',
      category: 'Featured',
      link: '/store/success-journal'
    },
    {
      id: '4',
      title: 'SUCCESS EST. 1897 Stone Cap',
      price: '$24.99',
      image: 'https://www.success.com/wp-content/uploads/2024/success-cap.jpg',
      category: 'Featured',
      link: '/store/success-cap'
    },

    // Books - Jim Rohn Collection
    {
      id: '5',
      title: 'The Five Major Pieces to the Life Puzzle',
      price: '$24.99',
      image: 'https://www.success.com/wp-content/uploads/books/five-pieces.jpg',
      category: 'Books',
      link: '/store/five-pieces-puzzle'
    },
    {
      id: '6',
      title: 'The Seasons of Life',
      price: '$19.99',
      image: 'https://www.success.com/wp-content/uploads/books/seasons-life.jpg',
      category: 'Books',
      link: '/store/seasons-of-life'
    },
    {
      id: '7',
      title: 'Twelve Pillars',
      price: '$22.99',
      image: 'https://www.success.com/wp-content/uploads/books/twelve-pillars.jpg',
      category: 'Books',
      link: '/store/twelve-pillars'
    },
    {
      id: '8',
      title: 'Leading an Inspired Life',
      price: '$29.99',
      image: 'https://www.success.com/wp-content/uploads/books/inspired-life.jpg',
      category: 'Books',
      link: '/store/leading-inspired-life'
    },
    {
      id: '9',
      title: '7 Strategies for Wealth & Happiness',
      price: '$26.99',
      image: 'https://www.success.com/wp-content/uploads/books/7-strategies.jpg',
      category: 'Books',
      link: '/store/7-strategies'
    },
    {
      id: '10',
      title: 'The Art of Exceptional Living',
      price: '$24.99',
      image: 'https://www.success.com/wp-content/uploads/books/exceptional-living.jpg',
      category: 'Books',
      link: '/store/exceptional-living'
    },
    {
      id: '11',
      title: 'The Treasury of Quotes',
      price: '$19.99',
      image: 'https://www.success.com/wp-content/uploads/books/treasury-quotes.jpg',
      category: 'Books',
      link: '/store/treasury-quotes'
    },
    {
      id: '12',
      title: 'My Philosophy for Successful Living',
      price: '$22.99',
      image: 'https://www.success.com/wp-content/uploads/books/philosophy-living.jpg',
      category: 'Books',
      link: '/store/philosophy-living'
    },
    {
      id: '13',
      title: 'The Challenge to Succeed',
      price: '$21.99',
      image: 'https://www.success.com/wp-content/uploads/books/challenge-succeed.jpg',
      category: 'Books',
      link: '/store/challenge-succeed'
    },
    {
      id: '14',
      title: 'Building Your Network Marketing Business',
      price: '$23.99',
      image: 'https://www.success.com/wp-content/uploads/books/network-marketing.jpg',
      category: 'Books',
      link: '/store/network-marketing'
    },

    // Additional Books - Leadership & Business
    {
      id: '15',
      title: 'Think and Grow Rich',
      price: '$18.99',
      image: 'https://www.success.com/wp-content/uploads/books/think-grow-rich.jpg',
      category: 'Books',
      link: '/store/think-grow-rich'
    },
    {
      id: '16',
      title: 'How to Win Friends and Influence People',
      price: '$16.99',
      image: 'https://www.success.com/wp-content/uploads/books/win-friends.jpg',
      category: 'Books',
      link: '/store/win-friends'
    },
    {
      id: '17',
      title: 'The 7 Habits of Highly Effective People',
      price: '$19.99',
      image: 'https://www.success.com/wp-content/uploads/books/7-habits.jpg',
      category: 'Books',
      link: '/store/7-habits'
    },
    {
      id: '18',
      title: 'Atomic Habits',
      price: '$27.99',
      image: 'https://www.success.com/wp-content/uploads/books/atomic-habits.jpg',
      category: 'Books',
      link: '/store/atomic-habits'
    },

    // Courses & Digital Products
    {
      id: '19',
      title: "Jim Rohn's Foundations for Success",
      price: '$199.99',
      image: 'https://www.success.com/wp-content/uploads/courses/foundations.jpg',
      category: 'Courses',
      link: '/store/foundations-success'
    },
    {
      id: '20',
      title: 'Leadership Masterclass',
      price: '$149.99',
      image: 'https://www.success.com/wp-content/uploads/courses/leadership.jpg',
      category: 'Courses',
      link: '/store/leadership-masterclass'
    },
    {
      id: '21',
      title: 'Personal Development Blueprint',
      price: '$179.99',
      image: 'https://www.success.com/wp-content/uploads/courses/personal-dev.jpg',
      category: 'Courses',
      link: '/store/personal-dev-blueprint'
    },
    {
      id: '22',
      title: 'Time Management Mastery',
      price: '$99.99',
      image: 'https://www.success.com/wp-content/uploads/courses/time-management.jpg',
      category: 'Courses',
      link: '/store/time-management'
    },
    {
      id: '23',
      title: 'Goal Setting for Success',
      price: '$79.99',
      image: 'https://www.success.com/wp-content/uploads/courses/goal-setting.jpg',
      category: 'Courses',
      link: '/store/goal-setting'
    },
    {
      id: '24',
      title: 'Communication Skills Bootcamp',
      price: '$129.99',
      image: 'https://www.success.com/wp-content/uploads/courses/communication.jpg',
      category: 'Courses',
      link: '/store/communication-bootcamp'
    },

    // Merchandise
    {
      id: '25',
      title: 'SUCCESS EST. 1897 Stone Cap',
      price: '$24.99',
      image: 'https://www.success.com/wp-content/uploads/merch/stone-cap.jpg',
      category: 'Merchandise',
      link: '/store/stone-cap'
    },
    {
      id: '26',
      title: 'SUCCESS Logo T-Shirt (Black)',
      price: '$19.99',
      image: 'https://www.success.com/wp-content/uploads/merch/tshirt-black.jpg',
      category: 'Merchandise',
      link: '/store/tshirt-black'
    },
    {
      id: '27',
      title: 'SUCCESS Logo T-Shirt (White)',
      price: '$19.99',
      image: 'https://www.success.com/wp-content/uploads/merch/tshirt-white.jpg',
      category: 'Merchandise',
      link: '/store/tshirt-white'
    },
    {
      id: '28',
      title: 'SUCCESS Hoodie (Navy)',
      price: '$39.99',
      image: 'https://www.success.com/wp-content/uploads/merch/hoodie-navy.jpg',
      category: 'Merchandise',
      link: '/store/hoodie-navy'
    },
    {
      id: '29',
      title: 'The SUCCESS Starts Here Journal',
      price: '$9.71',
      image: 'https://www.success.com/wp-content/uploads/merch/journal.jpg',
      category: 'Merchandise',
      link: '/store/journal'
    },
    {
      id: '30',
      title: 'SUCCESS Notepad Set',
      price: '$14.99',
      image: 'https://www.success.com/wp-content/uploads/merch/notepad.jpg',
      category: 'Merchandise',
      link: '/store/notepad'
    },
    {
      id: '31',
      title: 'SUCCESS Water Bottle',
      price: '$17.99',
      image: 'https://www.success.com/wp-content/uploads/merch/water-bottle.jpg',
      category: 'Merchandise',
      link: '/store/water-bottle'
    },
    {
      id: '32',
      title: 'SUCCESS Tote Bag',
      price: '$16.99',
      image: 'https://www.success.com/wp-content/uploads/merch/tote-bag.jpg',
      category: 'Merchandise',
      link: '/store/tote-bag'
    },
    {
      id: '33',
      title: 'SUCCESS Pen Set (3-pack)',
      price: '$12.99',
      image: 'https://www.success.com/wp-content/uploads/merch/pen-set.jpg',
      category: 'Merchandise',
      link: '/store/pen-set'
    },

    // Magazine Issues
    {
      id: '34',
      title: 'SUCCESS Magazine - January/February 2025',
      price: '$9.99',
      image: 'https://www.success.com/wp-content/uploads/magazines/jan-feb-2025.jpg',
      category: 'Magazines',
      link: '/magazine/archive'
    },
    {
      id: '35',
      title: 'SUCCESS Magazine - March/April 2025',
      price: '$9.99',
      image: 'https://www.success.com/wp-content/uploads/magazines/mar-apr-2025.jpg',
      category: 'Magazines',
      link: '/magazine/archive'
    },
    {
      id: '36',
      title: 'SUCCESS Magazine - May/June 2025',
      price: '$9.99',
      image: 'https://www.success.com/wp-content/uploads/magazines/may-jun-2025.jpg',
      category: 'Magazines',
      link: '/magazine/archive'
    },
    {
      id: '37',
      title: 'SUCCESS Magazine - July/August 2025',
      price: '$9.99',
      image: 'https://www.success.com/wp-content/uploads/magazines/jul-aug-2025.jpg',
      category: 'Magazines',
      link: '/magazine/archive'
    },
  ];

  const categories = ['Books', 'Courses', 'Merchandise', 'Magazines'];

  return {
    props: {
      products,
      categories,
    },
    revalidate: 86400, // 24 hours
  };
};
