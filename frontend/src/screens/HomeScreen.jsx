import { Link } from 'react-router-dom';

const HomeScreen = () => {
  // Dummy products array for UI simulation
  const products = [
    {
      _id: '1',
      name: 'Oversized Sand Tee',
      price: 3500,
      image: '/images/mockup_tee_beige.png',
      category: 'T-Shirts',
    },
    {
      _id: '2',
      name: 'Washed Charcoal Oversized',
      price: 4200,
      image: '/images/mockup_tee_charcoal.png',
      category: 'T-Shirts',
    },
    {
      _id: '3',
      name: 'Surf Green Boxy Fit',
      price: 3800,
      image: '/images/mockup_tee_surf_green.png',
      category: 'T-Shirts',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#e0d8d0 url("/images/hero_1.png") center/cover no-repeat',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
        <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'var(--color-white)' }}>
          <h1 className="title-large" style={{ marginBottom: '1.5rem', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            Elevate Your <br /> Everyday
          </h1>
          <p className="subtitle" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.25rem' }}>
            Premium streetwear crafted for the golden hour. Modern cuts, unmatched comfort.
          </p>
          <Link to="/products" className="btn btn-accent" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
            Shop New Arrivals
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <h2 className="title-medium">Fresh Drops</h2>
            <Link to="/products" style={{ fontWeight: 600, borderBottom: '2px solid var(--color-text)' }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {products.map((product) => (
              <div key={product._id} className="card-glass group">
                <Link to={`/product/${product._id}`}>
                  <div style={{ aspectRatio: '4/5', overflow: 'hidden', backgroundColor: 'var(--color-border)' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {product.category}
                    </p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Rs. {product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 className="title-large" style={{ marginBottom: '1.5rem' }}>Vibe Check.</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem', opacity: 0.9 }}>
              Salt and Fade is born from the tropical heat of the Sri Lankan south coast. 
              We blend modern minimal aesthetics with the raw energy of ocean life. 
              Our mission is simple: create clothes you never want to take off.
            </p>
            <Link to="/about" className="btn btn-outline" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              Our Story
            </Link>
          </div>
          <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <img 
              src="/images/hero_2.png" 
              alt="Brand Vibe" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeScreen;
