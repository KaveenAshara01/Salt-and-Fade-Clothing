import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Loader from '../../components/Loader';
import axios from 'axios';

const CollectionEditScreen = () => {
  const { id: collectionId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [publicId, setPublicId] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isCreateMode = !collectionId;

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/collections/${collectionId}`);
        setName(data.name);
        setImage(data.image);
        setPublicId(data.public_id || '');
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (!isCreateMode) {
      fetchCollection();
    }
  }, [collectionId, isCreateMode]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/upload?folder=collections', formData, config);
      setImage(data.image);
      setPublicId(data.public_id);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const collectionData = {
        name,
        image,
        description,
        public_id: publicId,
      };

      if (isCreateMode) {
        await axios.post('/api/collections', collectionData, config);
      } else {
        await axios.put(`/api/collections/${collectionId}`, collectionData, config);
      }

      setLoadingUpdate(false);
      navigate('/admin/collectionlist');
    } catch (err) {
      setErrorUpdate(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="container" style={{ padding: '120px 24px 60px' }}>
      <Link to="/admin/collectionlist" className="flex-center" style={{ gap: '0.5rem', width: 'fit-content', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Go Back
      </Link>

      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
        <h1 className="title-medium" style={{ marginBottom: '2rem' }}>{isCreateMode ? 'Create Collection' : 'Edit Collection'}</h1>

        {errorUpdate && <div style={{ backgroundColor: '#F8D7DA', color: '#721C24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{errorUpdate}</div>}
        {loading ? (
          <div className="flex-center" style={{ minHeight: '200px' }}>
            <Loader size={60} />
          </div>
        ) : error ? (
          <div style={{ color: 'var(--color-error)' }}>{error}</div>
        ) : (
          <form onSubmit={submitHandler}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Collection Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image Path / Upload</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" className="input-field" value={image} onChange={(e) => setImage(e.target.value)} />
                <label className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={18} /> Upload Image
                  <input type="file" style={{ display: 'none' }} onChange={uploadFileHandler} />
                </label>
              </div>
              {uploading && <div className="flex-center" style={{ marginTop: '0.5rem' }}><Loader size={20} /></div>}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
              <textarea 
                className="input-field" 
                rows="4" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', gap: '0.75rem', padding: '1rem' }}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? <Loader size={20} /> : <Save size={20} />}
              {isCreateMode ? 'Create Collection' : 'Update Collection'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CollectionEditScreen;
