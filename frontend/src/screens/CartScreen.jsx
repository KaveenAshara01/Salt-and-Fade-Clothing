import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash, Minus, Plus, ShoppingBag, ArrowRight, LogIn, Info } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const CartScreen = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice, shippingPrice, totalPrice } = useCart();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleQtyChange = (item, newQty) => {
    const maxStock = item.countInStock?.[item.size] || 0;
    if (newQty > 0 && newQty <= maxStock) {
      updateQty(item.product, item.size, newQty);
    }
  };

  const [checkoutError, setCheckoutError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const checkoutHandler = async () => {
    try {
      setIsValidating(true);
      setCheckoutError(null);
      await axios.post('/api/orders/validate-cart', { cartItems });
      navigate('/checkout');
    } catch (err) {
      setCheckoutError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'max(90px, 120px) var(--container-padding) 60px', minHeight: '80vh' }}>
      <h1 className="title-medium" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '3rem' }}>Shopping Cart</h1>

      {checkoutError && (
        <div style={{ 
          backgroundColor: '#fff0f0', 
          color: '#d32f2f', 
          padding: '1.25rem', 
          borderRadius: '8px', 
          marginBottom: '2rem', 
          borderLeft: '4px solid #d32f2f',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(211, 47, 47, 0.1)'
        }}>
          <Info size={24} style={{ color: '#d32f2f', minWidth: '24px' }} />
          <span>{checkoutError}</span>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div style={{ padding: '4rem', backgroundColor: '#f9f9f9', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <ShoppingBag size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>Your cart is feeling a little light.</p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout-grid">
          
          {/* Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cartItems.map((item) => (
              <div key={`${item.product}-${item.size}`} className="cart-item-card">
                <Link to={`/product/${item.product}`}>
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                </Link>
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 className="title-small" style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.name}</h3>
                    </Link>
                    <button onClick={() => removeFromCart(item.product, item.size)} style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
                      <Trash size={18} />
                    </button>
                  </div>
                  <p style={{ color: 'var(--color-text-light)', marginBottom: '1.25rem', fontWeight: 600, fontSize: '0.9rem' }}>Size: {item.size}</p>
                  
                  <div className="cart-qty-price-row">
                    <div className="cart-qty-selector">
                      <button onClick={() => handleQtyChange(item, item.qty - 1)} style={{ cursor: 'pointer', border: 'none', background: 'none', color: 'var(--color-text)' }}><Minus size={14} /></button>
                      <span style={{ fontSize: '1rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => handleQtyChange(item, item.qty + 1)} style={{ cursor: 'pointer', border: 'none', background: 'none', color: 'var(--color-text)' }}><Plus size={14} /></button>
                    </div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                      {new Intl.NumberFormat('en-LK', {
                        style: 'currency', currency: 'LKR', currencyDisplay: 'code', minimumFractionDigits: 0
                      }).format(item.price * item.qty).replace('LKR', 'Rs').trim()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="cart-summary-card">
            <h2 className="title-small" style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>Order Summary</h2>
            
            {!userInfo && (
               <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <LogIn size={20} />
                  <p>Log in to your account to save these items for later.</p>
               </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
                <span>Sub-total ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                <span>Rs. {itemsPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
                <span>Delivery Charge</span>
                <span>Rs. {shippingPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1.5rem', color: 'var(--color-text)' }}>
                <span>Total</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={checkoutHandler} 
              disabled={isValidating}
              style={{ width: '100%', padding: '20px', fontSize: '1.1rem', gap: '0.75rem', borderRadius: '4px' }}
            >
              {isValidating ? 'Validating Stock...' : (
                <>Checkout Now <ArrowRight size={20} /></>
              )}
            </button>
            
            <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-light)', textDecoration: 'underline', fontSize: '0.9rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
