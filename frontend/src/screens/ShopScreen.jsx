import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Filter, ShoppingBag, X, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ShopScreen = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const currentCollection = queryParams.get('collection') || '';
  const currentSort = queryParams.get('sort') || 'latest';

  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products?collection=${currentCollection}&sort=${currentSort}`);
        setProducts(data);
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

    const handleClickOutside = () => setIsSortOpen(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [currentCollection, currentSort]);

  const handleSortChange = (newSort) => {
    queryParams.set('sort', newSort);
    navigate(`/products?${queryParams.toString()}`);
    setIsSortOpen(false);
  };

  const handleCollectionChange = (collectionId) => {
    if (collectionId === '') {
      queryParams.delete('collection');
    } else {
      queryParams.set('collection', collectionId);
    }
    navigate(`/products?${queryParams.toString()}`);
    setIsFilterDrawerOpen(false);
  };

  const sortOptions = [
    { label: 'Latest', value: 'latest' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Latest';

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size if available
    const firstSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    if (firstSize) {
      addToCart(product, 1, firstSize);
    } else {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: 'max(90px, 120px) var(--container-padding) 6rem' }}>
      
      {/* Mobile Filter Drawer Overlay */}
      <div 
        className={`filter-drawer-overlay ${isFilterDrawerOpen ? 'active' : ''}`} 
        onClick={() => setIsFilterDrawerOpen(false)}
      ></div>

      {/* Mobile Filter Drawer */}
      <div className={`filter-drawer ${isFilterDrawerOpen ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '1px' }}>Filters</h2>
          <button onClick={() => setIsFilterDrawerOpen(false)} style={{ color: 'var(--color-text)' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem', letterSpacing: '1px' }}>Collections</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <button 
                onClick={() => handleCollectionChange('')}
                className="mobile-nav-link"
                style={{ border: 'none', width: '100%', textAlign: 'left', fontWeight: currentCollection === '' ? 700 : 400 }}
              >
                All Collections <ChevronRight size={16} />
              </button>
            </li>
            {collections.map(c => (
              <li key={c._id}>
                <button 
                  onClick={() => handleCollectionChange(c._id)}
                  className="mobile-nav-link"
                  style={{ border: 'none', width: '100%', textAlign: 'left', fontWeight: currentCollection === c._id ? 700 : 400 }}
                >
                  {c.name} <ChevronRight size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h1 className="title-medium" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', marginBottom: '1rem' }}>The Shop</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Quality essentials for every wave.</p>
        </div>

        {/* Dual-Action Modern Bar */}
        <div className="filter-bar">
          <button className="filter-trigger" onClick={() => setIsFilterDrawerOpen(true)}>
            <Filter size={18} /> Filters
          </button>
          
          <div className="filter-bar-divider" />
          
          <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
            <button className="sort-trigger" onClick={(e) => { e.stopPropagation(); setIsSortOpen(!isSortOpen); }}>
              Sort by <ChevronDown size={14} style={{ transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
            </button>
            
            {isSortOpen && (
              <div style={{ 
                position: 'absolute', 
                top: 'calc(100% - 10px)', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '220px',
                backgroundColor: '#fff', 
                border: '1px solid #1a1a1a', 
                borderRadius: '4px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 100,
                overflow: 'hidden'
              }}>
                {sortOptions.map(opt => (
                  <div 
                    key={opt.value}
                    onClick={() => handleSortChange(opt.value)}
                    style={{ 
                      padding: '16px 20px',
                      backgroundColor: currentSort === opt.value ? '#f5f5f5' : '#fff',
                      color: currentSort === opt.value ? '#000' : '#444',
                      transition: 'all 0.2s',
                      fontWeight: currentSort === opt.value ? 700 : 400,
                      fontSize: '0.85rem'
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#1a1a1a'; e.target.style.color = '#fff'; }}
                    onMouseOut={(e) => { 
                      e.target.style.backgroundColor = currentSort === opt.value ? '#f5f5f5' : '#fff'; 
                      e.target.style.color = currentSort === opt.value ? '#000' : '#444'; 
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="shop-layout-grid">
          {/* Sidebar Collections (Desktop Only) */}
          <aside className="shop-sidebar hide-mobile">
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '2px', color: '#111' }}>Collections</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li>
                  <button 
                    onClick={() => handleCollectionChange('')}
                    style={{ 
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                      color: currentCollection === '' ? '#000' : '#888',
                      fontWeight: currentCollection === '' ? 800 : 400,
                      textTransform: 'uppercase', letterSpacing: '1px'
                    }}
                  >
                    All Collections
                  </button>
                </li>
                {collections.map(c => (
                  <li key={c._id}>
                    <button 
                       onClick={() => handleCollectionChange(c._id)}
                       style={{ 
                         background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                         color: currentCollection === c._id ? '#000' : '#888',
                         fontWeight: currentCollection === c._id ? 800 : 400,
                         textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left'
                       }}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main>
            {loading ? (
              <div className="flex-center" style={{ minHeight: '400px' }}>
                <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTopColor: '#000', borderRadius: '50%' }}></div>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-error)' }}>Error fetching products: {error}</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                No products found matching your criteria.
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`}>
                      <div className="product-image-container">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0].url : '/images/sample.jpg'}
                          alt={product.name}
                          style={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                        <button 
                          className="quick-add-btn" 
                          onClick={(e) => handleQuickAdd(e, product)}
                          title="Add to Cart"
                        >
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                      <div className="product-info">
                        <h3 className="product-title" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.name}</h3>
                        <p className="product-price">
                          {new Intl.NumberFormat('en-LK', {
                            style: 'currency', currency: 'LKR', currencyDisplay: 'code', minimumFractionDigits: 0
                          }).format(product.price).replace('LKR', 'Rs').trim()}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;
