import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { X, Trash, Minus, Plus, ShoppingBag, ArrowRight, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartModal = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQty, itemsPrice, shippingPrice, totalPrice } = useCart();
  const { userInfo } = useUser();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleQtyChange = (item, newQty) => {
    const maxStock = item.countInStock?.[item.size] || 0;
    if (newQty > 0 && newQty <= maxStock) {
      updateQty(item.product, item.size, newQty);
    }
  };

  const checkoutHandler = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const backToShopping = () => {
    setIsCartOpen(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      {/* Background Overlay click to close */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={backToShopping}></div>
      
      {/* Modal Content */}
      <div className="animate-slide-in cart-modal-content">
        
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShoppingBag size={20} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Cart ({cartItems.length})</h2>
           </div>
           <button onClick={backToShopping} style={{ color: 'var(--color-text-light)', cursor: 'pointer' }}>
              <X size={24} />
           </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <ShoppingBag size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
              <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>Your cart is empty.</p>
              <button className="btn btn-primary" onClick={backToShopping}>Start Shopping</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cartItems.map((item, idx) => (
                <div key={`${item.product}-${item.size}`} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontWeight: 600 }}>{item.name}</h4>
                      <button onClick={() => removeFromCart(item.product, item.size)} style={{ color: 'var(--color-error)', opacity: 0.7 }}><Trash size={16} /></button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>Size: {item.size}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '2px 8px' }}>
                        <button onClick={() => handleQtyChange(item, item.qty - 1)} style={{ cursor: 'pointer', color: 'var(--color-text)' }}><Minus size={14} /></button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => handleQtyChange(item, item.qty + 1)} style={{ cursor: 'pointer', color: 'var(--color-text)' }}><Plus size={14} /></button>
                      </div>
                      <span style={{ fontWeight: 600 }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: '#fafafa' }}>
            
            {/* Login Warning */}
            {!userInfo && (
               <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <LogIn size={18} />
                  <p>Log in to keep your cart items permanent.</p>
               </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                <span>Sub-total</span>
                <span>Rs. {itemsPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                <span>Delivery Charge {cartItems.reduce((acc, i) => acc + i.qty, 0) < 3 ? '(Fixed)' : '(Bulky)'}</span>
                <span>Rs. {shippingPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <span>Total</span>
                <span>Rs. {totalPrice.toLocaleString()} LKR</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={checkoutHandler} style={{ width: '100%', padding: '16px', gap: '0.5rem' }}>
                Checkout <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline" onClick={backToShopping} style={{ width: '100%', padding: '12px' }}>
                Back to Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
