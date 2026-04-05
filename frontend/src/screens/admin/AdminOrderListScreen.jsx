import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Search, ExternalLink, Edit, CheckCircle, Truck, Package, Clock, X } from 'lucide-react';

const AdminOrderListScreen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Update State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newTrackingId, setNewTrackingId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const updateStatusHandler = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/orders/${selectedOrder._id}/status`, { status: newStatus, trackingId: newTrackingId }, config);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return '#3B82F6';
      case 'Shipped': return '#8B5CF6';
      case 'Delivered': return '#10B981';
      case 'Cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.includes(searchTerm) || 
    o.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '120px 24px 60px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="title-medium">Order Management</h1>
        <div style={{ position: 'relative', width: '300px' }}>
           <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
           <input 
             type="text" 
             placeholder="Search by ID or Email..." 
             className="input-field" 
             style={{ paddingLeft: '40px' }} 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '400px' }}>
           <div className="spin" style={{ width: '50px', height: '50px', border: '5px solid #eee', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', backgroundColor: '#fff5f5', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)' }}>{error}</div>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-light)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1.5rem' }}>Order ID</th>
                <th style={{ padding: '1.5rem' }}>Customer</th>
                <th style={{ padding: '1.5rem' }}>Date</th>
                <th style={{ padding: '1.5rem' }}>Total</th>
                <th style={{ padding: '1.5rem' }}>Status</th>
                <th style={{ padding: '1.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #f5f5f5', fontSize: '0.95rem' }}>
                  <td style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>#{order.orderNumber}</td>
                  <td style={{ padding: '1.5rem' }}>
                    <p style={{ fontWeight: 600 }}>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{order.shippingAddress.email}</p>
                  </td>
                  <td style={{ padding: '1.5rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1.5rem', fontWeight: 600 }}>Rs. {order.totalPrice.toLocaleString()}</td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      backgroundColor: `${getStatusColor(order.status)}15`, 
                      color: getStatusColor(order.status),
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setNewTrackingId(order.trackingId || '');
                        }} 
                        style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                         <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '450px', borderRadius: 'var(--radius-lg)', padding: '2.5rem', position: 'relative' }}>
             <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--color-text-light)', border: 'none', background: 'none', cursor: 'pointer' }}>
               <X size={24} />
             </button>
             <h3 className="title-small" style={{ marginBottom: '2rem' }}>Update Order #{selectedOrder.orderNumber}</h3>
             
             <form onSubmit={updateStatusHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Order Status</label>
                   <select className="input-field" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                   </select>
                </div>
                
                <div>
                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Tracking ID</label>
                   <input 
                     type="text" 
                     className="input-field" 
                     placeholder="Enter tracking number..." 
                     value={newTrackingId} 
                     onChange={(e) => setNewTrackingId(e.target.value)} 
                   />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                   <button type="button" onClick={() => setSelectedOrder(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                   <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isUpdating}>
                      {isUpdating ? 'Saving...' : 'Update Status'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderListScreen;
