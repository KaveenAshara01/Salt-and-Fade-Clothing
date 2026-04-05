import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Truck, CreditCard, ChevronRight, CheckCircle, Info, Lock, ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';
import LoginModal from '../components/LoginModal';

const CheckoutScreen = () => {
  const { cartItems, itemsPrice, shippingPrice, totalPrice, clearCart } = useCart();
  const { userInfo, login } = useUser();
  const navigate = useNavigate();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: userInfo?.name.split(' ')[0] || '',
    lastName: userInfo?.name.split(' ')[1] || '',
    email: userInfo?.email || '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Card Payment', // Success simulation
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isSuccess]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onLoginSuccess = (data) => {
    login(data);
    setFormData((prev) => ({
      ...prev,
      firstName: data.name.split(' ')[0] || prev.firstName,
      lastName: data.name.split(' ')[1] || prev.lastName,
      email: data.email || prev.email,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }

      const orderData = {
        orderItems: cartItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: 'Sri Lanka',
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice: 0,
        totalPrice,
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      
      setCreatedOrder(data);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess && createdOrder) {
    return (
      <div className="container" style={{ padding: '120px 24px 60px', textAlign: 'center', minHeight: '80vh' }}>
        <div style={{ maxWidth: '600px', margin: 'auto', backgroundColor: 'var(--color-bg)', padding: '4rem', borderRadius: 'var(--radius-lg)' }}>
           <CheckCircle size={80} color="var(--color-primary)" style={{ marginBottom: '2rem' }} />
           <h1 className="title-medium" style={{ marginBottom: '1rem' }}>Order Placed Successfully!</h1>
           <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
             Your order number is <strong style={{ color: 'var(--color-primary)' }}>#{createdOrder.orderNumber}</strong>.
           </p>
           <p style={{ marginBottom: '2.5rem' }}>We've sent a confirmation email to {formData.email}.</p>
           <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <Link to="/" className="btn btn-primary">Continue Shopping</Link>
              {userInfo && <Link to="/profile" className="btn btn-outline">View My Orders</Link>}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'max(90px, 120px) var(--container-padding) 60px', minHeight: '80vh' }}>
      <Link to="/cart" className="flex-center" style={{ gap: '0.5rem', width: 'fit-content', marginBottom: '2rem', color: 'var(--color-text)', opacity: 0.7 }}>
        <ArrowLeft size={18} /> Back to Cart
      </Link>

      <div className="checkout-grid">
        
        {/* Form Column */}
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Section: Shipping Info */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <h2 className="title-small" style={{ fontSize: '1.5rem' }}>1. Shipping Details</h2>
              {!userInfo && (
                <button type="button" onClick={() => setIsLoginModalOpen(true)} style={{ color: 'var(--color-accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                   Already have an account? Sign In
                </button>
              )}
            </div>

            {!userInfo && (
               <div style={{ backgroundColor: '#f0f4f2', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--color-primary)', border: '1px solid #e0e8e4' }}>
                  <Info size={20} />
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <strong>Quick Tip:</strong> Log in to your account <button type="button" onClick={() => setIsLoginModalOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>here</button> to track your order status in real-time.
                  </p>
               </div>
            )}

            {error && (
              <div style={{ backgroundColor: '#fff5f5', color: 'var(--color-error)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', border: '1px solid #ffebeb' }}>
                {error}
              </div>
            )}

            <div className="form-grid-2">
               <input type="text" name="firstName" placeholder="First Name *" className="input-field" required value={formData.firstName} onChange={handleInputChange} />
               <input type="text" name="lastName" placeholder="Last Name *" className="input-field" required value={formData.lastName} onChange={handleInputChange} />
               <input type="email" name="email" placeholder="Email Address *" className="input-field" style={{ gridColumn: 'span 2' }} required value={formData.email} onChange={handleInputChange} />
               <input type="text" name="address" placeholder="Residential Address *" className="input-field" style={{ gridColumn: 'span 2' }} required value={formData.address} onChange={handleInputChange} />
               <input type="text" name="city" placeholder="City *" className="input-field" required value={formData.city} onChange={handleInputChange} />
               <input type="text" name="postalCode" placeholder="Postal / Zip Code" className="input-field" value={formData.postalCode} onChange={handleInputChange} />
            </div>
          </section>

          {/* Section: Payment Method */}
          <section>
            <h2 className="title-small" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>2. Payment Method</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <label style={{ 
                 padding: '1.5rem', 
                 borderRadius: 'var(--radius-sm)', 
                 border: `2px solid ${formData.paymentMethod === 'Card Payment' ? 'var(--color-primary)' : 'var(--color-border)'}`, 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '1rem', 
                 cursor: 'pointer',
                 backgroundColor: formData.paymentMethod === 'Card Payment' ? '#fdfdfd' : 'transparent',
                 transition: 'all 0.2s'
               }}>
                  <input type="radio" name="paymentMethod" value="Card Payment" checked={formData.paymentMethod === 'Card Payment'} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
                  <CreditCard size={24} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <h4 style={{ fontWeight: 600 }}>Credit / Debit Card</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Securely pay with Visa, Mastercard or Amex</p>
                  </div>
               </label>
               
               <label style={{ 
                 padding: '1.5rem', 
                 borderRadius: 'var(--radius-sm)', 
                 border: `2px solid ${formData.paymentMethod === 'Cash on Delivery' ? 'var(--color-primary)' : 'var(--color-border)'}`, 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '1rem', 
                 cursor: 'pointer',
                 backgroundColor: formData.paymentMethod === 'Cash on Delivery' ? '#fdfdfd' : 'transparent',
                 transition: 'all 0.2s'
               }}>
                  <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
                  <Truck size={24} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <h4 style={{ fontWeight: 600 }}>Cash on Delivery (COD)</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Pay only when you receive the package</p>
                  </div>
               </label>
            </div>
          </section>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '20px', fontSize: '1.1rem', gap: '1rem' }}>
            {loading ? <Loader size={20} className="spin" /> : <Lock size={20} />}
            {formData.paymentMethod === 'Card Payment' ? 'Pay & Place Order' : 'Confirm Order (COD)'}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="checkout-sidebar" style={{ position: 'sticky', top: '100px', backgroundColor: '#fafafa', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #eee' }}>
           <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>Order Summary</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}`} style={{ display: 'flex', gap: '1rem' }}>
                   <img src={item.image} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                   <div style={{ flex: 1 }}>
                     <h5 style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</h5>
                     <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Size: {item.size} × {item.qty}</p>
                   </div>
                   <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Rs. {(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
           </div>

           <div style={{ borderTop: '1px solid #ddd', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                <span>Subtotal</span>
                <span>Rs. {itemsPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                <span>Delivery</span>
                <span>Rs. {shippingPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1.5rem' }}>
                <span>Total</span>
                <span>Rs. {totalPrice.toLocaleString()} LKR</span>
              </div>
           </div>
        </aside>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={onLoginSuccess}
      />
    </div>
  );
};

export default CheckoutScreen;
