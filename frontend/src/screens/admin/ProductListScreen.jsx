import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash, ExternalLink } from 'lucide-react';
import axios from 'axios';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/products', config);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        setMessage('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

  const createProductHandler = () => {
    navigate('/admin/product/create');
  };

  return (
    <div className="container" style={{ padding: '120px 24px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title-medium">Products</h1>
        <button className="btn btn-primary" onClick={createProductHandler} style={{ gap: '0.5rem' }}>
          <Plus size={18} /> Create Product
        </button>
      </div>

      {message && <div style={{ backgroundColor: '#D4EDDA', color: '#155724', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
      {error && <div style={{ backgroundColor: '#F8D7DA', color: '#721C24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="flex-center" style={{ minHeight: '200px' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--color-white)', boxShadow: 'var(--shadow-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>PHOTO</th>
                <th style={{ padding: '1rem' }}>NAME</th>
                <th style={{ padding: '1rem' }}>PRICE</th>
                <th style={{ padding: '1rem' }}>CATEGORY</th>
                <th style={{ padding: '1rem' }}>COLLECTION</th>
                <th style={{ padding: '1rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{product._id}</td>
                  <td style={{ padding: '1rem' }}>
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0].url : '/images/sample.jpg'} 
                      alt={product.name} 
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '1rem' }}>Rs. {product.price.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{product.category}</td>
                  <td style={{ padding: '1rem' }}>{product.collectionRef ? product.collectionRef.name : '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <Link to={`/admin/product/${product._id}/edit`} style={{ color: 'var(--color-primary)' }}>
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => deleteHandler(product._id)} style={{ color: 'var(--color-error)' }}>
                        <Trash size={18} />
                      </button>
                      <Link to={`/product/${product._id}`} target="_blank" style={{ color: 'var(--color-text-light)' }}>
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
