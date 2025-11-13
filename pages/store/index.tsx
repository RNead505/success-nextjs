import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import styles from './store.module.css';

type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  link: string;
  featured?: boolean;
};

type StorePageProps = {
  products: Product[];
  categories: string[];
};

export default function StorePage({ products, categories }: StorePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = products.filter(p =>
    selectedCategory === 'All' || p.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return (a.salePrice || a.price) - (b.salePrice || b.price);
    if (sortBy === 'price-high') return (b.salePrice || b.price) - (a.salePrice || a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // Default: featured first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const featuredProducts = products.filter(p => p.featured);

  return (
    <Layout>
      <SEO
        title="SUCCESS Store - Books, Courses & Merchandise"
        description="Shop books, courses, merchandise and digital content from SUCCESS Magazine. Jim Rohn books, leadership courses, and exclusive SUCCESS gear."
        url="https://www.success.com/store"
      />

      <div className={styles.storePage}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <h1>SUCCESS Store</h1>
          <p>Curated resources to accelerate your personal and professional growth</p>
        </header>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className={styles.featuredSection}>
            <h2>Featured Products</h2>
            <div className={styles.featuredGrid}>
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className={styles.featuredCard}>
                  {product.salePrice && (
                    <div className={styles.saleBadge}>Sale</div>
                  )}
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <div className={styles.priceRow}>
                      {product.salePrice ? (
                        <>
                          <span className={styles.salePrice}>${product.salePrice.toFixed(2)}</span>
                          <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className={styles.price}>${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <a href={product.link} className={styles.buyButton}>
                      View Product
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <section className={styles.filtersSection}>
          <div className={styles.filterBar}>
            <div className={styles.categoryFilters}>
              <button
                className={selectedCategory === 'All' ? styles.active : ''}
                onClick={() => setSelectedCategory('All')}
              >
                All Products ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    className={selectedCategory === cat ? styles.active : ''}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            <div className={styles.sortFilter}>
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className={styles.productsSection}>
          <div className={styles.productsGrid}>
            {sortedProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                {product.salePrice && (
                  <div className={styles.saleBadge}>Sale</div>
                )}
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.productCategory}>{product.subcategory || product.category}</p>
                  <h3>{product.name}</h3>
                  <div className={styles.priceRow}>
                    {product.salePrice ? (
                      <>
                        <span className={styles.salePrice}>${product.salePrice.toFixed(2)}</span>
                        <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                        <span className={styles.savings}>
                          Save ${(product.price - product.salePrice).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className={styles.price}>${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <a href={product.link} className={styles.buyButton}>
                    Add to Cart
                  </a>
                </div>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className={styles.noProducts}>
              <p>No products found in this category.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>Want Unlimited Access?</h2>
          <p>Join SUCCESS+ for unlimited courses, exclusive content, and member discounts</p>
          <a href="/offer/success-plus" className={styles.ctaButton}>
            Explore SUCCESS+ Membership
          </a>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Comprehensive product catalog organized by category
  const products: Product[] = [
    // FEATURED BUNDLES
    {
      id: 'bundle-1',
      name: 'Jim Rohn Book Bundle',
      price: 181.69,
      salePrice: 97.00,
      image: 'https://www.success.com/wp-content/uploads/2023/jim-rohn-bundle.jpg',
      category: 'Bundles',
      link: '/store/jim-rohn-bundle',
      featured: true
    },

    // BOOKS - Jim Rohn Collection
    {
      id: 'book-1',
      name: 'The Five Major Pieces to the Life Puzzle',
      price: 24.99,
      image: 'https://www.success.com/wp-content/uploads/books/five-pieces.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/five-pieces-puzzle'
    },
    {
      id: 'book-2',
      name: 'The Seasons of Life',
      price: 19.99,
      image: 'https://www.success.com/wp-content/uploads/books/seasons-life.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/seasons-of-life'
    },
    {
      id: 'book-3',
      name: 'Twelve Pillars',
      price: 22.99,
      image: 'https://www.success.com/wp-content/uploads/books/twelve-pillars.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/twelve-pillars'
    },
    {
      id: 'book-4',
      name: 'Leading an Inspired Life',
      price: 29.99,
      image: 'https://www.success.com/wp-content/uploads/books/inspired-life.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/leading-inspired-life',
      featured: true
    },
    {
      id: 'book-5',
      name: '7 Strategies for Wealth & Happiness',
      price: 26.99,
      image: 'https://www.success.com/wp-content/uploads/books/7-strategies.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/7-strategies'
    },
    {
      id: 'book-6',
      name: 'The Art of Exceptional Living',
      price: 24.99,
      image: 'https://www.success.com/wp-content/uploads/books/exceptional-living.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/exceptional-living'
    },
    {
      id: 'book-7',
      name: 'The Treasury of Quotes',
      price: 19.99,
      image: 'https://www.success.com/wp-content/uploads/books/treasury-quotes.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/treasury-quotes'
    },
    {
      id: 'book-8',
      name: 'My Philosophy for Successful Living',
      price: 22.99,
      image: 'https://www.success.com/wp-content/uploads/books/philosophy-living.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/philosophy-living'
    },
    {
      id: 'book-9',
      name: 'The Challenge to Succeed',
      price: 21.99,
      image: 'https://www.success.com/wp-content/uploads/books/challenge-succeed.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/challenge-succeed'
    },
    {
      id: 'book-10',
      name: 'Building Your Network Marketing Business',
      price: 23.99,
      image: 'https://www.success.com/wp-content/uploads/books/network-marketing.jpg',
      category: 'Books',
      subcategory: 'Jim Rohn',
      link: '/store/network-marketing'
    },

    // BOOKS - Classics & Bestsellers
    {
      id: 'book-11',
      name: 'Think and Grow Rich',
      price: 18.99,
      image: 'https://www.success.com/wp-content/uploads/books/think-grow-rich.jpg',
      category: 'Books',
      subcategory: 'Classics',
      link: '/store/think-grow-rich'
    },
    {
      id: 'book-12',
      name: 'How to Win Friends and Influence People',
      price: 16.99,
      image: 'https://www.success.com/wp-content/uploads/books/win-friends.jpg',
      category: 'Books',
      subcategory: 'Classics',
      link: '/store/win-friends'
    },
    {
      id: 'book-13',
      name: 'The 7 Habits of Highly Effective People',
      price: 19.99,
      image: 'https://www.success.com/wp-content/uploads/books/7-habits.jpg',
      category: 'Books',
      subcategory: 'Leadership',
      link: '/store/7-habits'
    },
    {
      id: 'book-14',
      name: 'Atomic Habits',
      price: 27.99,
      image: 'https://www.success.com/wp-content/uploads/books/atomic-habits.jpg',
      category: 'Books',
      subcategory: 'Personal Development',
      link: '/store/atomic-habits',
      featured: true
    },

    // COURSES
    {
      id: 'course-1',
      name: "Jim Rohn's Foundations for Success",
      price: 199.99,
      image: 'https://www.success.com/wp-content/uploads/courses/foundations.jpg',
      category: 'Courses',
      subcategory: 'Personal Development',
      link: '/store/foundations-success',
      featured: true
    },
    {
      id: 'course-2',
      name: 'Leadership Masterclass',
      price: 149.99,
      image: 'https://www.success.com/wp-content/uploads/courses/leadership.jpg',
      category: 'Courses',
      subcategory: 'Leadership',
      link: '/store/leadership-masterclass'
    },
    {
      id: 'course-3',
      name: 'Personal Development Blueprint',
      price: 179.99,
      image: 'https://www.success.com/wp-content/uploads/courses/personal-dev.jpg',
      category: 'Courses',
      subcategory: 'Personal Development',
      link: '/store/personal-dev-blueprint'
    },
    {
      id: 'course-4',
      name: 'Time Management Mastery',
      price: 99.99,
      image: 'https://www.success.com/wp-content/uploads/courses/time-management.jpg',
      category: 'Courses',
      subcategory: 'Productivity',
      link: '/store/time-management'
    },
    {
      id: 'course-5',
      name: 'Goal Setting for Success',
      price: 79.99,
      image: 'https://www.success.com/wp-content/uploads/courses/goal-setting.jpg',
      category: 'Courses',
      subcategory: 'Personal Development',
      link: '/store/goal-setting'
    },
    {
      id: 'course-6',
      name: 'Communication Skills Bootcamp',
      price: 129.99,
      image: 'https://www.success.com/wp-content/uploads/courses/communication.jpg',
      category: 'Courses',
      subcategory: 'Leadership',
      link: '/store/communication-bootcamp'
    },

    // MERCHANDISE
    {
      id: 'merch-1',
      name: 'The SUCCESS Starts Here Journal',
      price: 14.99,
      salePrice: 9.71,
      image: 'https://www.success.com/wp-content/uploads/merch/journal.jpg',
      category: 'Merchandise',
      subcategory: 'Journals & Planners',
      link: '/store/journal',
      featured: true
    },
    {
      id: 'merch-2',
      name: 'SUCCESS EST. 1897 Stone Cap',
      price: 24.99,
      image: 'https://www.success.com/wp-content/uploads/merch/stone-cap.jpg',
      category: 'Merchandise',
      subcategory: 'Apparel',
      link: '/store/stone-cap'
    },
    {
      id: 'merch-3',
      name: 'SUCCESS Classic Covers 15-oz Ceramic Mug',
      price: 16.99,
      image: 'https://www.success.com/wp-content/uploads/merch/ceramic-mug.jpg',
      category: 'Merchandise',
      subcategory: 'Drinkware',
      link: '/store/ceramic-mug'
    },
    {
      id: 'merch-4',
      name: 'SUCCESS Logo T-Shirt (Black)',
      price: 19.99,
      image: 'https://www.success.com/wp-content/uploads/merch/tshirt-black.jpg',
      category: 'Merchandise',
      subcategory: 'Apparel',
      link: '/store/tshirt-black'
    },
    {
      id: 'merch-5',
      name: 'SUCCESS Logo T-Shirt (White)',
      price: 19.99,
      image: 'https://www.success.com/wp-content/uploads/merch/tshirt-white.jpg',
      category: 'Merchandise',
      subcategory: 'Apparel',
      link: '/store/tshirt-white'
    },
    {
      id: 'merch-6',
      name: 'SUCCESS Hoodie (Navy)',
      price: 39.99,
      image: 'https://www.success.com/wp-content/uploads/merch/hoodie-navy.jpg',
      category: 'Merchandise',
      subcategory: 'Apparel',
      link: '/store/hoodie-navy'
    },
    {
      id: 'merch-7',
      name: 'SUCCESS Notepad Set',
      price: 14.99,
      image: 'https://www.success.com/wp-content/uploads/merch/notepad.jpg',
      category: 'Merchandise',
      subcategory: 'Office Supplies',
      link: '/store/notepad'
    },
    {
      id: 'merch-8',
      name: 'SUCCESS Water Bottle',
      price: 17.99,
      image: 'https://www.success.com/wp-content/uploads/merch/water-bottle.jpg',
      category: 'Merchandise',
      subcategory: 'Drinkware',
      link: '/store/water-bottle'
    },
    {
      id: 'merch-9',
      name: 'SUCCESS Tote Bag',
      price: 16.99,
      image: 'https://www.success.com/wp-content/uploads/merch/tote-bag.jpg',
      category: 'Merchandise',
      subcategory: 'Bags & Accessories',
      link: '/store/tote-bag'
    },
    {
      id: 'merch-10',
      name: 'SUCCESS Pen Set (3-pack)',
      price: 12.99,
      image: 'https://www.success.com/wp-content/uploads/merch/pen-set.jpg',
      category: 'Merchandise',
      subcategory: 'Office Supplies',
      link: '/store/pen-set'
    },

    // MAGAZINES
    {
      id: 'mag-1',
      name: 'SUCCESS Magazine - November/December 2025',
      price: 9.99,
      image: 'https://www.success.com/wp-content/uploads/magazines/nov-dec-2025.jpg',
      category: 'Magazines',
      link: '/magazine'
    },
    {
      id: 'mag-2',
      name: 'SUCCESS Magazine - January/February 2025',
      price: 9.99,
      image: 'https://www.success.com/wp-content/uploads/magazines/jan-feb-2025.jpg',
      category: 'Magazines',
      link: '/magazine/archive'
    },
    {
      id: 'mag-3',
      name: 'SUCCESS Magazine - March/April 2025',
      price: 9.99,
      image: 'https://www.success.com/wp-content/uploads/magazines/mar-apr-2025.jpg',
      category: 'Magazines',
      link: '/magazine/archive'
    },
    {
      id: 'mag-4',
      name: 'SUCCESS Magazine - May/June 2025',
      price: 9.99,
      image: 'https://www.success.com/wp-content/uploads/magazines/may-jun-2025.jpg',
      category: 'Magazines',
      link: '/magazine/archive'
    },
    {
      id: 'mag-5',
      name: 'SUCCESS Magazine - July/August 2025',
      price: 9.99,
      image: 'https://www.success.com/wp-content/uploads/magazines/jul-aug-2025.jpg',
      category: 'Magazines',
      link: '/magazine/archive'
    },
  ];

  const categories = ['Books', 'Courses', 'Merchandise', 'Magazines', 'Bundles'];

  return {
    props: {
      products,
      categories,
    },
  };
};
