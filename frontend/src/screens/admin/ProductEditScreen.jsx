import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Loader from '../../components/Loader';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStockS, setCountInStockS] = useState(0);
  const [countInStockM, setCountInStockM] = useState(0);
  const [countInStockL, setCountInStockL] = useState(0);
  const [countInStockXL, setCountInStockXL] = useState(0);
  const [description, setDescription] = useState('');
  const [sizeChart, setSizeChart] = useState({ url: '', public_id: '' });
  const isCreateMode = !productId || productId === 'create';
  const [collectionId, setCollectionId] = useState('');
  const [collections, setCollections] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Quill Modules/Formats
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get('/api/collections');
        setCollections(data);
      } catch (err) {
        console.error('Error fetching collections:', err);
      }
    };

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImages(data.images || []);
        setCategory(data.category);
        setCountInStockS(data.countInStock?.S || 0);
        setCountInStockM(data.countInStock?.M || 0);
        setCountInStockL(data.countInStock?.L || 0);
        setCountInStockXL(data.countInStock?.XL || 0);
        setDescription(data.description);
        setCollectionId(data.collectionRef?._id || '');
        setSizeChart(data.sizeChart || { url: '', public_id: '' });
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (!isCreateMode) {
      fetchProduct();
    }
    fetchCollections();
  }, [productId, isCreateMode]);

  const uploadFileHandler = async (e, type = 'gallery') => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    if (type === 'gallery') setUploading(true);
    else setLoadingUpdate(true); // Reuse loading state for size chart upload

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const folder = type === 'gallery' ? 'products' : 'sizecharts';
      const { data } = await axios.post(`/api/upload?folder=${folder}`, formData, config);
      
      if (type === 'gallery') {
        setImages([...images, { url: data.image, public_id: data.public_id }]);
        setUploading(false);
      } else {
        setSizeChart({ url: data.image, public_id: data.public_id });
        setLoadingUpdate(false);
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
      setLoadingUpdate(false);
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

      const productData = {
        name,
        price,
        images,
        category,
        countInStock: {
          S: countInStockS,
          M: countInStockM,
          L: countInStockL,
          XL: countInStockXL,
        },
        description,
        collectionRef: collectionId || null,
        sizeChart,
      };

      if (isCreateMode) {
        await axios.post('/api/products', productData, config);
      } else {
        await axios.put(`/api/products/${productId}`, productData, config);
      }

      setLoadingUpdate(false);
      navigate('/admin/productlist');
    } catch (err) {
      setErrorUpdate(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="container" style={{ padding: '120px 24px 60px' }}>
      <Link to="/admin/productlist" className="flex-center" style={{ gap: '0.5rem', width: 'fit-content', marginBottom: '2rem', hover: { color: 'var(--color-primary)' } }}>
        <ArrowLeft size={18} /> Go Back
      </Link>

      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
        <h1 className="title-medium" style={{ marginBottom: '2rem' }}>{isCreateMode ? 'Create Product' : 'Edit Product'}</h1>

        {errorUpdate && <div style={{ backgroundColor: '#F8D7DA', color: '#721C24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{errorUpdate}</div>}
        {loading ? (
          <div className="flex-center" style={{ minHeight: '200px' }}>
            <Loader size={60} />
          </div>
        ) : error ? (
          <div style={{ color: 'var(--color-error)' }}>{error}</div>
        ) : (
          <form onSubmit={submitHandler} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Product Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Price (LKR)</label>
              <input type="number" className="input-field" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Category</label>
              <input type="text" className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stock (S)</label>
                <input type="number" className="input-field" value={countInStockS} onChange={(e) => setCountInStockS(Number(e.target.value))} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stock (M)</label>
                <input type="number" className="input-field" value={countInStockM} onChange={(e) => setCountInStockM(Number(e.target.value))} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stock (L)</label>
                <input type="number" className="input-field" value={countInStockL} onChange={(e) => setCountInStockL(Number(e.target.value))} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stock (XL)</label>
                <input type="number" className="input-field" value={countInStockXL} onChange={(e) => setCountInStockXL(Number(e.target.value))} required />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Collection</label>
              <select 
                className="input-field" 
                value={collectionId} 
                onChange={(e) => setCollectionId(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                <option value="">No Collection</option>
                {collections.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Product Gallery</label>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {images.map((img, index) => (
                  <div key={index} style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)', height: '120px' }}>
                    <img src={img.url} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                
                <label className="flex-center" style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', height: '120px', cursor: 'pointer', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-light)' }}>
                  <Upload size={24} />
                  <span style={{ fontSize: '0.8rem' }}>Add Image</span>
                  <input type="file" style={{ display: 'none' }} onChange={(e) => uploadFileHandler(e, 'gallery')} />
                </label>
              </div>
              {uploading && <div className="flex-center" style={{ marginBottom: '1rem' }}><Loader size={20} /></div>}
            </div>

            {/* Size Chart Section */}
            <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '1rem' }}>
               <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Size Chart (Optional)</label>
               {sizeChart && sizeChart.url ? (
                 <div style={{ position: 'relative', width: '200px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img src={sizeChart.url} alt="Size Chart" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    <button 
                      type="button" 
                      onClick={() => setSizeChart({ url: '', public_id: '' })}
                      style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                    >
                      &times;
                    </button>
                 </div>
               ) : (
                 <label className="flex-center" style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', height: '100px', width: '200px', cursor: 'pointer', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-light)' }}>
                   <Upload size={20} />
                   <span style={{ fontSize: '0.8rem' }}>Upload Size Chart</span>
                   <input type="file" style={{ display: 'none' }} onChange={(e) => uploadFileHandler(e, 'sizechart')} />
                 </label>
               )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
              <div className="quill-editor-wrapper">
                <ReactQuill 
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={quillModules}
                  formats={quillFormats}
                  style={{ height: '200px', marginBottom: '50px' }}
                />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', gap: '0.75rem', padding: '1rem' }}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? <Loader size={20} /> : <Save size={20} />}
                {isCreateMode ? 'Create Product' : 'Update Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;
