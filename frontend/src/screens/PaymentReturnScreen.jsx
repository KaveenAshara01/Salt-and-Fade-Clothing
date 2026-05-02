import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowLeft, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import ReactPixel from 'react-facebook-pixel';

// PAYable status codes
// 1 = Success
// 2 = Failed
// (Note: Previous dev confused this with PayHere where 2=Success)

const PaymentReturnScreen = () => {
  const [searchParams] = useSearchParams();
  const { userInfo } = useUser();
  const { clearCart } = useCart();

  const [pageState, setPageState] = useState('loading'); // loading | success | failed | pending
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const processReturn = async () => {
      try {
        // Read PAYable redirect params from URL
        const status = searchParams.get('status') || searchParams.get('statusCode');
        const invoiceId = searchParams.get('invoiceId') || searchParams.get('invoice_id') || searchParams.get('invoiceNo');
        const transactionId = searchParams.get('transactionId') || searchParams.get('transaction_id') || searchParams.get('paymentId');

        // Get the pending order ID we stored before the redirect
        const orderId = sessionStorage.getItem('pendingOrderId');

        if (!orderId) {
          // No pending order — could be a direct visit or session lost
          setPageState('failed');
          setError('We could not find your order. If payment was taken, please contact support.');
          return;
        }
        let attempts = 0;
        let isConfirmed = false;

        while (attempts < 10 && !isConfirmed) {
          const { data } = await axios.post('/api/payment/confirm', { orderId });
          
          if (data.success === true) {
            sessionStorage.removeItem('pendingOrderId');
            clearCart();
            setOrder(data.order);
            
            // Track Purchase event
            ReactPixel.track('Purchase', {
              value: data.order.totalPrice,
              currency: 'LKR',
              content_ids: data.order.orderItems.map(item => item.product),
              num_items: data.order.orderItems.reduce((acc, item) => acc + item.qty, 0)
            });
            
            setPageState('success');
            isConfirmed = true;
          } else if (data.success === false) {
            sessionStorage.removeItem('pendingOrderId');
            setPageState('failed');
            setError(data.message || 'Your payment was not completed.');
            isConfirmed = true;
          } else {
            // success is 'pending', wait 2 seconds and check again
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
          }
        }

        if (!isConfirmed) {
           sessionStorage.removeItem('pendingOrderId');
           setPageState('failed');
           setError('Payment is taking longer than expected to confirm. Please check your profile or email for the receipt later.');
        }

        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Payment return error:', err);
        setPageState('failed');
        setError(
          err.response?.data?.message || 'Something went wrong confirming your payment. Please contact support.'
        );
      }
    };

    processReturn();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading State ──────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <div
        className="container"
        style={{ padding: '120px 24px 60px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}
      >
        <Loader size={48} />
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
          Confirming your payment, please wait…
        </p>
      </div>
    );
  }

  // ── Success State ──────────────────────────────────────────────────────────
  if (pageState === 'success' && order) {
    return (
      <div className="container" style={{ padding: '120px 24px 60px', textAlign: 'center', minHeight: '80vh' }}>
        <div
          style={{
            maxWidth: '640px',
            margin: 'auto',
            backgroundColor: 'var(--color-bg)',
            padding: '4rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#f0faf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
            }}
          >
            <CheckCircle size={56} color="var(--color-primary)" />
          </div>

          <h1 className="title-medium" style={{ marginBottom: '0.75rem' }}>
            Payment Successful!
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
            Thank you for your order.
          </p>
          <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>
            Your order number is{' '}
            <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>
              #{order.orderNumber}
            </strong>
          </p>

          {/* Order items summary */}
          <div
            style={{
              backgroundColor: '#fafafa',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginBottom: '1rem', fontWeight: 600 }}>
              Items Ordered
            </p>
            {order.orderItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0',
                  borderBottom: i < order.orderItems.length - 1 ? '1px solid #eee' : 'none',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                    Size: {item.size} × {item.qty}
                  </p>
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Rs. {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px solid #eee',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              <span>Total Paid</span>
              <span>Rs. {order.totalPrice.toLocaleString()} LKR</span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '2.5rem' }}>
            A confirmation email has been sent to{' '}
            <strong>{order.shippingAddress.email}</strong>.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
            {userInfo && (
              <Link to="/profile" className="btn btn-outline">
                View My Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Failed / Cancelled State ───────────────────────────────────────────────
  return (
    <div className="container" style={{ padding: '120px 24px 60px', textAlign: 'center', minHeight: '80vh' }}>
      <div
        style={{
          maxWidth: '560px',
          margin: 'auto',
          backgroundColor: 'var(--color-bg)',
          padding: '4rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#fff0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
          }}
        >
          <XCircle size={56} color="#d32f2f" />
        </div>

        <h1 className="title-medium" style={{ marginBottom: '0.75rem' }}>
          Payment Failed
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
          {error || 'Your payment was not completed. No charges were made.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/checkout"
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={18} /> Try Again
          </Link>
          <Link to="/" className="btn btn-outline">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturnScreen;
