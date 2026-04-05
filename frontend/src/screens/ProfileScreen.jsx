import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, ShoppingBag, Package, ChevronRight, LogOut, Clock, Truck, CheckCircle } from 'lucide-react';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('userInfo')));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return '#3B82F6'; // Blue
      case 'Shipped': return '#8B5CF6'; // Purple
      case 'Delivered': return '#10B981'; // Green
      case 'Cancelled': return '#EF4444'; // Red
      default: return 'var(--color-text-light)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock size={16} />;
      case 'Shipped': return <Truck size={16} />;
      case 'Delivered': return <CheckCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container" style={{ padding: '120px 24px 60px', minHeight: '80vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) 1fr', gap: '4rem', alignItems: 'start' }}>
        
        {/* Sidebar Info */}
        <aside style={{ backgroundColor: 'var(--color-bg)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--color-primary)' }}>
              <User size={40} />
           </div>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{userInfo.name}</h2>
           <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '2rem' }}>{userInfo.email}</p>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={logoutHandler} className="btn btn-outline" style={{ border: 'none', width: '100%', color: 'var(--color-error)', gap: '0.5rem' }}>
                 <LogOut size={18} /> Sign Out
              </button>
           </div>
        </aside>

        {/* Main Content: Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <ShoppingBag size={24} />
              <h1 className="title-medium" style={{ margin: 0 }}>My Orders</h1>
           </div>

           {loading ? (
             <div className="flex-center" style={{ minHeight: '300px' }}>
                <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
             </div>
           ) : error ? (
             <div style={{ padding: '2rem', backgroundColor: '#fff5f5', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)' }}>{error}</div>
           ) : orders.length === 0 ? (
             <div style={{ padding: '4rem', backgroundColor: '#fafafa', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
                <Link to="/" className="btn btn-primary">Start Shopping</Link>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order) => (
                  <div key={order._id} style={{ border: '1px solid #f0f0f0', borderRadius: 'var(--radius-md)', backgroundColor: '#fff', overflow: 'hidden' }}>
                    
                    {/* Order Header */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                       <div style={{ display: 'flex', gap: '2rem' }}>
                          <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Order Number</p>
                            <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>#{order.orderNumber}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Date Placed</p>
                            <p style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Total Amount</p>
                            <p style={{ fontWeight: 700 }}>Rs. {order.totalPrice.toLocaleString()}</p>
                          </div>
                       </div>
                       <div style={{ 
                         display: 'flex', 
                         alignItems: 'center', 
                         gap: '0.5rem', 
                         padding: '6px 14px', 
                         borderRadius: '20px', 
                         backgroundColor: `${getStatusColor(order.status)}15`, 
                         color: getStatusColor(order.status),
                         fontWeight: 600,
                         fontSize: '0.85rem'
                       }}>
                          {getStatusIcon(order.status)}
                          {order.status}
                       </div>
                    </div>

                    {/* Order Items List */}
                    <div style={{ padding: '1.5rem' }}>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                               <img src={item.image} alt={item.name} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                               <div style={{ flex: 1 }}>
                                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Size: {item.size} × {item.qty}</p>
                               </div>
                               <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Rs. {(item.price * item.qty).toLocaleString()}</p>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Order Footer - Tracking */}
                    {order.trackingId && (
                       <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f0f4f2', borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tracking ID:</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '2px' }}>{order.trackingId}</span>
                       </div>
                    )}
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
