import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';

const CollectionListScreen = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/collections', config);
      setCollections(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.isAdmin) {
      fetchCollections();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/collections/${id}`, config);
        setMessage('Collection deleted');
        fetchCollections();
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

  const createCollectionHandler = async () => {
    navigate('/admin/collection/create');
  };

  return (
    <div className="container" style={{ padding: '120px 24px 60px' }}>
      <AdminNav />
      <div className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title-medium">Collections</h1>
        <button className="btn btn-primary" onClick={createCollectionHandler} style={{ gap: '0.5rem' }}>
          <Plus size={18} /> Create Collection
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
          <table className="admin-table-responsive" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--color-white)', boxShadow: 'var(--shadow-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>NAME</th>
                <th style={{ padding: '1rem' }}>IMAGE</th>
                <th style={{ padding: '1rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr key={collection._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td data-label="ID" style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{collection._id}</td>
                  <td data-label="NAME" style={{ padding: '1rem', fontWeight: 500 }}>{collection.name}</td>
                  <td data-label="IMAGE" style={{ padding: '1rem' }}>
                    {collection.image && (
                      <img 
                        src={collection.image} 
                        alt={collection.name} 
                        style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    )}
                  </td>
                  <td data-label="ACTIONS" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <Link to={`/admin/collection/${collection._id}/edit`} style={{ color: 'var(--color-primary)' }}>
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => deleteHandler(collection._id)} style={{ color: 'var(--color-error)' }}>
                        <Trash size={18} />
                      </button>
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

export default CollectionListScreen;
