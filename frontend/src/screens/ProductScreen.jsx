import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Check, ShieldCheck, Truck, AlertTriangle, X, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Zoom state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0].url);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos({ ...zoomPos, show: false });
  };

  const addToCartHandler = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize, 1);
  };

  if (loading) return (
    <div className="flex-center" style={{ minHeight: '80vh' }}>
      <div className="spin" style={{ width: '50px', height: '50px', border: '5px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
    </div>
  );

  if (error) return (
    <div className="container" style={{ paddingTop: '120px' }}>
      <div style={{ backgroundColor: '#F8D7DA', color: '#721C24', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <h2 className="title-medium">Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: 'max(90px, 120px) var(--container-padding) 60px' }}>
      <Link to="/" className="flex-center" style={{ gap: '0.5rem', width: 'fit-content', marginBottom: '3rem', color: 'var(--color-text)', opacity: 0.7 }}>
        <ArrowLeft size={18} /> Back to Shop
      </Link>

      <div className="product-detail-grid">

        {/* Left: Image Section */}
        <div className="product-gallery-container" style={{ display: 'flex', gap: '1.5rem' }}>
          {/* Thumbnails */}
          <div className="product-thumbnails" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {product.images.map((img, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setMainImage(img.url)}
                onClick={() => setMainImage(img.url)}
                className="product-thumbnail-item"
                style={{
                  width: '70px',
                  height: '90px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: mainImage === img.url ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  opacity: mainImage === img.url ? 1 : 0.6,
                  transition: 'all 0.2s'
                }}
              >
                <img src={img.url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          {/* Main Image Container (Smaller & Popped Zoom) */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '100%' }}>
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                backgroundColor: '#f9f9f9',
                borderRadius: 'var(--radius-md)',
                overflow: 'visible',
                cursor: 'crosshair',
                border: '1px solid var(--color-border)',
                lineHeight: 0,
                width: 'fit-content',
                margin: '0 auto'
              }}
            >
              <img
                src={mainImage}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: 'var(--radius-md)'
                }}
              />

              {/* Popped Zoom Window - Only shown on Desktop viewports */}
              {zoomPos.show && window.innerWidth > 850 && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '105%',
                  width: '350px',
                  height: '350px',
                  backgroundColor: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  zIndex: 2000,
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat',
                  pointerEvents: 'none',
                  display: 'block'
                }}></div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <span style={{
              backgroundColor: 'var(--color-bg)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-accent)',
              textTransform: 'uppercase'
            }}>
              {product.collectionRef?.name || product.category}
            </span>
            <h1 className="title-medium product-detail-title-mobile-only" style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{product.name}</h1>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              Rs. {product.price.toLocaleString()}
            </p>
          </div>

          <div
            className="product-description-rich"
            style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-light)' }}
            dangerouslySetInnerHTML={{ __html: product.description.replace(/&nbsp;/g, ' ') }}
          ></div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Select Size</h3>
              {product.sizeChart && product.sizeChart.url && (
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    fontSize: '0.85rem', 
                    color: 'var(--color-primary)', 
                    fontWeight: 600,
                    textDecoration: 'underline'
                  }}
                >
                  <Ruler size={14} /> Size Guide
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['S', 'M', 'L', 'XL'].map((size) => {
                const count = product.countInStock[size] || 0;
                const isOutOfStock = count === 0;

                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '54px',
                      height: '54px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedSize === size ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: selectedSize === size ? 'var(--color-primary)' : (isOutOfStock ? '#f1f1f1' : 'white'),
                      color: selectedSize === size ? 'white' : (isOutOfStock ? '#bbb' : 'var(--color-text)'),
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                    }}
                  >
                    {size}
                    {isOutOfStock && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '-20%',
                        width: '140%',
                        height: '1px',
                        backgroundColor: '#bbb',
                        transform: 'rotate(-45deg)',
                        opacity: 0.6
                      }}></div>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Low Stock Message */}
            {selectedSize && product.countInStock[selectedSize] < 5 && product.countInStock[selectedSize] > 0 && (
              <div style={{
                marginTop: '1.5rem',
                backgroundColor: '#fff5f5',
                borderLeft: '4px solid var(--color-error)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--color-error)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                <AlertTriangle size={18} />
                <span>Only {product.countInStock[selectedSize]} pieces left in stock!</span>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={addToCartHandler}
            disabled={!selectedSize}
            style={{ width: '100%', padding: '20px', fontSize: '1.1rem', gap: '1rem', marginBottom: '1rem' }}
          >
            <ShoppingCart size={20} /> Add To Cart
          </button>

          <a
            href={`https://wa.me/94771070544?text=Hello Salt %26 Fade, I'm interested in the ${product.name}.`}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn-mobile-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '0.75rem',
              color: '#444',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#000'}
            onMouseOut={(e) => e.currentTarget.style.color = '#444'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Inquire on WhatsApp
          </a>

          <div className="trust-badge-grid-mobile-only" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '10px', borderRadius: '50%', color: 'var(--color-primary)' }}>
                <Truck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Standard Delivery</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Free over Rs. 6,000</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '10px', borderRadius: '50%', color: 'var(--color-primary)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Secure Payment</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>100% Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {isSizeChartOpen && product.sizeChart && product.sizeChart.url && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 10001, 
          backgroundColor: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ 
            position: 'absolute', 
            inset: 0 
          }} onClick={() => setIsSizeChartOpen(false)}></div>
          
          <div style={{ 
            position: 'relative', 
            maxHeight: '90vh', 
            maxWidth: '90vw', 
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
             <button 
               onClick={() => setIsSizeChartOpen(false)}
               style={{ 
                 position: 'absolute', 
                 top: '1rem', 
                 right: '1rem', 
                 backgroundColor: 'white', 
                 borderRadius: '50%', 
                 padding: '5px',
                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                 zIndex: 10
               }}
             >
               <X size={20} />
             </button>
             <div style={{ overflow: 'auto' }}>
               <img 
                 src={product.sizeChart.url} 
                 alt="Size Chart" 
                 style={{ display: 'block', maxWidth: '100%', height: 'auto' }} 
               />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
