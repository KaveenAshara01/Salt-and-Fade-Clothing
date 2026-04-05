import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collectionName, setCollectionName] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get('collection');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products${collectionId ? `?collection=${collectionId}` : ''}`);
        setProducts(data);
        
        if (collectionId && data.length > 0 && data[0].collectionRef) {
          setCollectionName(data[0].collectionRef.name);
        } else {
          setCollectionName('');
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchCollections = async () => {
      try {
        const { data } = await axios.get('/api/collections');
        setCollections(data);
      } catch (err) {
        console.error('Error fetching collections:', err);
      }
    };
    
    fetchProducts();
    fetchCollections();
  }, [collectionId]);

  return (
    <>
      {/* Hero Section - Only show on main shop page or home */}
      {!collectionId && (
        <section style={{ 
          position: 'relative', 
          minHeight: '70vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#e0d8d0 url("/images/hero_1.png") center/cover no-repeat',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
          <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'var(--color-white)', paddingTop: '80px' }}>
            <h1 className="title-handwritten" style={{ 
              fontSize: 'clamp(4rem, 10vw, 7.5rem)', 
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              color: 'var(--color-white)',
              lineHeight: 0.9,
              marginBottom: '2rem'
            }}>
              Elevate Your <br /> Everyday
            </h1>
            <p className="subtitle" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.25rem' }}>
              Premium streetwear crafted for the golden hour. Modern cuts, unmatched comfort.
            </p>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section id="new-arrivals" style={{ padding: collectionId ? '8rem 0 4rem' : '3rem 0 4rem' }}>
        <div className="container">
          <div className="section-header-shaggy">
            <h2>{collectionId ? collectionName : 'New Arrivals'}</h2>
            <p>{collectionId ? `Exploring the ${collectionName} Collection` : 'Score a Free Lid on us when you spend RS. 10,000'}</p>
          </div>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '200px' }}>
              <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
            </div>
          ) : error ? (
            <div style={{ color: 'var(--color-error)', textAlign: 'center', padding: '2rem' }}>Error: {error}</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>No products found in this collection.</div>
          ) : (
            <>
            <div className="product-grid-scroll">
                {products.slice(0, collectionId ? undefined : 8).map((product) => (
                  <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`}>
                      <div className="product-image-container">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0].url : '/images/sample.jpg'}
                          alt={product.name}
                        />
                      </div>
                      <div className="product-info">
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-price">
                          {new Intl.NumberFormat('en-LK', {
                              style: 'currency',
                              currency: 'LKR',
                              currencyDisplay: 'code',
                              minimumFractionDigits: 2
                          }).format(product.price).replace('LKR', 'Rs').trim()} LKR
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              
              {!collectionId && products.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
                  <Link 
                    to="/products?sort=latest" 
                    className="btn btn-primary"
                    style={{ 
                      padding: '14px 40px', 
                      backgroundColor: '#1a1a1a', 
                      borderRadius: '2px', 
                      fontSize: '0.85rem',
                      letterSpacing: '1.5px',
                      fontWeight: 700
                    }}
                  >
                    SEE ALL
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Vibe Section - Only show on home/main shop */}
      {!collectionId && (
        <section style={{ padding: '3rem 0 4rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <div className="container vibe-section-grid">
            
            {/* Left Column: Image */}
            <div style={{ position: 'relative', aspectRatio: '1.2 / 1', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <img 
                src="/images/hero_2.png" 
                alt="Brand Vibe" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            {/* Right Column: Content */}
            <div className="vibe-section-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '2rem' }}>
              <h2 className="title-medium" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1 }}>
                Chasing the Golden Era.
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#444', fontWeight: 400 }}>
                Salt and Fade is born from the tropical heat of the Sri Lankan south coast. 
                Our mission is simple: to bring you premium, independent surfwear that feels like a summer's day. 
                Whether you're cruising a surf break or enjoying a bloody gem of a coffee, we have everything you could ever need. 
                Clean. Chill. Original.
              </p>
              <Link 
                to="/about" 
                className="btn btn-primary" 
                style={{ 
                  width: 'fit-content', 
                  padding: '14px 28px', 
                  backgroundColor: '#1a1a1a', 
                  borderRadius: '2px', 
                  fontSize: '0.8rem',
                  letterSpacing: '1.5px'
                }}
              >
                ABOUT US
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* Collections Section - Only show on home/main shop */}
      {!collectionId && collections.length > 0 && (
        <section style={{ padding: '2rem 0 2rem' }}>
          <div className="container">
            <div className="section-header-shaggy">
              <h2>Shop Our Collections</h2>
              <p>Tailored essentials for every vibe.</p>
            </div>
            
            <div className="collection-grid-scroll">
              {collections.map((c) => (
                <Link key={c._id} to={`/products?collection=${c._id}&sort=latest`} className="collection-card">
                  <div className="collection-image-container-wide" style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                    <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                    <div className="collection-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem', color: 'white' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{c.name}</h3>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>Discover →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section style={{ padding: '2rem 0 8rem', backgroundColor: '#fff' }}>
        <div className="container">
          <div className="section-header-shaggy">
            <h2>Community Feedback</h2>
            <p>What our island family is saying about Salt & Fade.</p>
          </div>
        </div>

        <div className="reviews-marquee-container">
          <div className="reviews-marquee-content">
            {[
              { 
                name: 'Dinuka Perera', 
                city: 'Colombo', 
                review: "The quality is unmatched. I've bought premium brands from overseas, but Salt & Fade holds its shape better in our humidity.",
                rating: 5
              },
              { 
                name: 'Amali Wickramasinghe', 
                city: 'Kandy', 
                review: "Finally a brand that keeps it simple and original. The fit of the oversized tees is perfect. Love the finish.",
                rating: 5
              },
              { 
                name: 'Tharindu Silva', 
                city: 'Galle', 
                review: "Salt and Fade in the salt. I wear these to the surf and then to a meeting. Versatile and durable.",
                rating: 5
              },
              { 
                name: 'Kasun Jayasundara', 
                city: 'Negombo', 
                review: "Quick delivery and even better products. The corduroy hats are a bloody gem for beach days.",
                rating: 5
              },
              { 
                name: 'Sandani de Silva', 
                city: 'Matara', 
                review: "International standard streetwear right here in SL. The fabric feels like luxury on the skin.",
                rating: 5
              }
            ].concat([
              { 
                name: 'Dinuka Perera', 
                city: 'Colombo', 
                review: "The quality is unmatched. I've bought premium brands from overseas, but Salt & Fade holds its shape better in our humidity.",
                rating: 5
              },
              { 
                name: 'Amali Wickramasinghe', 
                city: 'Kandy', 
                review: "Finally a brand that keeps it simple and original. The fit of the oversized tees is perfect. Love the finish.",
                rating: 5
              },
              { 
                name: 'Tharindu Silva', 
                city: 'Galle', 
                review: "Salt and Fade in the salt. I wear these to the surf and then to a meeting. Versatile and durable.",
                rating: 5
              },
              { 
                name: 'Kasun Jayasundara', 
                city: 'Negombo', 
                review: "Quick delivery and even better products. The corduroy hats are a bloody gem for beach days.",
                rating: 5
              },
              { 
                name: 'Sandani de Silva', 
                city: 'Matara', 
                review: "International standard streetwear right here in SL. The fabric feels like luxury on the skin.",
                rating: 5
              }
            ]).map((r, i) => (
              <div key={i} style={{ 
                padding: '2rem 2.5rem', 
                backgroundColor: '#f9f9f9', 
                borderRadius: 'var(--radius-sm)',
                minWidth: '350px',
                width: '350px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                whiteSpace: 'normal',
                flexShrink: 0
              }}>
                <div style={{ color: '#000', display: 'flex', gap: '2px' }}>
                  {[...Array(r.rating)].map((_, i) => (
                    <span key={i} style={{ fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ 
                  fontStyle: 'italic', 
                  color: '#444', 
                  lineHeight: 1.6, 
                  fontSize: '0.95rem',
                  flex: 1 
                }}>
                  "{r.review}"
                </p>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.15rem' }}>{r.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>{r.city}, Sri Lanka</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeScreen;
